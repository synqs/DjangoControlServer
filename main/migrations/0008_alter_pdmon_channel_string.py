# Generated by Django 3.2.3 on 2021-07-07 11:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0007_rename_channels_pdmon_channel_string'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pdmon',
            name='channel_string',
            field=models.CharField(default='0,1,2,3,4,5,6,7,8,9,10,11', max_length=27),
        ),
    ]