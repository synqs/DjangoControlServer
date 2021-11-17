from django.views.generic import ListView, DetailView, TemplateView, View
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.core import serializers

from .models import laser
import telnetlib, json, subprocess, platform, datetime, time, csv
import numpy as np

from pathlib import Path

# Create your views here.
class LaserDetailView(DetailView):
    model = laser
    slug_url_kwarg = 'laser_name'
    slug_field = 'name'
    template_name = 'laser/laser.html'
    
    def get_context_data(self, **kwargs):
        Laser = super().get_object()
        return { 'laser' : json.loads(serializers.serialize('json', [Laser]))[0]['fields'] }

class LaserControlView(View):
    model = laser
    
    def get(self, request, *args, **kwargs): # Function for monitoring ?
        Laser = get_object_or_404(self.model, name=kwargs['laser_name'])
        return HttpResponse(json.dumps({ 'message' : 'LOL' }))
        
    def post(self, request, **kwargs):
        Laser = get_object_or_404(self.model, name=kwargs['laser_name'])
        r_dict = json.loads(request.body.decode())
        command = r_dict['command']; arg = r_dict['payload']
        
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        response = { 'value' : {'updated' : timestamp }}
        
        try :
            session = telnetlib.Telnet(Laser.ip)        # start telnet session
        except Exception as excp :
            response['message'] = str(excp)
        
        else :
            if command == 'PING':
                session.write(b'ls_tool cplot\n')           # check status of laser
                time.sleep(1)                               # wait for the output
                session.read_until(b'Enable_Current_Laser_Diode : ')
                LD = session.read_until(b'\r\n').decode('ascii')[:2]
                if LD == 'ON' :
                    response['message'] =  'Laser diode ON.'
                    
                    session.write(b'\x1B\x5B\x44')
                    session.read_until(b'EDFA1_PhdOut : ')
                    EDFA = session.read_until(b'V').decode('ascii')
                    
                    response['value']['EDFA'] = EDFA[:-1]
                    
                    session.write(b'\x03')                      # quit the cplot...
                else :
                    response['message'] =  'Laser diode OFF.'
            elif command == 'TOGGLE':
                session.write(b'ls_tool Enable_Current_Laser_Diode' + bytes(arg +'\n', 'ascii'))
                response['message'] = 'Laser Diode ' + arg + '.'
        
            elif command == 'TOGGLE_EDFA':
                print('toggle_edfa')
                session.write('ls_tool edfa_shutdown edfa1\n')
                session.read_until('# ')
                session.write('ls_tool edfa_shutdown edfa0\n')
                response['message'] = 'EDFAs ' + arg + '.'

            elif command == 'SET_EDFA':
                #voltage = ( np.log( float(arg) + 0.6 ) + 0.5 ) / 0.35
                session.write(bytes('ls_tool edfa_set_phdout edfa1 ' + arg + '\n', 'utf-8'))
                session.read_until(b'pid_setpoint = ')
                setpoint = session.read_until(b'\n').decode('utf-8')
                
                EDFA = float(setpoint) * 2.999725 / 39321.6
                
                response['message'] = 'Power parameter updated.'
                response['value']['EDFA'] = str(np.round(EDFA,6))
                
            full_path = Path(Path.home().as_posix()+'/Dropbox (CoQuMa)/LabNotes/NaKa/'+timestamp[:7]+'/'+timestamp[:10]+'/data')
            try :
                full_path.mkdir(parents=True, exist_ok=True)
            except FileExistsError :
                print('already exists!')
                full_path = Path(Path.cwd().as_posix()+'/data')
                        
            with open(str(full_path)+'\\'+kwargs['laser_name']+'_'+timestamp[:10]+'.csv', 'a', newline='', encoding='UTF8') as f:
                writer = csv.writer(f)
                writer.writerow([value for key, value in response['value'].items()])
                f.close()
                
            session.write(b'exit\n')
            session.close() # clear session to save resources

        return HttpResponse(json.dumps(response))


''' not in use	
class telnet_command:
    def __init__(self, server, data={}):
        try : 
            host = telnetlib.Telnet(server)
            self.__host = host
        except Error as err : 
            print(err)
            return false
            
    def write(self, text):
        try : 
            self.__host.write(bytes('{}\n'.format(text), 'utf-8'))
        except OSError as err : 
            print(err)
            return false

    def toggle_LD(self, toggle):
        try :
            self.write('l_tool Enable_Current_Laser_Diode ' + toggle)
        except OSError as err : 
        	print(err)
        	return false
    
    def toggle_edfa(self, toggle):
        try :
            self.write('l_tool edfa_shutdown edfa1')
            self.read_until('# ')
            self.write('l_tool edfa_shutdown edfa0')
        except OSError as err : 
            print(err)
            return false
    
    def set_edfa(self, setpoint):
        try : 
            self.write('l_tool edfa_set_phdout edfa1 ' + setpoint)
        except OSError as err :
            print(err)
            return false
'''