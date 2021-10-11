from django.views.generic import ListView, DetailView, TemplateView
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.core import serializers

from .models import laser
import requests, json, os

# Create your views here.
class LaserDetailView(DetailView):
    model = laser
    slug_url_kwarg = 'laser_name'
    slug_field = 'name'
    template_name = 'laser/laser.html'
    
    def get_context_data(self, **kwargs):
        Laser = super().get_object()
        return { 'laser' : json.loads(serializers.serialize('json', [Laser]))[0]['fields'] }
	
def laser(request, slug):
	response = {}
	r_dict = json.loads( request.body.decode())
	print(r_dict)
	command = r_dict['command']

	if command == 'PING':
		ip = r_dict['payload']
		success = os.system("apps\main\static\main\ping.cmd " + ip)
		print('success = ' + ip + ' --- ', success)
	
		if success == 0 : response['message'] =  'Device ready.'
		else : response['message'] = 'Failed to connect.'

	if command == 'TOGGLE':
		toggle = r_dict['payload']
		print('toggle : ', toggle)
		os.system("apps\laser\static\laser\toggle_laser_diode.bat " + toggle)
		response['message'] = "Laser Diode " + toggle + "."
        
	if command == 'TOGGLE_EDFA':
		toggle = r_dict['payload']
		print('toggle_edfa')
		# os.system("apps\laser\static\laser\toggle_edfa.bat " + toggle)
		response['message'] = "EDFAs " + toggle + "."

	if command == 'UPDATE_EDFA':
		voltage = r_dict['payload'] * 0.01
		print(voltage)
		# os.system("apps\laser\static\laser\toggle_laser_diode.bat " + voltage)
		response['message'] = "Power parameter updated."

	return HttpResponse(json.dumps(response))