# Generated by Django 3.2.3 on 2021-09-28 06:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0019_alter_mokugo_session'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mokugo',
            name='session',
            field=models.BooleanField(default=False, editable=False),
        ),
    ]
