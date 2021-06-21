from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import Tcrtl
import json

# Create your views here.
def index(request):
	tcrtl_list_json = json.dumps(list(Tcrtl.objects.all().values()))
	context = {'tcrtl_list_json' : tcrtl_list_json}
	return render(request, 'pd_monitor/tcrtl_list.html', context)

def detail(request, tcrtl_id):
	tcrtl = get_object_or_404(Tcrtl, pk=tcrtl_id)
	context = { 'tcrtl' : tcrtl }
	return render(request, 'pd_monitor/tcrtl_detail.html', context)

def json_data(request):
	tcrtl_list_json = json.dumps(list(Tcrtl.objects.all().values()))
	context = {'tcrtl_list_json' : tcrtl_list_json}
	return HttpResponse(tcrtl_list_json, content_type="application/json")
