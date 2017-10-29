# -*- coding:utf-8 -*-

import os
import hashlib
import json

from django.conf import settings
from django.contrib import messages
from django.contrib.auth import logout as do_logout
from django.contrib.auth import get_user_model
from django.core.signing import Signer, BadSignature
from django.core.urlresolvers import reverse_lazy, reverse
from django.http import (HttpResponse, HttpResponseForbidden,
                         HttpResponseRedirect, HttpResponsePermanentRedirect)
from django.shortcuts import get_object_or_404, redirect
from django.template.loader import render_to_string
from django.utils.translation import ugettext as _
from django.views.generic import View
from django.views.generic import DetailView
from django.views.generic.detail import BaseDetailView
from django.views.generic.list import ListView
from django.views.generic.base import TemplateView, RedirectView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.utils.encoding import force_bytes
from django.utils.http import http_date
from django.middleware.gzip import re_accepts_gzip
from django.utils.translation import to_locale

from .models import Map, DataLayer, TileLayer, Pictogram, Licence
from .utils import get_uri_template, gzip_file
from .forms import (DataLayerForm, UpdateMapPermissionsForm, MapSettingsForm,
                    AnonymousMapPermissionsForm, DEFAULT_LATITUDE,
                    DEFAULT_LONGITUDE, FlatErrorList)

User = get_user_model()
ANONYMOUS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30  # One month


# ############## #
#     Utils      #
# ############## #

def _urls_for_js(urls=None):
    """
    Return templated URLs prepared for javascript.
    """
    if urls is None:
        # prevent circular import
        from .urls import urlpatterns
        urls = [url.name for url in urlpatterns if getattr(url, 'name', None)]
    urls = dict(zip(urls, [get_uri_template(url) for url in urls]))
    urls.update(getattr(settings, 'LEAFLET_STORAGE_EXTRA_URLS', {}))
    return urls


def render_to_json(templates, context, request):
    """
    Generate a JSON HttpResponse with rendered template HTML.
    """
    html = render_to_string(
        templates,
        context=context,
        request=request
    )
    _json = json.dumps({
        "html": html
    })
    return HttpResponse(_json)


def simple_json_response(**kwargs):
    return HttpResponse(json.dumps(kwargs))


# ############## #
#      Map       #
# ############## #


class FormLessEditMixin(object):
    http_method_names = [u'post', ]

    def form_invalid(self, form):
        return simple_json_response(errors=form.errors,
                                    error=str(form.errors))

    def get_form(self):
        kwargs = self.get_form_kwargs()
        kwargs['error_class'] = FlatErrorList
        return self.get_form_class()(**kwargs)


class MapDetailMixin(object):

    model = Map

    def get_context_data(self, **kwargs):
        context = super(MapDetailMixin, self).get_context_data(**kwargs)
        properties = {
            'urls': _urls_for_js(),
            'tilelayers': self.get_tilelayers(),
            'allowEdit': self.is_edit_allowed(),
            'default_iconUrl': "%sstorage/src/img/marker.png" % settings.STATIC_URL,  # noqa
            'storage_id': self.get_storage_id(),
            'licences': dict((l.name, l.json) for l in Licence.objects.all()),
        }
        if self.get_short_url():
            properties['shortUrl'] = self.get_short_url()

        if settings.USE_I18N:
            locale = settings.LANGUAGE_CODE
            # Check attr in case the middleware is not active
            if hasattr(self.request, "LANGUAGE_CODE"):
                locale = self.request.LANGUAGE_CODE
            locale = to_locale(locale)
            properties['locale'] = locale
            context['locale'] = locale
        map_settings = self.get_geojson()
        if "properties" not in map_settings:
            map_settings['properties'] = {}
        map_settings['properties'].update(properties)
        map_settings['properties']['datalayers'] = self.get_datalayers()
        context['map_settings'] = json.dumps(map_settings,
                                             indent=settings.DEBUG)
        if hasattr(self.request.session, 'token'):
            context['token'] = self.request.session['token']
        return context

    def get_tilelayers(self):
        return TileLayer.get_list(selected=TileLayer.get_default())

    def get_datalayers(self):
        return []

    def is_edit_allowed(self):
        return True

    def get_storage_id(self):
        return None

    def get_geojson(self):
        return {
            "geometry": {
                "coordinates": [DEFAULT_LONGITUDE, DEFAULT_LATITUDE],
                "type": "Point"
            },
            "properties": {
                "zoom": getattr(settings, 'LEAFLET_ZOOM', 6),
                "datalayers": [],
            }
        }

    def get_short_url(self):
        return None

