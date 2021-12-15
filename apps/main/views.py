from django.views.generic import ListView, DetailView, TemplateView, View, DeleteView, RedirectView
from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.http import HttpResponse
from .models import device
from django.core import serializers

from .models import device
import requests, json, os, platform, subprocess


### device index related view ###
class HomepageView(RedirectView):
	url = '/index/'

class IndexView(ListView):
	model = device
	template_name = 'main/index.html'
	context_object_name = 'device_list'

	allow_empty = True

	def get_queryset(self):
		context = []
		devices = device.objects.all()
		# devices = serializers.serialize('json', [*device.objects.all(),])

		for dev in devices:
			dict = json.loads(serializers.serialize('json', [dev]))[0]['fields']
			dict['pk'] = dev.pk
			context.append(dict)
		return context

class PingView(DetailView):
	model = device
	slug_url_kwarg = 'device_name'
	slug_field = 'name'

	def get(self, request, *args, **kwargs):
		Device = super().get_object() #get_object_or_404(self.model, name=kwargs['device_name'])
		success = Device.ping()
		if success : return HttpResponse(json.dumps({ 'message' : 'Device ready.' }))
		else : return HttpResponse(json.dumps({ 'message' : 'Failed to connect.' }))
        
class DeleteDevice(DeleteView):
	model = device
	#queryset = device.objects.all()
	succes_url = '/index'
