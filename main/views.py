from django.shortcuts import render, redirect, get_object_or_404, get_list_or_404
from django.http import HttpResponse
from .models import PDmon, Tctrl
from django.core import serializers
import requests, json

# Create your views here.
def index(request):
	pdmons = get_list_or_404(PDmon)
	tctrls = get_list_or_404(Tctrl)
	
	device_list = serializers.serialize('json', [*pdmons, *tctrls])
	context = { 'device_list' : device_list }
	
	return render(request, 'main/index.html') # keep it like this or use the render-context shortcut...?


def devices(request):
	pdmons = get_list_or_404(PDmon)
	tctrls = get_list_or_404(Tctrl)
	
	device_list = serializers.serialize('json', [*pdmons, *tctrls])
	
	return HttpResponse(device_list) # is this clean or corrupted?
	
def detail(request, device_type, device_id):
	if device_type == 'main.pdmon': typ = PDmon
	else: typ = Tctrl
	device = get_list_or_404(typ, id=device_id)
	
	detail = serializers.serialize('json', device)
	context = { 'detail' : detail[1:-1] }
	
	return render(request, 'main/detail.html', context)
	
### PDMON related views ###

def pdmon(request, device_name):
	#r_dict = json.loads(request.body.decode())
	device = get_object_or_404(PDmon, name=device_name)
	
	if request.method == 'GET':
		url = "http://" + device.ip + "/data/get"
		r = requests.get(url)
		channels = channel_buffer(device.channel_string)
		response = r.text[:-1] + ",\"channels\":" + channels + "}" 
		return HttpResponse(response)
		
	if request.method == 'HEAD':
		response = serializers.serialize('json', device)
		context = { 'detail' : response }
		return HttpResponse(context)
		
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
