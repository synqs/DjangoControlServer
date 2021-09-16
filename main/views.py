from django.shortcuts import render, redirect, get_object_or_404, get_list_or_404
from django.http import HttpResponse, Http404, HttpResponseRedirect
from .models import PDmon, Tctrl
from .forms import UpdateSetpointForm
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
	
### device related views ###

def device(request):
	r_dict = json.loads(request.body.decode())
	command = r_dict[0]
	response = {}

	if r_dict[1]['model'] == 'main.pdmon' : typ = PDmon
	else : typ = Tctrl
	
	if command == 'DELETE':
		get_object_or_404(typ, pk=r_dict[1]['pk']).delete()
		response['message'] = 'Deleted successfully.'
	if command == 'ADD':
		r_dict[1].pop('model')
		print(r_dict[1])
		device = typ.objects.create(**r_dict[1])
		device.save()
		response['message'] = 'New device added.'

	else: 
		try:
			device = get_object_or_404(typ, pk=r_dict[1]['pk']) # also consider 'update_or_create()'
			url = device.http_str() + 'data/get'
			r = requests.get(url)
			r.raise_for_status()
		except HTTPError as http_err:
			response['message'] = str(http_err) 
		except Exception as err:
			response['message'] = str(err) 

		else:
			if command == 'STATUS':
				response = r.json()
				
				#response['keys'] = list(response['value'].keys())
				response['keys'] = device.keys()
				response['message'] = 'Device ready.'

			elif command == 'DETAIL':
				detail = serializers.serialize('json', [device])
		
				response['device'] = json.loads(detail[1:-1])
				response['message'] = 'Device available.'
				#return HttpResponseRedirect('main/detail.html')
				return render(request, 'main/detail.html', response)
		
			elif command == 'DATA':
				response = r.json()

				response['message'] = 'Data available!'
		
			elif command == 'EDIT':
				params = r_dict[1]['params'];
				print(params)
				for p in params:
					device.set(p, params[p])
	    				
				device.save()
				response['message'] = 'Parameters updated successfully.'
			else:
				response['message'] = 'Invalid operation.'
	
	# print(response)
	return HttpResponse(json.dumps(response))

def setSetpoint(request):
	print('blub')
	form = UpdateSetpoint(request.POST)
	return HttpResponse({'form' : form })
	
def alert(request):
	url = "https://hooks.slack.com/services/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"
	channel_id = "C02F1MWPLM7"
	url = "https://slack.com/api/chat.postMessage"
	payload = {
		"channel": "C01R96KM70X",
		"text": "Alert!",
		"attachments": [{
            "text": ":fire: ALERT!!! \n I now know how to use the slack-bot!",
            "color": "#ad1721",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "Like it!",
                    "text": "Like it!",
                    "type": "button",
                    "style": "primary",
                    "url": "https://4.bp.blogspot.com/-0ltHlOy1tuI/T5zG0uwaQFI/AAAAAAAAAfg/3NDn8PibYOs/s1600/thank+you+a5.gif"
                },
                {
                    "name": "Nah.",
                    "text": "Nah.",
                    "type": "button",
                    "style": "danger",
                    "url": "https://c.tenor.com/DA-FFdw3pKUAAAAC/tvd-the-vampire-diaries.gif"
                }
            ]
        }]
	}
	headers = { 
		"Content-type" : "application/json",
		"Authorization" : "Bearer xoxb-151435687653-2406815256001-UqYnJ2LX3tg0aiNlWAtfifE7",
	}
	response = {}
	
	try:
		r = requests.post(url, json=payload, headers=headers)
		r.raise_for_status()
		print(r.text)
	except HTTPError as http_err:
		response['message'] = str(http_err) 
	except Exception as err:
		response['message'] = str(err)
	else:
		#for ch in r.json()['channels']:
		#	print(ch['name'] + '---' + ch['id'])
		response['message'] = 'Alert send!'
			
	return HttpResponse(json.dumps(response))
