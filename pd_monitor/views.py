from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from .models import PDmon
import json

# Create your views here.
def index(request):
	pdmon_list_json = json.dumps(list(PDmon.objects.all().values()))
	context = {'pdmon_list_json' : pdmon_list_json}
	return HttpResponse(pdmon_list_json, content_type="application/json")

def detail(request, pdmon_id):
	pdmon_detail_json = get_object_or_404(PDmon, pk=pdmon_id)
	context = { 'pdmon_detail_json' : pdmon_detail_json }
	return HttpResponse(pdmon_detail_json, content_type="application/json")
