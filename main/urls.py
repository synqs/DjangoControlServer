from django.urls import path
from . import views

app_name='main'
urlpatterns = [
	path('index/', views.index, name='index'),
	path('devices/', views.devices, name='devices'),
	path('<str:device_type>/<int:device_id>/', views.detail, name='detail'),
	path('pdmon/<int:device_id>/', views.pdmon, name='pdmon'),
]