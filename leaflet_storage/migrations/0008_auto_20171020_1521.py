# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-10-20 07:21
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leaflet_storage', '0007_map_company_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='map',
            name='company_id',
            field=models.IntegerField(default=0, editable=False),
        ),
    ]
