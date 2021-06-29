from django.db import models

# Create your models here.
class PDmon(models.Model):
	name = models.CharField(max_length=20, unique=True)		# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	sleeptime = models.FloatField(default=5)

	ip = models.CharField(max_length=20, blank=True)		# device ip
	port = models.CharField(max_length=4, blank=True)		# device port (incl. default=80 for YUN ?)

	value = models.FloatField(default=True, blank=True)				# here, this is a voltage

	# def __str__(self):
	#	return self.name
	
	def http_str(self):
		return "http://" + self.ip + ":" + self.port
	
	def all_val(self):
		return self.http_str() + "arduino/read/all"
		
class Tctrl(models.Model):
	name = models.CharField(max_length=20, unique=True)		# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	sleeptime = models.FloatField(default=5)

	ip = models.CharField(max_length=20, blank=True)		# device ip
	port = models.CharField(max_length=4, default=80)		# device port

	setpoint = models.IntegerField(blank=True, default=25)
	value = models.FloatField(blank=True, default=0)
	output = models.FloatField(blank=True, default=0)
	error = models.FloatField(blank=True, default=0)
	gain = models.FloatField(blank=True, default=1)
	tauI = models.FloatField(blank=True, default=100)
	tauD =  models.FloatField(blank=True, default=0)
