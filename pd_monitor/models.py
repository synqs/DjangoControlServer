from django.db import models

# Create your models here.
class Device(models.Model):
	id = models.IntegerField(pk=True)

	name = models.CharField(max_length=20)
	sleeptime = models.FlatField(default=5)

	ip_address = models.CharField(max_length=20)
	port = models.CharField(max_length=40)

	value = models.FloatField(default=0)

	def __str__(self):
		return self.name+', '+self.sleeptime
