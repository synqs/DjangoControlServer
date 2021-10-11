from django.views.generic import ListView, DetailView, TemplateView
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404
from django.core import serializers

from .models import mokugo

import requests, json
from requests.exceptions import HTTPError

# Create your views here.
class MokugoDetailView(DetailView):
    model = mokugo
    slug_url_kwarg = 'mokugo_name'
    slug_field = 'name'
    template_name = 'mokugo/mokugo.html'

    def get_context_data(self, **kwargs):
        Mokugo = super().get_object()
        context = {}
        context['mokugo'] = json.loads(serializers.serialize('json', [Mokugo]))[0]['fields']
        context['mokugo']['model'] = 'mokugo'
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
