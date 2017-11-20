from django.conf import settings as djsettings

from . import __version__


def settings(request):
    return {
        #'UMAP_FEEDBACK_LINK': djsettings.UMAP_FEEDBACK_LINK,
        'UMAP_JIAOAN_LINK': djsettings.UMAP_JIAOAN_LINK,
        'SITE_NAME': djsettings.SITE_NAME,
        'UMAP_ABOUT_LINK': djsettings.UMAP_ABOUT_LINK,
        'UMAP_JIAOAN_ABOUT': djsettings.UMAP_JIAOAN_ABOUT,
    }


def version(request):
    return {
        'UMAP_VERSION': __version__
    }
