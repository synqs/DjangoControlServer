from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import PDmon, Tctrl
from django.core import serializers
from itertools import chain
import json

# Create your views here.
def index(request):
	pdmons = PDmon.objects.all()
	tctrls = Tctrl.objects.all()
	
	index = serializers.serialize('json', [*pdmons, *tctrls])
	context = { 'index' : index }
	return render(request, 'main/main_list.html', context)

def detail(request, device_type, device_name):
	if device_type == 'main.pdmon': typ = PDmon
	else: typ = Tctrl
	device = typ.objects.filter(name=device_name)
	
	detail = serializers.serialize('json', device)
	context = { 'detail' : detail[1:-1] }
	return render(request, 'main/main_detail.html', context)

"""
def device_index(request):
	pdmons = PDmon.objects.all()
	tctrls = Tctrl.objects.all()
	index = serializers.serialize('json', [*pdmons, *tctrls])
	
	return HttpResponse(index)

def device_detail(request, device_type, device_name):
	typ = device_type[5:]
	device = typ.objects.filter(name=device_name)
	data = serializers.serialize('json', device)
	device_detail = json.loads(data[1:-1])
	
	return render(request, 'main/main_detail.html', device_detail)
"""