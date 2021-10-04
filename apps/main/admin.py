from django.contrib import admin
from arduino.models import pdmon, tctrl
from mokugo.models import mokugo
from redpitaya.models import redpitaya
from slackbot.models import slackbot

from .models import device

# Register your models here.
admin.site.register(pdmon)
admin.site.register(tctrl)
admin.site.register(mokugo)
admin.site.register(redpitaya)
admin.site.register(slackbot)

admin.site.register(device)
