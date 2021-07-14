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

def devices(request):
	pdmons = get_list_or_404(PDmon)
	tctrls = get_list_or_404(Tctrl)
	
	device_list = serializers.serialize('json', [*pdmons, *tctrls])
	response = { 'device_list' : device_list }
	return HTTPResponse(response)
	
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
        
def detail_direct(request):
	post_dict = json.loads(request.body.decode('utf-8'))
	
	device_type = post_dict['device_type']
	device_name = post_dict['device_name']
	
	device = get_list_or_404(typ, name=device_name)
	
	detail = serializers.serialize('json', device)
	context = { 'detail' : detail[1:-1], 'type' : type(device_type) }
	return render(request, 'main/main_detail.html', post_dict)
	
### PDMON related views ###

def pdmon(request, device_id):
	device = get_object_or_404(PDmon, id=device_id)
	
	if request.method == 'GET':
		url = "http://" + device.ip + "/data/get"
		r = requests.get(url)
		channels = channel_buffer(device.channel_string)
		response = r.text[:-1] + ",\"channels\":" + channels + "}" 
		print(response)
		return HttpResponse(response)
		
	elif request.method == 'POST':
		r_dict = json.loads(request.body.decode())
		print(device.channel_string)
		print(r_dict['fields']['channel_string'])
		device.set_channels(r_dict['fields']['channel_string'])
		response = { 'message' : 'Set channels successfully.' }
		return HttpResponse(response)
		
	elif request.method == 'DELETE':
		# device.delete()
		response = { 'message' : 'Deleted successfully.' } 
		return HttpResponse(response)
	else:
		context = { 'message' : 'Invalid operation.' }
		return render(request, 'main/main_detail.html', context)
		
def channel_buffer(arr):
	buff = arr.split(',')
	channels = "["; i = 0;
	for ch in buff:
		channels += "\"CH" + buff[i].zfill(2) + "\","
		i += 1
	return channels[:-1] + "]"
