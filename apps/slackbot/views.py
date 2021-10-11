from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.http import HttpResponse
from django.core import serializers

import requests, json, os

from requests.exceptions import HTTPError
from urllib.parse import parse_qs

# Create your views here.
def slackbot(request):
	response = {}

	if request.method == 'GET':
		print(request)
		return render(request, 'slackbot/slackbot.html')
		
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

def commands(request):
	qstring = request.body.decode()
	print(json.dumps(parse_qs(qstring)))
	json_dict = dict(parse_qs(qstring))
	
	print(json_dict['command'][0])
	response = { "text" : "Command received!" }
	return HttpResponse(json.dumps(response),status=200)
	
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
