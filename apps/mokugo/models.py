from django.db import models

# Create your models here.
class mokugo(models.Model):
	id = models.BigAutoField(primary_key=True)
	name = models.CharField(max_length=20, unique=True)			# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	ip = models.CharField(max_length=20, unique=True)			# device ip
	
	@classmethod
	def create(self, name, ip):
		mokugo = self.create(name=self.name, ip=self.ip)
		device = device(content_type=self, object_ide=self.id)
		device.save()
		
		return mokugo
		
		
	class Meta:
		verbose_name = "MokuGo"
		
	def __str__(self):
		return self.name
		
	def ping(self):
		try:
			i = Oscilloscope(self.ip, force_connect=True)
		except Exception as err:
			return err
		else:
			# Close the connection to the Moku device
			# This ensures network resources and released correctly
			i.relinquish_ownership()
			return ok
			
	def disconnect(session):
		# Close the connection to the Moku device
		# This ensures network resources and released correctly
		session.relinquish_ownership()
		
	def osc(self):
		print('success?')
		# Connect to your Moku by its ip address using Oscilloscope('192.168.###.###')
		i = Oscilloscope(self.ip, force_connect=True)
	
		# Set the data source of Channel 1 to be Input 1
		i.set_source(1, 'Input1')

		# Set the data source of Channel 2 to the generated output sinewave
		i.set_source(2, 'Input2')
	
		# Fetch data for one time
		data = i.get_data()
		print(data)
	
		return data 
