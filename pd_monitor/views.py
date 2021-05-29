from django.shortcuts import render, get_object_or_404
from .models import Device

# Create your views here.
def index(request):
	devices = Device.objects.all()
	context = {'devices' : devices}
	return render(request, 'pd_monitor/index.html', context)

def detail(request, device_id):
	device = get_object_or_404(Device, pk=device_id)
	context = {'device' : device}
	return render(request, 'pd_monitor/detail.html', context)
