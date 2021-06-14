from django.db import models
from django.contrib.auth.models import User
from django.core.serializers.json import Serializer

# Create your models here.
class Device(models.Model):
	name = models.CharField(max_length=20, unique=True)		# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	sleeptime = models.FloatField(default=5)

	ip = models.CharField(max_length=20, blank=True)		# device ip
	port = models.CharField(max_length=4, blank=True)		# device port (incl. default=80 for YUN ?)

	value = models.FloatField(default=True, blank=True)				# here, this is a voltage

	added_by = models.ForeignKey(User, related_name='devices', on_delete=models.CASCADE, blank=True, null=True)

	def __str__(self):
		return self.name
	
	def http_str(self):
		return "http://" + self.ip + ":" + self.port
	
	def all_val(self):
		return self.http_str() + "arduino/read/all"
	
	def pin_val(self, inputpin):
		    return self.http_str() + "arduino/read/" + inputpin
		    
	def get_json(self):
		return {
			"name" : self.name,
			"descripion" : self.description,
			"ip" : self.ip
			} 
