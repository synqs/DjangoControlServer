from django.views.generic import ListView, DetailView, TemplateView
from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.http import HttpResponse
from .models import device
from django.core import serializers

from .models import device
import requests, json, os


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

class ping_device(DetailView):
	model = device
	slug_field = 'name'
	template_name = 'ping.html'

	def get_context_data(self):
		Device = super().get_object()
		success = dev.ping()
		return success

def ping(request):
	r_dict = json.loads(request.body.decode())
	ip = r_dict['ip']
	
	success = os.system("apps\main\static\main\ping.cmd " + ip)
	print('success = ' + ip + ' --- ', success)
	if success == 0 : return HttpResponse({ 'Device ready.' })
	else : return HttpResponse({ 'Failed to conect.' })
