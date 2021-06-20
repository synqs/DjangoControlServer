from django.urls import path
from . import views

app_name = 'pd_monitor'
urlpatterns = [
	path('', views.index, name='index'),
	path('<int:device_id>/', views.detail, name='detail'),
	path('jsondata/', views.json_data, name='json_data')
]
