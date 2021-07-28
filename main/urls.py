from django.urls import path
from . import views

app_name='main'
urlpatterns = [
	path('index/', views.index, name='index'),
	# path('devices/', views.devices, name='devices'), see index.js - we use the django template tag
	path('<str:device_typ>/<str:device_id>/', views.detail, name='detail'),
	path('device/', views.device, name='device'),
	path('main.tctrl/', views.tctrl, name='tctrl'),
]
