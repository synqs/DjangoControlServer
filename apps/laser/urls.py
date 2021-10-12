from django.urls import path
from . import views

app_name='laser'
urlpatterns = [
	path('<slug:laser_name>/', views.LaserDetailView.as_view(), name='laser'),
	path('<slug:slug>/control/', views.laser, name='laser_control'),
]
