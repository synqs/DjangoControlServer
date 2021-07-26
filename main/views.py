from django.shortcuts import render, redirect, get_object_or_404, get_list_or_404
from django.http import HttpResponse
from .models import PDmon, Tctrl
from django.core import serializers
import requests, json
from requests.exceptions import HTTPError

# Create your views here.
def index(request):
	pdmons = get_list_or_404(PDmon)
	tctrls = get_list_or_404(Tctrl)
	
	device_list = serializers.serialize('json', [*pdmons, *tctrls])
	context = { 'device_list' : device_list }
	if device_list == "":
		context['message'] = 'No devices available!'
	else: 
		context['message'] = 'Device Index'
	return render(request, 'main/index.html', context) # keep it like this or use the render-context shortcut...?
'''
def devices(request):
	pdmons = get_list_or_404(PDmon)
	tctrls = get_list_or_404(Tctrl)
	
	device_list = serializers.serialize('json', [*pdmons, *tctrls])
	
	return HttpResponse(device_list) # is this clean or corrupted?
'''
def detail(request, device_typ, device_id):
	if device_typ == 'main.pdmon' : typ = PDmon
	else : typ = Tctrl
	device = get_object_or_404(typ, id=device_id)
	detail = serializers.serialize('json', [device])
	
	response = {}
	response['device'] = json.loads(detail[1:-1])
	response['message'] = 'Device ready.'
	
	return render(request, 'main/detail.html', response)
	
### PDMON related views ###

def pdmon(request):
	r_dict = json.loads(request.body.decode())
	device = get_object_or_404(PDmon, id=r_dict[0])
	command = r_dict[1]
	response = {}
	url = "http://" + device.ip + "/data/get"

	try:
		r = requests.get(url)
		r.raise_for_status()
	except HTTPError as http_err:
		response['message'] = http_err 
	except Exception as err:
		response['message'] = err 

	else:
		if command == 'STATUS':
			response['message'] = 'Device ready.'

		elif command == 'DETAIL':
			detail = serializers.serialize('json', [device])
		
			response['device'] = json.loads(detail[1:-1])
			response['message'] = 'Device available.'
			#return render(request, 'main/detail.html', response)
		
		elif command == 'DATA':
			response = r.json()

			response['channels'] = device.channels()
			response['message'] = 'Data available!'
		
		elif command == 'EDIT':
			r_dict = json.loads(request.body.decode())
			print(device.channel_string)
			print(r_dict['fields']['channel_string'])
			device.set_channels(r_dict['fields']['channel_string'])
			response['message'] = 'Set parameters successfully.'
		
		elif command == 'DELETE':
			# device.delete()
			response['message'] = 'Deleted successfully.'
		else:
			response['message'] = 'Invalid operation.'
	
	return HttpResponse(json.dumps(response))

### TCTRL related views ###

def tctrl(request):
	r_dict = json.loads(request.body.decode())
	device = get_object_or_404(Tctrl, pk=r_dict[0])
	command = r_dict[1]
	response = {}
	url = "http://" + device.ip + "/data/get"
	
	try:
		r = requests.get(url, timeout = 10)
		r.raise_for_status()
	except HTTPError as http_err:
		print(http_error)
		response['message'] = str(http_err)
	except Exception as err:
		print(err)
		response['message'] = f'HTTP error occurred: {err}'

	else:
		if command == 'STATUS':
			response['message'] = 'Device ready.'

		elif command == 'DETAIL':
			detail = serializers.serialize('json', [device])
		
			response['device'] = json.loads(detail[1:-1])
			response['message'] = 'Device available.'
			#return render(request, 'main/detail.html', response)
		
		elif command == 'DATA':
			response = r.json()
			response['message'] = 'Data available!'
		
		elif command == 'EDIT':
			r_dict = json.loads(request.body.decode())
		
			response['message'] = 'Set parameters successfully.'
		
		elif command == 'DELETE':
			# device.delete()
			response['message'] = 'Deleted successfully.'
		else:
			response['message'] = 'Invalid operation.'
	
	return HttpResponse(json.dumps(response))

