from django.urls import path
from . import views

app_name = 'main'
urlpatterns = [
	path('index/', views.index, name='index'),
	path('devices/', views.device_index, name='device_index'),
	path('<str:device_type>/<str:device_name>/', views.detail, name='detail'),
]
