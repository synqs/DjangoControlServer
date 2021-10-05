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
	
def laser(request):
	return HttpResponse('ok')