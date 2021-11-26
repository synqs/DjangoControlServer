from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

# Create your models here
class device(models.Model):
	content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
	object_id = models.PositiveIntegerField()
	content_object = GenericForeignKey('content_type', 'object_id')
	
	model = models.CharField(max_length=20, default='none')
	name = models.CharField(max_length=20)				# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	ip = models.CharField(max_length=20, unique=True)		# device ip
	url = models.CharField(max_length=50)
	
	def __str__(self):
		return self.name

	def ping(self):
		import platform, subprocess
		parameter = '-n' if platform.system().lower()=='windows' else '-c'
		command = ['ping', parameter, '1', self.ip]
		success = subprocess.check_output(command).decode('utf-8').find('TTL')

		if success != -1 : return True
		else : return False

def create_device(sender, instance, created, **kwargs):
	content_type = ContentType.objects.get_for_model(instance)
	
	try: d = device.objects.get(content_type=content_type, object_id=instance.id)
	except device.DoesNotExist:
		d = device(content_type=content_type, object_id=instance.id)
		
	d.model = sender._meta.verbose_name
	d.name = instance.name
	d.description = instance.description
	d.ip = instance.ip
	d.url = instance.get_absolute_url()
	d.save()

def delete_device(sender, instance, created, **kwargs):
	content_type = ContentType.objects.get_for_model(instance)
	
	try: d = device.objects.get(content_type=content_type, object_id=instance.id)
	except device.DoesNotExist:
		d = device(content_type=content_type, object_id=instance.id)
        
	d.delete()