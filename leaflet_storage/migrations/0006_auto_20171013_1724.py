# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-10-13 09:24
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('leaflet_storage', '0005_auto_20171013_1207'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='map',
            name='company',
        ),
        migrations.DeleteModel(
            name='Company',
        ),
    ]