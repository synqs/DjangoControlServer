from django.db import models
import requests

# Create your models here.
class PDmon(models.Model):
	name = models.CharField(max_length=20, unique=True)		# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	sleeptime = models.FloatField(default=5)			# sleeptime/interval after which to pull the device again
	ip = models.CharField(max_length=20, blank=True)		# device ip
	port = models.CharField(max_length=4, blank=True)		# device port
	
	# parameters/values for pdmon
	data_string = models.CharField(max_length=100, blank=True)	# store data in string

	def __str__(self):
		return self.name

class Tctrl(models.Model):
	name = models.CharField(max_length=20, unique=True)		# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	sleeptime = models.FloatField(default=5)			# sleeptime/interval after which to pull the device again

	ip = models.CharField(max_length=20, blank=True)		# device ip
	port = models.CharField(max_length=4, blank=True)		# device port

	# parameters/values for tctrl
	setpoint = models.IntegerField(blank=True, default=25)
	value = models.FloatField(blank=True, default=0)
	output = models.FloatField(blank=True, default=0)
	error = models.FloatField(blank=True, default=0)
	gain = models.FloatField(blank=True, default=1)
	tauI = models.FloatField(blank=True, default=100)
	tauD =  models.FloatField(blank=True, default=0)
	data_string = models.CharField(max_length=100, blank=True)
	
	def __str__(self):
		return self.name
