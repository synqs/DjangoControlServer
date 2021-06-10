from django.shortcuts import render, get_object_or_404
from django.views import generic
from django.core import serializers
from .models import Device

# Create your views here.
class IndexView(generic.ListView):
	model = Device

class DetailView(generic.DetailView):
	model = Device

def jstest(request):
	return render(request, 'pd_monitor/jstest.html', {'device_list_json' : serializers.serialize('json', Device.objects.all())})

def json(request):
	device_list_json = serializers.serialize('json', Device.objects.all(),fields=('name','description','ip','value'))
	return render(request, 'pd_monitor/json.html', {'device_list_json' : device_list_json})

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
