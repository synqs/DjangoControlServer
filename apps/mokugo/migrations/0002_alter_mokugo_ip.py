# Generated by Django 3.2.3 on 2021-10-03 08:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mokugo', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mokugo',
            name='ip',
            field=models.CharField(max_length=20, unique=True),
        ),
    ]