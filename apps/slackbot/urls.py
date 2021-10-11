from django.urls import path
from . import views

app_label = 'slackbot'
urlpatterns = [
	path('commands/', views.commands, name='commands'),
	path('events/', views.events, name='events'),
]
