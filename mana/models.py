from __future__ import unicode_literals

from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db import models
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
# Create your models here.

class Company(models.Model):

    def __unicode__(self):
        return self.name

    name = models.CharField(max_length=80, null=True)
    short_name = models.CharField(max_length=10, blank=True)
    addr = models.CharField(max_length=100, null=True, blank=True)
    faren = models.CharField(max_length=10, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    fax = models.CharField(max_length=20, null=True, blank=True)
    province = models.CharField(max_length=20, null=True, blank=True)
    city = models.CharField(max_length=20, null=True, blank=True)
    homepage = models.CharField(max_length=100, null=True, blank=True)
    addtime = models.DateField()

class ProfileBase(type):
    def __new__(cls, name, bases, attrs):
        module = attrs.pop('__module__')
        parents = [b for b in bases if isinstance(b, ProfileBase)]
        if parents:
            fields = []
            for obj_name, obj in attrs.items():
                if isinstance(obj, models.Field):
                    fields.append(obj_name)
                User.add_to_class(obj_name, obj)
            UserAdmin.fieldsets = list(UserAdmin.fieldsets)
            UserAdmin.fieldsets.append((name, {'fields':fields}))
        return super(ProfileBase, cls).__new__(cls, name, bases, attrs)

class ProfileUser(object):
    __metaclass__ = ProfileBase

class ExtraInfo(ProfileUser):
    company = models.ForeignKey(Company, related_name='company', blank=True, null=True)




