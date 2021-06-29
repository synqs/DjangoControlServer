from django.urls import path
from . import views

urlpatterns = [
	path('index/', views.index, name='index'),
	path('<str:device_type>/<str:device_name>/', views.detail, name='detail'),
]
