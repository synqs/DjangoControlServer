from django.views.generic import ListView, DetailView, TemplateView, View
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404
from django.core import serializers

from .models import redpitaya

import requests, json, pyrpl, datetime
from requests.exceptions import HTTPError
from PyQt5.QtCore import QObject, QThread

# Create your views here.
class RedPitayaDetailView(DetailView):
    model = redpitaya
    slug_url_kwarg = 'redpitaya_name'
    slug_field = 'name'
    template_name = 'redpitaya/redpitaya.html'
    
    def get_context_data(self, **kwargs):
        Redpitaya = super().get_object()
        context = {}
        context['redpitaya'] = json.loads(serializers.serialize('json', [Redpitaya]))[0]['fields']
        context['redpitaya']['model'] = 'redpitaya'
        return context
        
class RedPitayaControlView(View):
    model = redpitaya
    
    def get(self, request, *args, **kwargs): # Function for monitoring ?
        Redpitaya = get_object_or_404(self.model, name=kwargs['redpitaya_name'])
        return HttpResponse(json.dumps({ 'message' : 'LOL' }))
        
    def post(self, request, **kwargs):
        Redpitaya = get_object_or_404(self.model, name=kwargs['redpitaya_name'])
        r_dict = json.loads(request.body.decode())
        command = r_dict['command']; arg = r_dict['payload']
        
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        response = { 'value' : {'updated' : timestamp }}
        
        try :
            # session = pyrpl.Pyrpl(hostname=Redpitaya.ip, config=Redpitaya.ip[-3:])        # start pyrpl session
            #session = pyrpl.Pyrpl(hostname=Redpitaya.ip, config=Redpitaya.ip[-3:])
            thread = QThread()
            session = rp_session(hostname=Redpitaya.ip, config=Redpitaya.ip[-3:])
            session.moveToThread(thread)
            thread.start()
            r = session.rp
        except Exception as excp :
            print(excp)
            response['message'] = str(excp)
        else:
            r = pyrpl.Pyrpl(hostname=Redpitaya.ip, config=Redpitaya.ip[-3:]).rp
            if command == 'STATUS':
                response['value']['laser_ctrl'] = np.round(r.scope.voltage_in1,3)
                response['value']['setpoint'] = np.round(r.pid0.setpoint,3)
                
            full_path = Path(Path.home().as_posix()+'/Dropbox (CoQuMa)/LabNotes/NaKa/'+timestamp[:7]+'/'+timestamp[:10]+'/data')
            try :
                full_path.mkdir(parents=True, exist_ok=True)
            except FileExistsError :
                print('already exists!')
                full_path = Path(Path.cwd().as_posix()+'/data')
                        
            with open(str(full_path)+'\\'+kwargs['redpitaya_name']+'_'+timestamp[:10]+'.csv', 'a', newline='', encoding='UTF8') as f:
                writer = csv.writer(f)
                writer.writerow([value for key, value in response['value'].items()])
                f.close()

        return HttpResponse(json.dumps(response))
        
class rp_session(QObject):
    
    def __init__(self, hostname, config):
        self.hostname = hostname
        self.config = config
    

    def run(self):
        p = pyrpl.Pyrpl(hostname=self.hostname, config=self.config)