from django.db import models
from django.utils import timezone

# Create your models here.
class WebTempControl(models.Model):
	id = models.IntegerField(primary_key=True)

	name = models.CharField(max_length=50)
	sleeptime = models.FloatField(default=100)

	ip_address = models.CharField(max_length=50)
	port = models.CharField(max_length=4)
	user_id = models.ForeignKey(user.id)

	setpoint = models.FloatField(default=0)
	value = models.FloatField(default=0)
	output = models.FloatField(default=0)
	error = models.FloatField(default=0)

	gain = models.FloatField(default=0)
	integral = models.FloatField(default=0)
	diff = models.FloatField(default=0)

	timestamp = models.DateTimeField(default=timezone.now())

	timeout = 5
