from django.db import models

# Create your models here.
class Tcrtl(models.Model):
	name = models.CharField(max_length=20, unique=True)		# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	sleeptime = models.FloatField(default=5)

	ip = models.CharField(max_length=20, blank=True)		# device ip
	port = models.CharField(max_length=4, default=80)		# device port (incl. default=80 for YUN ?)

	added_by = models.ForeignKey(User, related_name='devices', on_delete=models.CASCADE, blank=True, null=True)

	setpoint = models.IntField(default=25)
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
