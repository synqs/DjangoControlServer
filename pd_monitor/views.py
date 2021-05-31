from django.shortcuts import render, get_object_or_404
from .models import Device

# Create your views here.
def index(request):
	device_list = Device.objects.all()
	context = {'device_list' : device_list}
	return render(request, 'pd_monitor/index.html', context)

def detail(request, device_id):
	device = get_object_or_404(Device, pk=device_id)
	context = {'device' : device}
	return render(request, 'pd_monitor/detail.html', context)

def remove_device(request, device_id):
	device = get_object_or_404(Device, pk=device_id)
	# impletement closing connection to device
	device.delete()
	# return HttpResponseRedirect(reverse('pd_monitor:index')
	new_device_list = Device.objects.all()
	context = {'device_list' : new_device_list}
	return render(request, 'pd_monitor/index.html', context)
