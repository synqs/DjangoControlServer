# Generated by Django 3.2.3 on 2021-10-29 08:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('arduino', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='psupp',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=20, unique=True)),
                ('description', models.CharField(blank=True, max_length=100)),
                ('ip', models.CharField(blank=True, max_length=20)),
            ],
            options={
                'verbose_name': 'Psupp',
            },
        ),
        migrations.CreateModel(
            name='thsen',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=20, unique=True)),
                ('description', models.CharField(blank=True, max_length=100)),
                ('ip', models.CharField(blank=True, max_length=20)),
            ],
            options={
                'verbose_name': 'THsen',
            },
        ),
    ]