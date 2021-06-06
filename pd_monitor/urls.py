from django.urls import path
from . import views

app_name = 'pd_monitor'
urlpatterns = [
	path('', views.IndexView.as_view(), name='index'),
	path('<int:device_id>/', views.DetailView.as_view(), name='detail'),
	path('<int:device_id>/remove_device/', views.remove_device, name='remove_device')
]
