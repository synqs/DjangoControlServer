from django.views.generic import ListView, DetailView, TemplateView, View
from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.http import HttpResponse
from .models import device
from django.core import serializers

from .models import device
import requests, json, os, platform, subprocess


### device index related view ###
class HomepageView(TemplateView):
	template_name = 'main/homepage.html'

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
			context.append(json.loads(serializers.serialize('json', [dev]))[0]['fields'])
		return context

class PingView(View):
	model = device

	def get(self, request, *args, **kwargs):
		Device = get_object_or_404(self.model, name=kwargs['device_name'])
		success = Device.ping()
		if success : return HttpResponse(json.dumps({ 'message' : 'Device ready.' }))
		else : return HttpResponse(json.dumps({ 'message' : 'Failed to connect.' }))
