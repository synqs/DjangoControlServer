from django.db import models

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
