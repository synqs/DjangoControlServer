from django.urls import path
from . import views

app_name='main'
urlpatterns = [
	path('index/', views.index, name='index'),
	# path('devices/', views.devices, name='devices'), see index.js - we use the django template tag
	# path('arduino/<str:device_typ>/<str:device_name>/', views.arduino, name='arduino'),
	# path('slackbot/', views.slackbot, name='slackbot'),
	# path('events/', views.events, name='events'),
	# path('commands/', views.commands, name='commands'),
	# path('mokugo/<str:mokugo_name>/', views.mokugo, name='mokugo'),
]
