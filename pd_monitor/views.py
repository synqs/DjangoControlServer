from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import PDmon
import json

# Create your views here.
def index(request):
	pdmon_list_json = json.dumps(list(PDmon.objects.all().values()))
	context = {'pdmon_list_json' : pdmon_list_json}
	return render(request, 'pd_monitor/pdmon_list.html', context)

def detail(request, pdmon_id):
	pdmon = get_object_or_404(PDmon, pk=pdmon_id)
	context = { 'pdmon' : pdmon }
	return render(request, 'pd_monitor/pdmon_detail.html', context)

"""
def json_data(request):
	pdmon_list_json = json.dumps(list(PDmon.objects.all().values()))
	context = {'pdmon_list_json' : pdmon_list_json}
	return HttpResponse(pdmon_list_json, content_type="application/json") """
	
