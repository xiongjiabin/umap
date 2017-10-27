from __future__ import unicode_literals

import hashlib
import logging
import struct


from django.conf import settings
from django.contrib.auth import backends as auth_backends
from django.core import signing
from django.utils import crypto


logger = logging.getLogger('umap')

class UrlAuthBackendMixin(object):
    salt = getattr(settings, 'UMAP_SALT', 'umap')
    digest = getattr(settings, 'UMAP_DIGEST', hashlib.md5)
    iterations = getattr(settings, 'UMAP_ITERATIONS', 10000)

    max_age = getattr(settings, 'UMAP_MAX_AGE', None)

    @property
    def signer(self):
        if self.max_age is None:
            return signing.Signer(salt=self.salt)
        else:
            return signing.TimestampSigner(salt=self.salt)

    def sign(self, data):
        data = signing.b64_encode(data).decode()
        return self.signer.sign(data)

    def unsign(self, token):
        if self.max_age is None:
            data = self.signer.unsign(token)
        else:
            data = self.signer.unsign(token, max_age=self.max_age)
        return signing.b64_decode(data.encode())

    def create_token(self, user):
        h = crypto.pbkdf2(
            user.password, self.salt, self.iterations, digest=self.digest
        )
        return self.sign(struct.pack(str('!i'), user.pk) + h)

    def parse_token(self, token):
        try:
            data = self.unsign(token)
        except signing.SignatureExpired:
            return
        except signing.BadSignature:
            return
        user = self.get_user(*struct.unpack(str('!i'), data[:4]))
        if user is None:
            return
        h = crypto.pbkdf2(
            user.password, self.salt, self.iterations, digest=self.digest
        )
        if not crypto.constant_time_compare(data[4:], h):
            return
        return user

class ModelBackend(UrlAuthBackendMixin, auth_backends.ModelBackend):
    def authenticate(self, url_auth_token=None):
        try:
            return self.parse_token(url_auth_token)
        except TypeError:
            backend = "%s.%s" % (self.__module__, self.__class__.__name__)
            logger.exception("TypeError in %s, here's the traceback before"
                             "Django swallows it:", backend)
            raise