class MapView(MapDetailMixin, DetailView):

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        if self.object.company_id == request.user.company.id:
            canonical = self.get_canonical_url()
            if not request.path == canonical:
                if request.META.get('QUERY_STRING'):
                    canonical = "?".join([canonical, request.META['QUERY_STRING']])
                return HttpResponsePermanentRedirect(canonical)
            if not self.object.can_view(request):
                return HttpResponseForbidden('Forbidden')
            return super(MapView, self).get(request, *args, **kwargs)
        return HttpResponseForbidden('Forbidden')

    def get_canonical_url(self):
        self.object = self.get_object()
        if self.object.company_id == self.request.user.company.id:
            return self.object.get_absolute_url()
        return None

    def get_datalayers(self):
        self.object = self.get_object()
        if self.get_object().company_id == self.request.user.company.id:
            datalayers = DataLayer.objects.filter(map=self.object)
            return [l.metadata for l in datalayers]
        return None

    def get_tilelayers(self):
        self.object = self.get_object()
        if self.object.company_id == self.request.user.company.id:
            return TileLayer.get_list(selected=self.object.get_tilelayer())
        return None

    def is_edit_allowed(self):
        self.object = self.get_object()
        if self.object.company_id == self.request.user.company.id:
            return self.object.can_edit(self.request.user, self.request)
        return None

    def get_storage_id(self):
        self.object = self.get_object()
        if self.object.company_id == self.request.user.company.id:
            return self.object.pk
        return None

    def get_short_url(self):
        self.object = self.get_object()
        if self.object.company_id == self.request.user.company.id:
            shortUrl = None
            if hasattr(settings, 'SHORT_SITE_URL'):
                short_url_name = getattr(settings, 'MAP_SHORT_URL_NAME',
                                         'map_short_url')
                short_path = reverse_lazy(short_url_name,
                                          kwargs={'pk': self.object.pk})
                shortUrl = "%s%s" % (settings.SHORT_SITE_URL, short_path)
            return shortUrl
        return None

    def get_geojson(self):
        self.object = self.get_object()
        if self.object.company_id == self.request.user.company.id:
            map_settings = self.object.settings
            if "properties" not in map_settings:
                map_settings['properties'] = {}
            if self.object.owner and hasattr(settings, 'USER_MAPS_URL'):
                map_settings['properties']['author'] = {
                    'name': self.object.owner.get_username(),
                    'link': reverse(settings.USER_MAPS_URL,
                                    args=(self.object.owner.get_username(), ))
                }
            return map_settings
        return None


class MapViewGeoJSON(MapView):

    def get_canonical_url(self):
        return reverse('map_geojson', args=(self.object.pk, ))

    def render_to_response(self, context, *args, **kwargs):
        return HttpResponse(context['map_settings'])


class MapNew(MapDetailMixin, TemplateView):
    template_name = "leaflet_storage/map_detail.html"


class MapCreate(FormLessEditMixin, CreateView):
    model = Map
    form_class = MapSettingsForm

    def form_valid(self, form):
        if self.request.user.is_authenticated():
            form.instance.owner = self.request.user
            form.instance.company_id = self.request.user.company.id
        self.object = form.save()
        if not self.request.user.is_authenticated():
            anonymous_url = "%s%s" % (
                settings.SITE_URL,
                self.object.get_anonymous_edit_url()
            )
            msg = _(
                "Your map has been created! If you want to edit this map from "
                "another computer, please use this link: %(anonymous_url)s"
                % {"anonymous_url": anonymous_url}
            )
        else:
            msg = _("Congratulations, your map has been created!")
        response = simple_json_response(
            id=self.object.pk,
            url=self.object.get_absolute_url(),
            info=msg
        )
        if not self.request.user.is_authenticated():
            key, value = self.object.signed_cookie_elements
            response.set_signed_cookie(
                key=key,
                value=value,
                max_age=ANONYMOUS_COOKIE_MAX_AGE
            )
        return response


class MapUpdate(FormLessEditMixin, UpdateView):
    model = Map
    form_class = MapSettingsForm
    pk_url_kwarg = 'map_id'

    def form_valid(self, form):
        if self.object.company_id == self.request.user.company.id:
            self.object.settings = form.cleaned_data["settings"]
            self.object.save()
            return simple_json_response(
                id=self.object.pk,
                url=self.object.get_absolute_url(),
                info=_("Map has been updated!")
            )
        return simple_json_response(
            info=_("You have no permission!")
        )


