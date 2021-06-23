from django.shortcuts import render
from django.http import HttpResponse
from .models import PDmon, Tctrl
import json

# Create your views here.
def index(request):
	return render(request, 'main/main_list.html')

# Create your views here.
def device_index(request):
	liste = list(PDmon.objects.all().values())
	liste.append(list(Tctrl.objects.all().values()))
	device_list_json = json.dumps(liste)
	context = {'device_list_json' : device_list_json}
	return HttpResponse(device_list_json, content_type="application/json")

def detail(request, pdmon_id):
	pdmon_detail_json = get_object_or_404(PDmon, pk=pdmon_id)
	context = { 'pdmon_detail_json' : pdmon_detail_json }
	return HttpResponse(pdmon_detail_json, content_type="application/json")
