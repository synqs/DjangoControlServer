from django.test import TestCase
from django.urls import reverse

from .models import PDmon

# Create your tests here.
class DeviceIndexViewTests(TestCase):
	def test_index_view_status_code(self):
		response = self.client.get(reverse('pd_monitor:index'))
		self.assertEqual(response.status_code, 200)
