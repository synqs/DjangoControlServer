from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from .models import pdmon, tctrl

import json

# Create your views here.
def arduino(request, arduino_typ, arduino_name):
	response = {}
	
	if arduino_typ == 'arduino.pdmon' : typ = pdmon
	else : typ = tctrl
	
	# THIS IS FOR RENDERING THE HTML PAGE #
	if request.method == 'GET' :
		device = get_object_or_404(typ, name=device_name)
		detail = serializers.serialize('json', [device])
	
		response['device'] = json.loads(detail[1:-1])
		response['message'] = 'Device ready.'
		return render(request, 'arduino/arduino.html', response)
		
	# THIS IS FOR PROCESSING THE AXIOS REQUESTS #
	r_dict = json.loads(request.body.decode())
	print(r_dict)
	command = r_dict['command']
	
	if command == 'DELETE':
		get_object_or_404(typ, name=device_name).delete()
		response['message'] = 'Deleted successfully.'
	if command == 'ADD':
		r_dict['device'].pop('model')
		device = typ.objects.create(**r_dict['device'])
		device.save()
		response['message'] = 'New device added.'

	else: 
		try:
			device = get_object_or_404(typ, name=device_name) # also consider 'update_or_create()'
			url = device.http_str() + 'data/get'
			r = requests.get(url)
			r.raise_for_status()
		except HTTPError as http_err:
			response['message'] = str(http_err) 
		except Exception as err:
			response['message'] = str(err) 

		else:
			if command == 'STATUS':
				response = r.json()
				response['keys'] = device.keys()
				response['message'] = 'Device ready.'

			elif command == 'DETAIL':
				detail = serializers.serialize('json', [device])
				response['device'] = json.loads(detail[1:-1])
				response['message'] = 'Device available.'

				return render(request, 'main/detail.html', response)
		
			elif command == 'EDIT':
				for p in r_dict['params']: device.set(p, r_dict['params'][p])
				device.save()
				response['message'] = 'Parameters updated successfully.'
			else:
				response['message'] = 'Invalid operation.'
	
	print(response)
	return HttpResponse(json.dumps(response))
