from django.db import models
import requests
from django.core.validators import MaxValueValidator

# Create your models here.
class PDmon(models.Model):
	id = models.BigAutoField(primary_key=True)
	name = models.CharField(max_length=20, unique=True)		# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	ip = models.CharField(max_length=20)				# device ip
	
	# parameters/values for pdmon
	sleeptime = models.FloatField(default=5)			# interval after which to pull the device again
	
	channels = models.CharField(max_length=6, default='012345') 	# corresponds to the analog pins A0, A1...
	dVmax = models.FloatField(blank=True, default=0.5)

	def __str__(self):
		return self.name

	def http_str(self):
		return 'http://' + self.ip + '/'

	def keys(self):
		keys = ['updated']

		for i in self.channels:
			keys.append("A" + str(i))
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
		limits = [{'V' : self.dVmax }] 
		return limits

class Tctrl(models.Model):
	id = models.BigAutoField(primary_key=True)
	name = models.CharField(max_length=20, unique=True)		# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	ip = models.CharField(max_length=20, blank=True)		# device ip

	# parameters/values for tctrl
	sleeptime = models.FloatField(default=5)			# interval after which to pull the device again
	
	setpointmax = models.IntegerField(default=100, validators=[MaxValueValidator(100)])
	setpoint = models.IntegerField(blank=True, default=20, validators=[MaxValueValidator(100)])
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
		limits = [{ 'T' : self.dTmax }]
		return limits
