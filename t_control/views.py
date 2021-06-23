from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import Tctrl
import json

# Create your views here.
def index(request):
	tctrl_list_json = json.dumps(list(Tctrl.objects.all().values()))
	context = {'tctrl_list_json' : tctrl_list_json}
	return HttpResponse(tctrl_list_json, content_type="application/json")

def detail(request, tctrl_id):
	tctrl_detail_json = get_object_or_404(Tctrl, pk=tctrl_id)
	context = { 'tctrl_detail_json' : tctrl_detail_json }
	return HttpResponse(tctrl_detail_json, content_type="application/json")
