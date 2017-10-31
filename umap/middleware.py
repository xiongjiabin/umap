from __future__ import unicode_literals
import re

import json
from django.utils.encoding import smart_bytes
from django.http import (HttpResponse)
from django.conf import settings
from django.urls import reverse
from django.shortcuts import redirect
from django.contrib.auth import logout, login
from django.contrib.auth.models import AnonymousUser
from .backends import ModelBackend
try:
    from django.utils.deprecation import MiddlewareMixin
except ImportError:
    MiddlewareMixin = object

EXEMPT_URLS = [re.compile(settings.LOGIN_URL.lstrip('/'))]
if hasattr(settings, 'LOGIN_EXEMPT_URLS'):
    EXEMPT_URLS += [re.compile(url) for url in settings.LOGIN_EXEMPT_URLS]

TOKEN_NAME = getattr(settings, 'UMAP_TOKEN_NAME', 'url_auth_token')

class AuthenticationMiddleware(MiddlewareMixin):

    def process_request(self, request):
        token = request.GET.get(TOKEN_NAME)
        if token is None:
            return
        user = ModelBackend().authenticate(url_auth_token=token)
        if user is None:
            return
        if hasattr(request, 'session') and user is not None:
            login(request, user)

        if not hasattr(request, 'user'):
            request.user = user if user is not None else AnonymousUser

class LoginRequiredMiddleware:

    def __init__(self, get_response=None):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        assert hasattr(request, 'user')
        path = request.path_info.lstrip('/')
        #print "path:" + path
        url_is_exempt = any(url.match(path) for url in EXEMPT_URLS)

        if path == reverse('admin:logout').lstrip('/'):
            logout(request)

        if url_is_exempt:
            #white list'
            return None
        if not request.user.is_authenticated():
            #print 'need authenticated'
            if request.is_ajax():
                retjson = {
                    "ret":-1,
                    "msg":'need authenticate'
                }
                return HttpResponse(json.dumps(retjson))
            else:
                return redirect(settings.LOGIN_URL + path)
        else:
            return None
