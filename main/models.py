from django.db import models
import requests
from django.core.validators import MaxValueValidator

# Create your models here.
class PDmon(models.Model):
	id = models.BigAutoField(primary_key=True)
	name = models.CharField(max_length=20, unique=True)			# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	ip = models.CharField(max_length=20)						# device ip
	
	# parameters/values for pdmon
	dVmax = models.FloatField(blank=True, default=0.5)

	class Meta:
		verbose_name = "PDmon"
	
	def __str__(self):
		return self.name

	def http_str(self):
		return 'http://' + self.ip + '/'

	def keys(self):
		keys = {'updated': True }
		for i in range(6): keys["A" + str(i)] = True
		
		return keys
	
	def set(self, key, param):
		setattr(self, key, param)
		try:
			set_str = 'arduino/write/' + key + '/' + getattr(self, key) + '/';
			addr = self.http_str() + set_str;
			r = requests.get(addr) # , timeout = self.timeout,proxies=proxies);
			return r.ok;
		except ConnectionError:
			return False
		
	def limits(self):
		limits = {'V' : self.dVmax } 
		return limits

class Tctrl(models.Model):
	id = models.BigAutoField(primary_key=True)
	name = models.CharField(max_length=20, unique=True)			# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	ip = models.CharField(max_length=20, blank=True)			# device ip

	# parameters/values for tctrl
	setpointmax = models.IntegerField(default=100, validators=[MaxValueValidator(100)])
	setpoint = models.IntegerField(blank=True, default=20, validators=[MaxValueValidator(100)])
	P = models.FloatField(blank=True, default=1)
	I = models.FloatField(blank=True, default=100)
	D =  models.FloatField(blank=True, default=0)
	dTmax = models.FloatField(blank=True, default=2)
	
	class Meta:
		verbose_name = "Tctrl"
		
	def __str__(self):
		return self.name

	def http_str(self):
		return 'http://' + self.ip + '/'

	def keys(self):
		keys = {	'updated':'true', 'setpoint':'true', 'T':'true', 'error':'true',
					'output':'true', 'P':'true', 'I':'true', 'D':'true'}
		return keys

	def set(self, key, param):
		setattr(self, key, param)
		try:
			set_str = 'arduino/write/' + key + '/' + getattr(self, key) + '/';
			addr = self.http_str() + set_str;
			r = requests.get(addr) # , timeout = self.timeout,proxies=proxies);
			return r.ok;
		except ConnectionError:
			return False

	def limits(self):
		limits = { 'T' : self.dTmax }
		return limits

class MokuGo(models.Model):
	id = models.BigAutoField(primary_key=True)
	name = models.CharField(max_length=20, unique=True)			# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	ip = models.CharField(max_length=20, blank=True)			# device ip
	
	session = models.BooleanField(default=False, editable=False)
	
	class Meta:
		verbose_name = "MokuGo"
		
	def __str__(self):
		return self.name
		
	def ping(self):
		try:
			i = Oscilloscope(self.ip, force_connect=True)
		except Exception as err:
			return err
		else:
			# Close the connection to the Moku device
			# This ensures network resources and released correctly
			i.relinquish_ownership()
			return ok
			
	def disconnect(session):
		# Close the connection to the Moku device
		# This ensures network resources and released correctly
		session.relinquish_ownership()
		
	def osc(self):
		print('success?')
		# Connect to your Moku by its ip address using Oscilloscope('192.168.###.###')
		i = Oscilloscope(self.ip, force_connect=True)
	
		# Set the data source of Channel 1 to be Input 1
		i.set_source(1, 'Input1')

		# Set the data source of Channel 2 to the generated output sinewave
		i.set_source(2, 'Input2')
	
		# Fetch data for one time
		data = i.get_data()
		print(data)
	
		return data