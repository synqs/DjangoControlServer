from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.http import HttpResponse
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt

from .models import PDmon, Tctrl

import requests, json, os
import .mokugo

from requests.exceptions import HTTPError
from urllib.parse import parse_qs

### device index related view ###
def index(request):
	pdmons = get_list_or_404(PDmon)
	tctrls = get_list_or_404(Tctrl)
	
	device_list = serializers.serialize('json', [*pdmons, *tctrls])
	context = { 'device_list' : device_list }
	if device_list == "":
		context['message'] = 'No devices available!'
	return render(request, 'main/index.html', context) # keep it like this or use the render-context shortcut...?

### arduino detail related view ###
def arduino(request, device_typ, device_name):
	response = {}
	
	if device_typ == 'main.pdmon' : typ = PDmon
	else : typ = Tctrl
	
	# THIS IS FOR RENDERING THE HTML PAGE #
	if request.method == 'GET' :
		device = get_object_or_404(typ, name=device_name)
		detail = serializers.serialize('json', [device])
	
		response['device'] = json.loads(detail[1:-1])
		response['message'] = 'Device ready.'
		return render(request, 'main/arduino.html', response)
		
	# THIS IS FOR PROCESSING THE AXIOS REQUESTS #
	r_dict = json.loads(request.body.decode())
	print(r_dict)
	command = r_dict['command']
	
	if command == 'DELETE':
		get_object_or_404(typ, name=device_name).delete()
		response['message'] = 'Deleted successfully.'
	if command == 'ADD':
		r_dict['device'].pop('model')
		device = typ.objects.create(**r_dict['device'])
		device.save()
		response['message'] = 'New device added.'

	else: 
		try:
			device = get_object_or_404(typ, name=device_name) # also consider 'update_or_create()'
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
				response['keys'] = device.keys()
				response['message'] = 'Device ready.'

			elif command == 'DETAIL':
				detail = serializers.serialize('json', [device])
				response['device'] = json.loads(detail[1:-1])
				response['message'] = 'Device available.'

				return render(request, 'main/detail.html', response)
		
			elif command == 'EDIT':
				for p in r_dict['params']: device.set(p, r_dict['params'][p])
				device.save()
				response['message'] = 'Parameters updated successfully.'
			else:
				response['message'] = 'Invalid operation.'
	
	print(response)
	return HttpResponse(json.dumps(response))

### views related to the moku:go ###
def mokugo(request):
	response = {}
	r_dict = json.loads(request.body.decode())
	
	try:
		device = get_object_or_404(mokugo, name=device_name)
		print(device); print(type(device))
		mokugo_data(ip=device.ip())
	except Exception as err:
		response['message'] = str(err)
	else:
		response['messgae'] = 'Data available.'
		response['data'] = data
	finally:
		return HttpResponse(json.dumps(response))

### views to communitcate with slackbot ###
def slackbot(request):
	response = {}

	if request.method == 'GET':
		print(request)
		return render(request, 'main/slackbot.html')
		
	r_dict = json.loads(request.body.decode())
	print(r_dict)
	response = {}
	
	if r_dict['command'] == 'ALERT':
		redirect_url = "http://localhost:8000/" + r_dict['device_url']
		text = ":fire: ALERT!!! \n The laser is out of lock!"
	else:
		redirect_url = "https://mir-s3-cdn-cf.behance.net/project_modules/disp/8faa1a12225183.562654f31f78a.gif"
		text = "Greetings from the cyberspace! - " + r_dict['message']
	
	channel_id = "C02F1MWPLM7" # naka_laserlock channel
	url = "https://slack.com/api/chat.postMessage"
	payload = {
		"channel": "C02F1MWPLM7",
		#"text": "",
		"attachments": [{
            "text": text,
            "color": "#ad1721",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "Take me there!",
                    "text": "Take me there!",
                    "type": "button",
                    "style": "primary",
                    "url": redirect_url
                },
                {
                    "name": "I don't care.",
                    "text": "I don't care.",
                    "type": "button",
                    "style": "danger",
                    "url": "https://media.tenor.co/images/dd7ce8ef69ccfe64aa3ad4d173390c66/tenor.gif"
                }
            ]
        }]
	}
	headers = { 
		"Content-type" : "application/json",
		"Authorization" : "Bearer " + os.getenv("SLACKBOT_TOKEN"),
	}
	
	try:
		r = requests.post(url, json=payload, headers=headers)
		r.raise_for_status()
		print(r.text)
		#for ch in r.json()['channels']:
		#	print(ch['name'] + '---' + ch['id'])
	except HTTPError as http_err:
		response['message'] = str(http_err) 
	except Exception as err:
		response['message'] = str(err)
	else:
		response['message'] = 'Message send!'
			
	return HttpResponse(json.dumps(response))

@csrf_exempt
def commands(request):
	qstring = request.body.decode()
	print(json.dumps(parse_qs(qstring)))
	json_dict = dict(parse_qs(qstring))
	
	print(json_dict['command'][0])
	response = { "text" : "Command received!" }
	return HttpResponse(json.dumps(response),status=200)

@csrf_exempt	
def events(request):
	string = request.body.decode('utf-8')
	json_dict = {x.split('=')[0]:int(x.split('=')[1]) for x in string.split("&")}
	print(json_dict)
	
	if json_dict['token'] != os.getenv("VERIFICATION_TOKEN"):
		return HttpResponse(status=403)
		
	#return the challenge code here
	if 'type' in json_dict:
		if json_dict['type'] == 'url_verification':
			response_dict = {"challenge": json_dict['challenge']}
			return HttpResponse(json.dumps(response_dict), safe=False)
	
	if ('event' in json_dict):
		event_msg = json_dict['event']
		if 'bot_id' in event_msg:
			return HttpResponse(status=200)
	
	if event_msg['type'] == 'message':
		user = event_msg['user']
		channel = event_msg['channel']
		
		response_msg = ":wave:, Hello <@%s>" % user
		url = "https://slack.com/api/chat.postMessage"
		payload = {
			"channel": channel,
			"text": response_msg,
		}
		headers = { 
			"Content-type" : "application/json",
			"Authorization" : "Bearer " + os.getenv("SLACKBOT_TOKEN"),
		}
		
		r = requests.post(url, json=payload, headers=headers)
		return HttpResponse(status=200)
	
	return HttpResponse(status=200)