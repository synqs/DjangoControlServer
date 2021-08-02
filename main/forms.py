from django import forms

class AddDeviceForm(forms.Form): # Add a new Arduino
	ip_adress = forms.CharField(label='Update to IP:')
	port = forms.IntegerField(label='Update to port:')

class UpdateSleeptimetForm(forms.Form): # Update sleeptime
	serial_time = forms.IntegerField(label='Time between measurements (s):')

class UpdateChannelForm(forms.Form): # Update channels
	channels = forms.CharField(label='New channel string:') 
	
class UpdateSetpointForm(forms.Form): # Update setpoint
	setpoint = forms.IntegerField(label='New setpoint:')

class UpdateGainForm(forms.Form): # Update P (gain)
	gain = forms.FloatField(label='New gain:')

class UpdateIntegralForm(forms.Form): # Update I (tauI)
	tau = forms.FloatField(label='New tauI in seconds:')

class UpdateDifferentialForm(forms.Form): # Update D (tauD)
	tau = forms.FloatField(label='New tauD in seconds:')

class ConnectForm(forms.Form): # Connect to the Arduino
	ip_adress = forms.CharField(label='Connect to IP:')
	port = forms.IntegerField(label='Port:')
	name = forms.CharField(label='Name of the Arduino:')
