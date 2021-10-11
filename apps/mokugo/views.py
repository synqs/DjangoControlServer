from django.views.generic import ListView, DetailView, TemplateView
from django.shortcuts import render, get_object_or_404
from django.core import serializers

from .models import mokugo

import requests, json

# Create your views here.
class MokugoDetailView(DetailView):
	model = mokugo
	slug_field_name = 'mokugo_name'
	slug_field = 'name'
	template_name = 'mokugo/mokugo.html'
	
	def get_context_data(self, **kwargs):
		Mokugo = super().get_object()
		context = super().get_context_data()
		context['mokugo'] = json.loads(serializers.serialize('json', [Mokugo]))[0]['fields']
		context['model'] = 'mokugo'
		return context
	
def mokugo(request):
	moku = get_object_or_404(mokugo, name=slug)
	
	if request.method == 'DELETE':
		moku.delete()
		render(request, 'main/index.html')
	if request.method == 'GET':
		render(request, 'mokugo/mokugo.html', { 'moku' : moku })
	#if request.method == 'POST':
	
def mokugo_ping(request):
	moku = get_object_or_404(mokugo, name=slug)
	success = moku.ping()
	if success: return ok
	else: return fail
