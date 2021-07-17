from django.urls import path
from . import views

app_name='main'
urlpatterns = [
	path('index/', views.index, name='index'),
	# path('devices/', views.devices, name='devices'), see index.js - we use the django template tag
	path('<str:device_type>/<int:device_id>/', views.detail, name='detail'),
	path('main.pdmon/', views.pdmon, name='pdmon'),
	path('tctrl/<int:device_id>/', views.tctrl, name='tctrl'),
]
