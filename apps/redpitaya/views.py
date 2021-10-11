from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.http import HttpResponse
from django.core import serializers

#from apps import arduino, mokugo
import requests, json, os

# Create your views here.
def redpitaya(request, redpitaya_name):
	response = {}
	
	# THIS IS FOR RENDERING THE HTML PAGE #
	if request.method == 'GET' :
		redpitaya = get_object_or_404(redpitaya, name=redpitaya_name)
		detail = serializers.serialize('json', [redpitaya])
	
		response['redpit'] = json.loads(detail[1:-1])
		response['message'] = 'Device ready.'
		return render(request, 'redpitaya/redpitaya.html', response)