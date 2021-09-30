from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.core import serializers

from arduino.models import pdmon, tctrl
from mokugo.models import mokugo


### device index related view ###
def index(request):
	pdmons = get_list_or_404(pdmon)
	tctrls = get_list_or_404(tctrl)
	mokugos = get_list_or_404(mokugo)
	
	device_list = serializers.serialize('json', [*pdmons, *tctrls, *mokugos,])
	context = { 'device_list' : device_list }
	if device_list == "":
		context['message'] = 'No devices available!'
	return render(request, 'main/index.html', context) # keep it like this or use the render-context shortcut...?
