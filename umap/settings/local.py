# -*- coding:utf-8 -*-

"""
Example settings for local development

Use this file as a base for your local development settings and copy
it to umap/settings/local.py. It should not be checked into
your code repository.

"""

from umap.settings.base import *   # pylint: disable=W0614,W0401

SECRET_KEY = 'hello,world'
INTERNAL_IPS = ('127.0.0.1', )
ALLOWED_HOSTS = ['*', ]

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    ('You', 'your@email'),
)
MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'umap',
    }
}

WSGI_APPLICATION = 'umap.wsgi.application'

COMPRESS_ENABLED = False
COMPRESS_OFFLINE = True

LANGUAGE_CODE = 'zh'

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)
SOCIAL_AUTH_GITHUB_KEY = 'xxx'
SOCIAL_AUTH_GITHUB_SECRET = 'xxx'
SOCIAL_AUTH_BITBUCKET_KEY = 'xxx'
SOCIAL_AUTH_BITBUCKET_SECRET = 'xxx'
# We need email to associate with other Oauth providers
SOCIAL_AUTH_GITHUB_SCOPE = ["user:email", ]
SOCIAL_AUTH_TWITTER_KEY = "xxx"
SOCIAL_AUTH_TWITTER_SECRET = "xxx"
SOCIAL_AUTH_OPENSTREETMAP_KEY = 'xxx'
SOCIAL_AUTH_OPENSTREETMAP_SECRET = 'xxx'
MIDDLEWARE_CLASSES += (
    'social.apps.django_app.middleware.SocialAuthExceptionMiddleware',
)
SOCIAL_AUTH_RAISE_EXCEPTIONS = False
SOCIAL_AUTH_BACKEND_ERROR_URL = "/"

# UMAP_DEMO_PK = 204
# UMAP_SHOWCASE_PK = 1156
LEAFLET_STORAGE_ALLOW_ANONYMOUS = True
UMAP_DEMO_SITE = False

# This setting will exclude empty maps (in fact, it will exclude all maps where
# the default center has not been updated)
UMAP_EXCLUDE_DEFAULT_MAPS = False

# How many maps should be showcased on the main page resp. on the user page
UMAP_MAPS_PER_PAGE = 5
# How many maps should be showcased on the user page, if owner
UMAP_MAPS_PER_PAGE_OWNER = 10

SITE_URL = "http://localhost:8019"
SHORT_SITE_URL = "http://s.hort"

# CACHES = {
#     'default': {
#         'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
#         'LOCATION': '/var/tmp/django_cache',
#     }
# }

# POSTGIS_VERSION = (2, 1, 0)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# You need to unable accent extension before using UMAP_USE_UNACCENT
# python manage.py dbshell
# CREATE EXTENSION unaccent;
UMAP_USE_UNACCENT = False

# For static deployment
#STATIC_ROOT = '/Users/xiongjiabin/umap/umap/caina'

# For users' statics (geojson mainly)
#MEDIA_ROOT = '/Users/xiongjiabin/umap/umap/uploads'

# MapQuest API key
MAPQUEST_KEY = ''

# Default map location for new maps
LEAFLET_STORAGE_KEEP_VERSIONS = 10
LEAFLET_LONGITUDE = 2
LEAFLET_LATITUDE = 51
LEAFLET_ZOOM = 6
