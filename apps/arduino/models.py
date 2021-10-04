from django.db import models
from main.models import create_device
from django.db.models.signals import post_save

# Create your models here.
class pdmon(models.Model):
	id = models.BigAutoField(primary_key=True)
	name = models.CharField(max_length=20, unique=True)			# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	ip = models.CharField(max_length=20)						# device ip
	
	class Meta:
		verbose_name = "PDmon"
	
	def __str__(self):
		return self.name
		
	def get_absolute_url(self):
		return "arduino/%s/" % self.name

	def http_str(self):
		return 'http://' + self.ip + '/'

	def keys(self):
		keys = {'updated': True }
		for i in range(6): keys["A" + str(i)] = True
		
		return keys

post_save.connect(create_device, sender=pdmon)

class tctrl(models.Model):
	id = models.BigAutoField(primary_key=True)
	name = models.CharField(max_length=20, unique=True)		# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	ip = models.CharField(max_length=20, blank=True)		# device ip

	class Meta:
		verbose_name = "Tctrl"
		
	def __str__(self):
		return self.name
		
	def get_absolute_url(self):
		return "arduino/%s/" % self.name

	def http_str(self):
		return 'http://' + self.ip + '/'

	def keys(self):
		keys = {	'updated':'true', 'setpoint':'true', 'T':'true', 'error':'true',
				'output':'true', 'P':'true', 'I':'true', 'D':'true'}
		return keys

	def set(self, key, param):
		try:
			set_str = 'arduino/write/' + key + '/' + param + '/';
			addr = self.http_str() + set_str;
			r = requests.get(addr) # , timeout = self.timeout,proxies=proxies);
			return r.ok;
		except ConnectionError:
			return False

post_save.connect(create_device, sender=tctrl)			
