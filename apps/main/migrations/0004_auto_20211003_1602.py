# Generated by Django 3.2.3 on 2021-10-03 14:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_auto_20211003_1543'),
    ]

    operations = [
        migrations.AlterField(
            model_name='device',
            name='ip',
            field=models.CharField(default='0.0.0.0', max_length=20, unique=True),
        ),
        migrations.AlterField(
            model_name='device',
            name='name',
            field=models.CharField(default='name_text', max_length=20, unique=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='device',
            name='url',
            field=models.CharField(default='url/', max_length=50, unique=True),
            preserve_default=False,
        ),
    ]
