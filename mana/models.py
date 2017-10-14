from __future__ import unicode_literals

from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.contrib.gis.db import models
# Create your models here.

class Company(models.Model):

    memberid = models.BigIntegerField()
    name = models.CharField(max_length=80)
    addr = models.CharField(max_length=100)
    faren = models.CharField(max_length=10)
    phone = models.CharField(max_length=20)
    fax = models.CharField(max_length=20)
    province = models.CharField(max_length=20)
    city = models.CharField(max_length=20)
    homepage = models.CharField(max_length=100)
    addtime = models.DateField()

class BelongTo(models.Model):
    user = models.OneToOneField(User)
    company = models.ForeignKey(Company, null=True, related_name='com')
