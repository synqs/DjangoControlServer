from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import Device
import json

# Create your views here.
def index(request):
	device_list_json = json.dumps(list(Device.objects.all().values()))
	context = {'device_list_json' : device_list_json}
	return render(request, 'pd_monitor/device_list.html', context)

def detail(request, question_id):
	device = get_object_or_404(Device, pk=question_id)
	context = { 'device' : device }
	return render(request, 'pd_monitor/device_detail.html', context)

def json_data(request):
	device_list_json = json.dumps(list(Device.objects.all().values()))
	context = {'device_list_json' : device_list_json}
	return HttpResponse(device_list_json, content_type="application/json")
