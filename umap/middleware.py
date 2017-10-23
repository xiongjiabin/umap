import re

from django.conf import settings
from django.urls import reverse
from django.shortcuts import redirect
from django.contrib.auth import logout

EXEMPT_URLS = [re.compile(settings.LOGIN_URL.lstrip('/'))]
if hasattr(settings, 'LOGIN_EXEMPT_URLS'):
    EXEMPT_URLS += [re.compile(url) for url in settings.LOGIN_EXEMPT_URLS]
class LoginRequiredMiddleware:

    def __init__(self, get_response=None):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        assert hasattr(request, 'user')
        path = request.path_info.lstrip('/')
        url_is_exempt = any(url.match(path) for url in EXEMPT_URLS)

        if path == reverse('admin:logout').lstrip('/'):
            flag = str(request.session.get('next'))
            logout(request)
            request.session['next'] = flag
            return redirect(settings.LOGIN_URL + flag)

        if request.user.is_authenticated() and url_is_exempt:
            return redirect(settings.LOGIN_REDIRECT_URL)
        elif not request.user.is_authenticated() and url_is_exempt:
            return None
        elif request.user.is_authenticated() and not url_is_exempt:
            request.session['next'] = path
            return None
        else:
            if not url_is_exempt:
                request.session['next'] = path
            return redirect(settings.LOGIN_URL + path)