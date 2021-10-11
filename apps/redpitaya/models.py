from django.db import models
from main.models import create_device
from django.db.models.signals import post_save

# Create your models here.
class redpitaya(models.Model):
	id = models.BigAutoField(primary_key=True)
	name = models.CharField(max_length=20, unique=True)		# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	ip = models.CharField(max_length=20, blank=True)		# device ip
	
	class Meta:
		verbose_name = "Redpitaya"
		
	def __str__(self):
		return self.name
		
	def get_absolute_url(self):
		return "redpitaya/%s/" % self.name
		
post_save.connect(create_device, sender=redpitaya)
