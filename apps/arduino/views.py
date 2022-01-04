from django.views.generic import ListView, DetailView, View
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404
from django.core import serializers

from .models import pdmon, tctrl, thsen

import requests, json, csv, os
from pathlib import Path
from requests.exceptions import HTTPError

# Create your views here.
class PDmonDetailView(DetailView):
    model = pdmon
    slug_url_kwarg = 'arduino_name'
    slug_field = 'name'
    template_name = 'arduino/arduino.html'
    
    def get_context_data(self, **kwargs):
        context = {}
        Arduino = super().get_object()
        context['arduino'] = json.loads(serializers.serialize('json', [Arduino]))[0]['fields']
        context['arduino']['model'] = 'pdmon'
        return context

class PDmonControlView(View):
    model = pdmon
    slug_url_kwarg = 'arduino_name'
    slug_field = 'name'
    template_name = 'arduino/arduino.html'
    
    def get(self, request, *args, **kwargs):
        response = {}
    
        try: arduino = get_object_or_404(pdmon, name=arduino_name)
        except Http404:
            response['message'] = 'Device not found.'
            return HttpResponse(json.dumps(response))
    
        try:
            url = arduino.http_str() + 'data/get/'
            r = requests.get(url)
            r.raise_for_status()
        except HTTPError as http_err:
            response['message'] = str(http_err) 
        except Exception as err:
            response['message'] = str(err)
        else:
            response = r.json()
            day = response['value']['updated'][:10]
            full_path = Path(Path.home().as_posix()+'/Dropbox (CoQuMa)/LabNotes/NaKa/'+day[:7]+'/'+day+'/data')
            try :
                full_path.mkdir(parents=True, exist_ok=True)
            except FileExistsError :
                print('already exists!')
                full_path = Path(Path.cwd().as_posix()+'/data')
                       
            with open(str(full_path)+'\\'+arduino_name+'_'+day+'.csv', 'a', newline='', encoding='UTF8') as f:
                writer = csv.writer(f)
                writer.writerow([value for key, value in response['value'].items()])
                f.close()
                    
            response['keys'] = arduino.keys()
            response['message'] = 'Arduino ready.'
                
        return HttpResponse(json.dumps(response))
        
        
class TctrlDetailView(DetailView):
    model = tctrl
    slug_url_kwarg = 'arduino_name'
    slug_field = 'name'
    template_name = 'arduino/arduino.html'
    
    def get_context_data(self, **kwargs):
        Arduino = super().get_object()
        context = {}
        context['arduino'] = json.loads(serializers.serialize('json', [Arduino]))[0]['fields']
        context['arduino']['model'] = 'tctrl'
        return context

	
class THsenDetailView(DetailView):
    model = thsen
    slug_url_kwarg = 'arduino_name'
    slug_field = 'name'
    template_name = 'arduino/arduino.html'

    def get_context_data(self, **kwargs):
        Arduino = super().get_object()
        context = {}
        context['arduino'] = json.loads(serializers.serialize('json', [Arduino]))[0]['fields']
        context['arduino']['model'] = 'thsen'
        return context

 
def arduino(request, arduino_name):
    response = {}
    
    try: arduino = get_object_or_404(pdmon, name=arduino_name)
    except Http404:
        try: arduino = get_object_or_404(tctrl, name=arduino_name)
        except Http404:
            try: arduino = get_object_or_404(thsen, name=arduino_name)
            except Http404:
                response['message'] = 'Device not found.'
                return HttpResponse(json.dumps(response))
    
    # THIS IS FOR PROCESSING THE AXIOS REQUESTS #
    r_dict = json.loads(request.body.decode())
    print(r_dict)
    command = r_dict['command']
    
    if command == 'DELETE':
        arduino.delete()
        response['message'] = 'Deleted successfully.'
    if command == 'ADD':
        r_dict['arduino'].pop('model')
        arduino = typ.objects.create(**r_dict['arduino'])
        arduino.save()
        response['message'] = 'New arduino added.'
    
    else: 
        try:
            url = arduino.http_str() + 'data/get/'
            r = requests.get(url)
            r.raise_for_status()
        except HTTPError as http_err:
            response['message'] = str(http_err) 
        except Exception as err:
            response['message'] = str(err)
        else:
            if command == 'STATUS':
                response = r.json()
                day = response['value']['updated'][:10]
                
                full_path = Path(Path.home().as_posix()+'/Dropbox (CoQuMa)/LabNotes/NaKa/'+day[:7]+'/'+day+'/data')
                try :
                    full_path.mkdir(parents=True, exist_ok=True)
                except FileExistsError :
                    print('already exists!')
                    full_path = Path(Path.cwd().as_posix()+'/data')
                        
                with open(str(full_path)+'\\'+arduino_name+'_'+day+'.csv', 'a', newline='', encoding='UTF8') as f:
                    writer = csv.writer(f)
                    writer.writerow([value for key, value in response['value'].items()])
                    f.close()
                    
                response['keys'] = arduino.keys()
                response['message'] = 'Arduino ready.'
            elif command == 'EDIT':
                for p in r_dict['params']: arduino.set(p, r_dict['params'][p])
                arduino.save()
                response['message'] = 'Parameters updated successfully.'
            else:
                response['message'] = 'Invalid operation.'
                
    #print(response)
    return HttpResponse(json.dumps(response))