class UpdateMapPermissions(UpdateView):
    template_name = "leaflet_storage/map_update_permissions.html"
    model = Map
    pk_url_kwarg = 'map_id'

    def get_form_class(self):
        if self.object.company_id == self.request.company.id:
            if self.object.owner:
                return UpdateMapPermissionsForm
            else:
                return AnonymousMapPermissionsForm
        return None

    def get_form(self, form_class=None):
        if self.object.company_id == self.request.company.id:
            form = super(UpdateMapPermissions, self).get_form(form_class)
            user = self.request.user
            if self.object.owner and not user == self.object.owner:
                del form.fields['edit_status']
                del form.fields['share_status']
                del form.fields['owner']
            return form
        return None

    def form_valid(self, form):
        if self.object.company_id == self.request.company.id:
            self.object = form.save()
            return simple_json_response(
                info=_("Map editors updated with success!"))
        return simple_json_response(
                info=_("You have no permission!"))

    def render_to_response(self, context, **response_kwargs):
        if self.object.company_id == self.request.company.id:
            context.update(response_kwargs)
            return render_to_json(self.get_template_names(), context, self.request)
        return None


class MapDelete(DeleteView):
    model = Map
    pk_url_kwarg = "map_id"

    def delete(self, *args, **kwargs):
        self.object = self.get_object()
        if self.object.owner and self.request.user != self.object.owner:
            return HttpResponseForbidden(
                _('Only its owner can delete the map.'))
        if not self.object.owner\
           and not self.object.is_anonymous_owner(self.request):
            return HttpResponseForbidden('Forbidden.')
        self.object.delete()
        return simple_json_response(redirect="/")


class MapClone(View):

    def post(self, *args, **kwargs):
        if kwargs['map_inst'].company_id == self.request.user.company.id:
            if not getattr(settings, "LEAFLET_STORAGE_ALLOW_ANONYMOUS", False) \
               and not self.request.user.is_authenticated():
                return HttpResponseForbidden('Forbidden')
            owner = self.request.user if self.request.user.is_authenticated() else None
            self.object = kwargs['map_inst'].clone(owner=owner)
            response = simple_json_response(redirect=self.object.get_absolute_url())
            if not self.request.user.is_authenticated():
                key, value = self.object.signed_cookie_elements
                response.set_signed_cookie(
                    key=key,
                    value=value,
                    max_age=ANONYMOUS_COOKIE_MAX_AGE
                )
                anonymous_url = "%s%s" % (
                    settings.SITE_URL,
                    self.object.get_anonymous_edit_url()
                )
                msg = _(
                    "Your map has been cloned! If you want to edit this map from "
                    "another computer, please use this link: %(anonymous_url)s"
                    % {"anonymous_url": anonymous_url}
                )
            else:
                msg = _("Congratulations, your map has been cloned!")
            messages.info(self.request, msg)
            return response
        msg = _("You have no permission!")
        return response


class MapShortUrl(RedirectView):
    query_string = True
    permanent = True

    def get_redirect_url(self, **kwargs):
        map_inst = get_object_or_404(Map, pk=kwargs['pk'])
        url = map_inst.get_absolute_url()
        if self.query_string:
            args = self.request.META.get('QUERY_STRING', '')
            if args:
                url = "%s?%s" % (url, args)
        return url


class MapOldUrl(RedirectView):
    """
    Handle map URLs from before anonymous allowing.
    """
    query_string = True
    permanent = True

    def get_redirect_url(self, **kwargs):
        owner = get_object_or_404(User, username=self.kwargs['username'])
        map_inst = get_object_or_404(Map, slug=self.kwargs['slug'],
                                     owner=owner)
        url = map_inst.get_absolute_url()
        if self.query_string:
            args = self.request.META.get('QUERY_STRING', '')
            if args:
                url = "%s?%s" % (url, args)
        return url


class MapAnonymousEditUrl(RedirectView):

    permanent = False

    def get(self, request, *args, **kwargs):
        signer = Signer()
        try:
            pk = signer.unsign(self.kwargs['signature'])
        except BadSignature:
            return HttpResponseForbidden('Bad Signature')
        else:
            map_inst = get_object_or_404(Map, pk=pk)
            url = map_inst.get_absolute_url()
            response = HttpResponseRedirect(url)
            if not map_inst.owner:
                key, value = map_inst.signed_cookie_elements
                response.set_signed_cookie(
                    key=key,
                    value=value,
                    max_age=ANONYMOUS_COOKIE_MAX_AGE
                )
            return response


# ############## #
#    DataLayer   #
# ############## #


