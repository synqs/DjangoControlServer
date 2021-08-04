from django.db import models
import requests
from django.shortcuts import render

# Create your models here.
class PDmon(models.Model):
	id = models.BigAutoField(primary_key=True)
	name = models.CharField(max_length=20, unique=True)		# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	sleeptime = models.FloatField(default=5)			# sleeptime/interval after which to pull the device again
	ip = models.CharField(max_length=20, blank=True)		# device ip
	port = models.CharField(max_length=4, blank=True)		# device port
	
	# parameters/values for pdmon
	channel_string = models.CharField(max_length=27, default='0,1,2,3,4,5,6,7,8,9,10,11') # 0-5 corresponds to the analog pins

	def __str__(self):
		return self.name

	def http_str(self):
		return 'http://' + self.ip + '/'

	def keys(self, array=[]):
		channels = ['updated']
		if array: buff = array.split(',')
		else: buff = self.channel_string.split(',')
		
		for ch in buff:
			channels.append("CH" + ch.zfill(2))
		return channels
		
	def set(self, param):
		try:
			set_str = 'arduino/write/' + param + '/' + getattr(self, param) + '/';
			addr = self.http_str() + set_str;
			r = requests.get(addr) # , timeout = self.timeout,proxies=proxies);
			return r.ok;
		except ConnectionError:
			return False

class Tctrl(models.Model):
	id = models.BigAutoField(primary_key=True)
	name = models.CharField(max_length=20, unique=True)		# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	sleeptime = models.FloatField(default=5) # sleeptime/interval after which to pull the device again

	ip = models.CharField(max_length=20, blank=True)		# device ip
	port = models.CharField(max_length=4, blank=True)		# device port

	# parameters/values for tctrl
	setpoint = models.IntegerField(blank=True, default=25)
	value = models.FloatField(blank=True, default=0)
	output = models.FloatField(blank=True, default=0)
	error = models.FloatField(blank=True, default=0)
	P = models.FloatField(blank=True, default=1)
	I = models.FloatField(blank=True, default=100)
	D =  models.FloatField(blank=True, default=0)
	
	keyss = ['updated', 'setpoint', 'T', 'error', 'output', 'P', 'I', 'D']
	
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
