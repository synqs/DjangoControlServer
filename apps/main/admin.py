from django.contrib import admin
from arduino.models import pdmon, tctrl
from mokugo.models import mokugo

# Register your models here.
admin.site.register(pdmon)
admin.site.register(tctrl)
admin.site.register(mokugo)
