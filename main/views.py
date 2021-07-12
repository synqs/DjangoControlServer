from django.shortcuts import render, redirect, get_object_or_404, get_list_or_404
from django.http import HttpResponse
from .models import PDmon, Tctrl
from django.core import serializers
import requests, json

# Create your views here.
def index(request):
	pdmons = get_list_or_404(PDmon)
	tctrls = Tctrl.objects.all()
	
	index = serializers.serialize('json', [*pdmons, *tctrls])
	context = { 'index' : index }
	return render(request, 'main/main_list.html', context)

def detail(request, device_type, device_name):
	#
	# post_dict = json.loads(request.body.decode('utf-8'))
	# device_type = post_dict['device_type']
	# device_name = post_dict['device_name']

	if device_type == 'main.pdmon': typ = PDmon
	else: typ = Tctrl
	device = get_list_or_404(typ, name=device_name)
	
	detail = serializers.serialize('json', device)
	context = { 'detail' : detail[1:-1], 'type' : type(device_type) }
	return render(request, 'main/main_detail.html', context)
        
def data(request):
	post_dict = json.loads(request.body.decode())
	print(request.method)
	print(request.POST)
	# device_ip = post_dict['fields']['ip'] # this would be a shortcut...
	
	device_type = post_dict['model']
	device_name = post_dict['fields']['name']
	if device_type == 'main.pdmon': typ = PDmon
	else: typ = Tctrl
	
	device = get_object_or_404(typ, name=device_name)
	
	url = "http://" + device.ip + "/data/get"
	r = requests.get(url)
	data_string = r.text + device.channel_string
	
	return HttpResponse(data_string)
    
def remove(request):
	post_dict = json.loads(request.body.decode())
	
	device_type = post_dict['model']
	device_name = post_dict['fields']['name']
	if device_type == 'main.pdmon': typ = PDmon
	else: typ = Tctrl
	
	device = get_object_or_404(typ, name=device_name)

	# so this view is working, but I commented out this out such that we can have a look at the axios requesting and stuff
	# device.delete()
	return HttpResponse('Device Deleted')
	
### PDMON related views ###

def pdmon(request, device_id):
	device = get_object_or_404(PDmon, id=device_id)
	
	if request.method == 'GET':
		url = "http://" + device.ip + "/data/get"
		r = requests.get(url)
		response = r.text + device.channel_string
		return HttpResponse(response)
		
	elif request.method == 'POST':
		r_dict = json.loads(request.body.decode())
		print(r_dict)
		print(r_dict['channels'])
		device.set_channels(r_dict['channels'])
		response = { 'message' : 'Set channels successfully.' }
		return HttpResponse(response)
		
	elif request.method == 'DELETE':
		# device.delete()
		response = { 'message' : 'Deleted successfully.' } 
		return HttpResponse(response)
	else:
		response = { 'message' : 'Invalid operation.' }
		return HttpResponse(response)
