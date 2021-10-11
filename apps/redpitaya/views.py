from django.views.generic import ListView, DetailView, TemplateView
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404
from django.core import serializers

from .models import redpitaya

import requests, json
from requests.exceptions import HTTPError

# Create your views here.
class RedPitayaDetailView(DetailView):
    model = redpitaya
    slug_url_kwarg = 'redpitaya_name'
    slug_field = 'name'
    template_name = 'redpitaya/redpitaya.html'
    
    def get_context_data(self, **kwargs):
        Redpitaya = super().get_object()
        context = {}
        context['redpitaya'] = json.loads(serializers.serialize('json', [Redpitaya]))[0]['fields']
        context['redpitaya']['model'] = 'redpitaya'
        return context
        
def redpitaya(request, redpitaya_name):
	response = {}
	
	# THIS IS FOR RENDERING THE HTML PAGE #
	if request.method == 'GET' :
		redpitaya = get_object_or_404(redpitaya, name=redpitaya_name)
		detail = serializers.serialize('json', [redpitaya])
	
		response['redpit'] = json.loads(detail[1:-1])
		response['message'] = 'Device ready.'
		return render(request, 'redpitaya/redpitaya.html', response)