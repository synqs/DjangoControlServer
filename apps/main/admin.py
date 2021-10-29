from django.contrib import admin

from arduino.models import pdmon, tctrl, thsen
from mokugo.models import mokugo
from redpitaya.models import redpitaya
from slackbot.models import slackbot
from laser.models import laser

from .models import device

# Register your models here.
admin.site.register(laser)
admin.site.register(mokugo)
admin.site.register(pdmon)
admin.site.register(redpitaya)
admin.site.register(slackbot)
admin.site.register(tctrl)
admin.site.register(thsen)

admin.site.register(device)
