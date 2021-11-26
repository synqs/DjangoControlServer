from django.urls import path
from . import views

app_name='laser'
urlpatterns = [
	path('<slug:laser_name>/', views.LaserDetailView.as_view(), name='laser'),
    path('<slug:laser_name>/control/', views.LaserControlView.as_view(), name='laser_control'),
	#path('<slug:slug>/control/', views.laser, name='laser_control'),
]
