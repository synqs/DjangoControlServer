from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

# Create your models here
class device(models.Model):
	content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
	object_id = models.PositiveIntegerField()
	content_object = GenericForeignKey('content_type', 'object_id')
	
	name = models.CharField(max_length=20, unique=True)						# should match DNS name eg. nakayun1
	description = models.CharField(max_length=100, blank=True)	# add. description eg. 2D-MOT path
	ip = models.CharField(max_length=20, unique=True, default='0.0.0.0')						# device ip
	url = models.CharField(max_length=50, unique=True)
	
	def __str__(self):
		return self.name
		
def create_device(sender, instance, created, **kwargs):
	content_type = ContentType.objects.get_for_model(instance)
	
	try: d = device.objects.get(content_type=content_type, object_id=instance.id)
	except device.DoesNotExist:
		d = device(content_type=content_type, object_id=instance.id)
		
	print(instance)
	print(instance.name)
	print(instance.description)
	print(instance.ip)
	print(instance.get_absolute_url())
		
	d.name = instance.name
	d.description = instance.description
	d.ip = instance.ip
	d.url = instance.get_absolute_url()
	d.save()