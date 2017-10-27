from __future__ import unicode_literals

from .backends import UrlAuthBackendMixin
from .middleware import TOKEN_NAME

try:
    from urllib.parse import urlencode
except ImportError:
    from urllib import urlencode

def get_parameters(user):
    return {TOKEN_NAME: UrlAuthBackendMixin().create_token(user)}

def get_query_string(user):
    return '?' + urlencode(get_parameters(user))
