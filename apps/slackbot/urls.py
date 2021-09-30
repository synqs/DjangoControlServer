from django.urls import path
from . import views

urlpatterns = [
	path('commands/', views.commands, name='commands'),
	path('events/', views.events, name='events'),
]
