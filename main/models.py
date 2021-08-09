from django.db import models
import requests
from django.shortcuts import render

# Create your models here.
class PDmon(models.Model):
	id = models.BigAutoField(primary_key=True)
	name = models.CharField(max_length=20, unique=True)		# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	ip = models.CharField(max_length=20)				# device ip
	
	# parameters/values for pdmon
	sleeptime = models.FloatField(default=5)			# interval after which to pull the device again
	
	channels = models.CharField(max_length=6, default='111111') 	# corresponds to the analog pins A0, A1...
	dVmax = models.FloatField(blank=True, default=0.5)

	def __str__(self):
		return self.name

	def http_str(self):
		return 'http://' + self.ip + '/'

	def keys(self):
		keys = ['updated']

		for i in range(len(self.channels)):
			if self.channels[i] == '1':
				print(i)
				keys.append("A" + str(i))
		return keys
	
	def set(self, param):
		try:
			set_str = 'arduino/write/' + param + '/' + getattr(self, param) + '/';
			addr = self.http_str() + set_str;
			r = requests.get(addr) # , timeout = self.timeout,proxies=proxies);
			return r.ok;
		except ConnectionError:
			return False
		
	def limits(self):
		limits = [{'V' : self.dVmax }] 
		return limits

class Tctrl(models.Model):
	id = models.BigAutoField(primary_key=True)
	name = models.CharField(max_length=20, unique=True)		# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	ip = models.CharField(max_length=20, blank=True)		# device ip

	# parameters/values for tctrl
	sleeptime = models.FloatField(default=5)			# interval after which to pull the device again
	
	setpoint = models.IntegerField(blank=True, default=25)
	P = models.FloatField(blank=True, default=1)
	I = models.FloatField(blank=True, default=100)
	D =  models.FloatField(blank=True, default=0)
	dTmax = models.FloatField(blank=True, default=2)
	
	def __str__(self):
		return self.name

	def http_str(self):
		return 'http://' + self.ip + '/'

	def keys(self):
		keys = ['updated', 'setpoint', 'T', 'error', 'output', 'P', 'I', 'D']
		return keys

	def set(self, param):
		try:
			set_str = 'arduino/write/' + param + '/' + getattr(self, param) + '/';
			addr = self.http_str() + set_str;
			r = requests.get(addr) # , timeout = self.timeout,proxies=proxies);
			return r.ok;
		except ConnectionError:
			return False
			
	def limits(self):
		limits = [{ 'T' : self.dTmax }]
		return limits
