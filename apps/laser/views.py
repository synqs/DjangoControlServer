from django.views.generic import ListView, DetailView, TemplateView
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.core import serializers

from .models import laser
import requests, json, os

# Create your views here.
class LaserDetailView(DetailView):
	model = laser
	slug_field = 'name'
	template_name = 'laser/laser.html'
	
	def get_context_data(self, **kwargs):
		Laser = super().get_object()
		print(json.loads(serializers.serialize('json', [Laser]))[0])
		return { 'laser' : json.loads(serializers.serialize('json', [Laser]))[0]['fields'] }
	
def laser(request):
	return HttpResponse('ok')