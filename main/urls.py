from django.urls import path
from . import views

app_name = 'main'
urlpatterns = [
	path('index/', views.index, name='index'),
	path('devices/', views.device_index, name='index'),
	path('<int:pdmon_id>/', views.detail, name='pdmon_detail'),
	path('<int:tctrl_id>/', views.detail, name='tctrl_detail'),
]
