# Generated by Django 3.2.3 on 2021-09-16 09:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0016_auto_20210909_0946'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pdmon',
            name='channels',
        ),
    ]
