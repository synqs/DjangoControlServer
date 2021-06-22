from django.urls import path
from . import views

app_name = 't_control'
urlpatterns = [
	path('', views.index, name='index'),
	path('<int:device_id>/', views.detail, name='detail')
]
