from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Tctrl(models.Model):
	name = models.CharField(max_length=20, unique=True)		# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	sleeptime = models.FloatField(default=5)

	ip = models.CharField(max_length=20, blank=True)		# device ip
	port = models.CharField(max_length=4, default=80)		# device port (incl. default=80 for YUN ?)

	tcrtl_added_by = models.ForeignKey(User, related_name='tctrls', on_delete=models.CASCADE)

	setpoint = models.IntegerField(default=25)
	value = models.FloatField()
	output = models.FloatField()
	error = models.FloatField()
	gain = models.FloatField(default=1)
	tauI = models.FloatField(blank=True, default=100)
	tauD =  models.FloatField(blank=True, default=0)
	
	
	def __str__(self):
		return self.name
	
	def http_str(self):
		return "http://" + self.ip + ":" + self.port
	
	def all_val(self):
		return self.http_str() + "arduino/read/all"
