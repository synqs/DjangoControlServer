from django.db import models

import requests, json, os
from requests.exceptions import HTTPError

# Create your models here.
class slackbot(models.Model):
	id = models.BigAutoField(primary_key=True)
	name = models.CharField(max_length=20, unique=True)			# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	
	class Meta:
		verbose_name = "Slackbot"
		
	def __str__(self):
		return self.name
		
	def get_absolut_url(self):
		return "slackbot/%n/" % self.name
        
	def simple_message(self, channel, text):
        	url = "https://slack.com/api/chat.postMessage"
        	payload = {
            		"channel": channel,
            		"text": text,
        	}
        	headers = { 
            		"Content-type" : "application/json",
            		"Authorization" : "Bearer " + os.getenv("SLACKBOT_TOKEN"),
        	}
		
        	try : 
            		r = requests.post(url, json=payload, headers=headers)
            		r.raise_for_status()
        	except HTTPError as err : return False
        	else : return True