# Generated by Django 3.2.3 on 2021-09-30 13:50

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='mokugo',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=20, unique=True)),
                ('description', models.CharField(blank=True, max_length=100)),
                ('ip', models.CharField(blank=True, max_length=20)),
            ],
            options={
                'verbose_name': 'MokuGo',
            },
        ),
    ]