class GZipMixin(object):

    EXT = '.gz'

    def _path(self):
        return self.object.geojson.path

    def path(self):
        """
        Serve gzip file if client accept it.
        Generate or update the gzip file if needed.
        """
        path = self._path()
        statobj = os.stat(path)
        ae = self.request.META.get('HTTP_ACCEPT_ENCODING', '')
        if re_accepts_gzip.search(ae) and getattr(settings, 'LEAFLET_STORAGE_GZIP', True):
            gzip_path = "{path}{ext}".format(path=path, ext=self.EXT)
            up_to_date = True
            if not os.path.exists(gzip_path):
                up_to_date = False
            else:
                gzip_statobj = os.stat(gzip_path)
                if statobj.st_mtime > gzip_statobj.st_mtime:
                    up_to_date = False
            if not up_to_date:
                gzip_file(path, gzip_path)
            path = gzip_path
        return path

    def etag(self):
        path = self.path()
        with open(path, mode='rb') as f:
            return hashlib.md5(f.read()).hexdigest()


class DataLayerView(GZipMixin, BaseDetailView):
    model = DataLayer

    def render_to_response(self, context, **response_kwargs):
        if self.object.map.company_id == self.request.user.company.id:
            response = None
            path = self.path()

            if getattr(settings, 'LEAFLET_STORAGE_XSENDFILE_HEADER', None):
                response = HttpResponse()
                path = path.replace(settings.MEDIA_ROOT, '/internal')
                response[settings.LEAFLET_STORAGE_XSENDFILE_HEADER] = path
            else:
                # TODO IMS
                statobj = os.stat(path)
                with open(path, 'rb') as f:
                    response = HttpResponse(
                        f.read(),  # should not be used in production!
                        content_type='application/json'
                    )
                response["Last-Modified"] = http_date(statobj.st_mtime)
                response['ETag'] = '%s' % hashlib.md5(force_bytes(response.content)).hexdigest()  # noqa
                response['Content-Length'] = len(response.content)
            if path.endswith(self.EXT):
                response['Content-Encoding'] = 'gzip'
            return response
        return HttpResponseForbidden('No permission')


class DataLayerVersion(DataLayerView):

    def _path(self):
        if self.object.map.company_id == self.request.user.company.id:
            return '{root}/{path}'.format(
                root=settings.MEDIA_ROOT,
                path=self.object.get_version_path(self.kwargs['name']))
        return None


class DataLayerCreate(FormLessEditMixin, GZipMixin, CreateView):
    model = DataLayer
    form_class = DataLayerForm

    def form_valid(self, form):
        form.instance.map = self.kwargs['map_inst']
        self.object = form.save()
        response = simple_json_response(**self.object.metadata)
        response['ETag'] = self.etag()
        return response


class DataLayerUpdate(FormLessEditMixin, GZipMixin, UpdateView):
    model = DataLayer
    form_class = DataLayerForm

    def form_valid(self, form):
        self.object = form.save()
        if self.object.map.company_id != self.request.company.id:
            return None
        response = simple_json_response(**self.object.metadata)
        response['ETag'] = self.etag()
        return response

    def if_match(self):
        """Optimistic concurrency control."""
        match = True
        if_match = self.request.META.get('HTTP_IF_MATCH')
        if if_match:
            etag = self.etag()
            if etag != if_match:
                match = False
        return match

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        if self.object.map.company_id == self.request.user.company.id:
            if self.object.map != self.kwargs['map_inst']:
                return HttpResponseForbidden('Route to nowhere')
            if not self.if_match():
                return HttpResponse(status=412)
            return super(DataLayerUpdate, self).post(request, *args, **kwargs)
        return HttpResponseForbidden('No Permission')


class DataLayerDelete(DeleteView):
    model = DataLayer

    def delete(self, *args, **kwargs):
        self.object = self.get_object()
        if self.object.map.company_id == self.request.user.company.id:
            if self.object.map != self.kwargs['map_inst']:
                return HttpResponseForbidden('Route to nowhere')
            self.object.delete()
            return simple_json_response(info=_("Layer successfully deleted."))
        return simple_json_response(info=_("You have no permission!"))


class DataLayerVersions(BaseDetailView):
    model = DataLayer

    def render_to_response(self, context, **response_kwargs):
        if self.get_object().map.company_id == self.request.user.company.id:
            return simple_json_response(versions=self.object.versions)
        return simple_json_response(info=_("You have no permission!"))


# ############## #
#     Picto      #
# ############## #

class PictogramJSONList(ListView):
    model = Pictogram

    def render_to_response(self, context, **response_kwargs):
        content = [p.json for p in Pictogram.objects.all()]
        return simple_json_response(pictogram_list=content)


# ############## #
#     Generic    #
# ############## #

def logout(request):
    do_logout(request)
    return redirect('/')


class LoginPopupEnd(TemplateView):
    """
    End of a loggin process in popup.
    Basically close the popup.
    """
    template_name = "leaflet_storage/login_popup_end.html"
