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
	template_name = 'main/index.html'
	context_object_name = 'device_list'
	model = device
	
	allow_empty = True
	
	def get_queryset(self):
		devices = device.objects.all()
		return serializers.serialize('json', [*devices, ])
	
	'''
		pdmons = get_list_or_404(pdmon)
		tctrls = get_list_or_404(tctrl)
		mokugos = get_list_or_404(mokugo)
		redpitayas = get_list_or_404(redpitaya)
	
		return serializers.serialize('json', [*pdmons, *tctrls, *mokugos, *redpitayas])
	'''
