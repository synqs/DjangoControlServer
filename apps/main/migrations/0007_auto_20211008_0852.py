# Generated by Django 3.2.3 on 2021-10-08 06:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_device_model'),
    ]

    operations = [
        migrations.AlterField(
            model_name='device',
            name='name',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='device',
            name='url',
            field=models.CharField(max_length=50),
        ),
    ]
