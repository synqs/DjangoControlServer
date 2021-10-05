from django.views.generic import ListView, DetailView, TemplateView
from django.shortcuts import render, get_object_or_404, get_list_or_404
from .models import device

from django.core import serializers
from arduino.models import pdmon, tctrl
from mokugo.models import mokugo
from redpitaya.models import redpitaya


### device index related view ###
class HomepageView(TemplateView):
	template_name = 'main/homepage.html'

class IndexView(ListView):
	model = device
	template_name = 'main/index.html'
	context_object_name = 'device_list'
	
	allow_empty = True
	
	def get_queryset(self):
		devices = device.objects.all()
		return serializers.serialize('json', [*devices, ])