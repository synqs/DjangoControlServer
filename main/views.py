from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import PDmon, Tctrl
from django.core import serializers
from itertools import chain

# Create your views here.
def index(request):
	return render(request, 'main/main_list.html')

# Create your views here.
def device_index(request):
	pdmons = PDmon.objects.all()
	tctrls = Tctrl.objects.all()
	res = serializers.serialize('json',list(chain(pdmons, tctrls)))
	
	return HttpResponse(res)

def device_detail(request, device_name):
	device_detail_json = get_object_or_404(PDmon, name=device_name)
	context = { 'device_detail_json' : device_detail_json }
	return HttpResponse(device_detail_json, content_type="application/json")
