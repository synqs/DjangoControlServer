from django.views.generic import ListView, DetailView, TemplateView
from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.core import serializers

from arduino.models import pdmon, tctrl
from mokugo.models import mokugo
from redpitaya.models import redpitaya


### device index related view ###
class IndexView(ListView):
	template_name = 'main/index.html'
	context_object_name = 'device_list'
	
	def get_queryset(self):
		pdmons = get_list_or_404(pdmon)
		tctrls = get_list_or_404(tctrl)
		mokugos = get_list_or_404(mokugo)
		redpitayas = get_list_or_404(redpitaya)
	
		return serializers.serialize('json', [*pdmons, *tctrls, *mokugos, *redpitayas])

class HomepageView(TemplateView):
	template_name = 'main/homepage.html'