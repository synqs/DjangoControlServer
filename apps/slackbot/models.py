from django.db import models

# Create your models here.
class slackbot(models.Model):
	id = models.BigAutoField(primary_key=True)
	name = models.CharField(max_length=20, unique=True)			# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	
	class Meta:
		verbose_name = "Slackbot"
		
	def __str__(self):
		return self.name
		
	def get_absolut_url(self):
		return "slackbot/%n/" % self.name