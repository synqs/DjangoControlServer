from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import Tctrl
import json

# Create your views here.
def index(request):
	tctrl_list_json = json.dumps(list(tctrl.objects.all().values()))
	context = {'tctrl_list_json' : tctrl_list_json}
	return render(request, 'pd_monitor/tctrl_list.html', context)

def detail(request, tctrl_id):
	tctrl = get_object_or_404(Tctrl, pk=tctrl_id)
	context = { 'tctrl' : tctrl }
	return render(request, 'pd_monitor/tctrl_detail.html', context)
