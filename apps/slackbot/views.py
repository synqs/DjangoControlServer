from django.views.generic import ListView, DetailView, View
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import slackbot

import requests, json
from requests.exceptions import HTTPError
from urllib.parse import parse_qs

# Create your views here.
class SlackbotDetailView(DetailView):
    model = slackbot
    slug_url_kwarg = 'slackbot_name'
    slug_field = 'name'
    template_name = 'slackbot/slackbot.html'
    
    def get_context_data(self, **kwargs):
        Slackbot = super().get_object()
        return { 'slackbot' : json.loads(serializers.serialize('json', [Slackbot]))[0]['fields'] }
    
class SlackbotSendView(View):
    model = slackbot
    
    def post(self, request, *args, **kwargs):
        Slackbot = get_object_or_404(slackbot, name=kwargs['slackbot_name'])
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
            "Authorization" : "Bearer " + Slackbot.bot_token,
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

class SlackbotCommandsView(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(SlackbotCommandsView, self).dispatch(request, *args, **kwargs)
        
    def post(self, request, *args, **kwargs):
        Slackbot = get_object_or_404(slackbot, name=kwargs['slackbot_name'])
        string = request.body.decode()
        json_dict = {x.split('=')[0]:x.replace("%2F", "/").split('=')[1] for x in string.split("&")}
        print(json_dict)
        """qstring = request.body.decode() # in case we want to return to this method...
        print(json.dumps(parse_qs(qstring)))
        json_dict = dict(parse_qs(qstring)) """
	
        print(json_dict['command'])
        response = { 
            "response_type" : "in_channel",
            "text" : "Command received!",
        }
        channel = json_dict['channel_id']
        msg = "Command received!"
        Slackbot.simple_message(channel, msg)
        # return HttpResponse()
	

class SlackbotEventsView(View): 
	
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(SlackbotEventsView, self).dispatch(request, *args, **kwargs)
        
    def post(self, request, *args, **kwargs):
        Slackbot = get_object_or_404(slackbot, name=kwargs['slackbot_name'])
        json_dict = json.loads(request.body.decode('utf-8'))
        print(json_dict)
	
        if json_dict['token'] != Slackbot.verification_token:
            return HttpResponse(status=403)
		
        #return the challenge code here
        if 'type' in json_dict:
            if json_dict['type'] == 'url_verification':
                response_dict = {"challenge": json_dict['challenge']}
                return HttpResponse(json.dumps(response_dict))
	
            if ('event' in json_dict):
                event_msg = json_dict['event']
                if 'bot_id' in event_msg:
                    return HttpResponse(status=200)
	
            if event_msg['type'] == 'message':
                user = event_msg['user']
                channel = event_msg['channel']
                msg = ":wave:, Hello <@%s>" % user
                Slackbot.simple_message(channel, msg)
                
            return HttpResponse(status=200)
            
        return HttpResponse(status=200)