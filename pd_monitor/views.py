from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.core import serializers
from .models import Device, JSONSerializer
import json

# Create your views here.
def index(request):
	device_list = Device.objects.all()
	context = {'device_list' : device_list}
	return render(request, 'pd_monitor/device_list.html', context)

def detail(request, question_id):
	device = get_object_or_404(Device, pk=question_id)
	context = { 'device' : device }
	return render(request, 'pd_monitor/device_detail.html', context)

def jstest(request):
	# device_list_json = [i.get_json() for i in Device.objects.all()]
	fields = ('pk', 'name', 'description', 'ip')
	# device_list_json = serializers.serialize('json',Device.objects.all(),fields)
	device_list_json = json.dumps(list(Device.objects.all().values('pk', 'name', 'description', 'ip')))
	context = {'device_list_json' : device_list_json}
	return render(request, 'pd_monitor/jstest.html', context)

def json_data(request):
	# device_list_json = [i.get_json() for i in Device.objects.all()]
	fields = ['pk', 'name', 'description', 'ip']
	device_list_json = serializers.serialize('json',Device.objects.all(),fields)
	# device_list_json = json.dumps(list(Device.objects.all().values('pk', 'name', 'description', 'ip')))
	context = {'device_list_json' : device_list_json}
	return render(request, 'pd_monitor/json.html', context)

def add_device(request, device_name):
	device = Device.objects.create(name=device_name)
	new_device_list = Device.objects.all()
	context = {'device_list' : new_device_list}
	return render(request, 'pd_monitor/device_list.html', context)

def remove_device(request, device_id):
	device = get_object_or_404(Device, pk=device_id)
	device.delete()
	new_device_list = Device.objects.all()
	context = {'device_list' : new_device_list}
	return render(request, 'pd_monitor/device_list.html', context)
	
def refresh(request, html_id):
	return render(request, 'pd_monitor/'+html_id)
