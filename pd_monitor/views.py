from django.shortcuts import render, get_object_or_404
from django.views import generic
from django.core.serializers import json
from .models import Device

# Create your views here.
#class IndexView(generic.ListView):
#	model = Device

class DetailView(generic.DetailView):
	model = Device

def refresh(request):
	device_list = Device.objects.all()
	context = {'device_list' : device_list}
	return render(request, 'pd_monitor/device_list.html', context)

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
