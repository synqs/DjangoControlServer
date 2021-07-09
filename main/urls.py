from django.urls import path
from . import views

app_name='main'
urlpatterns = [
	path('index/', views.index, name='index'),
	path('<str:device_type>/<str:device_name>/', views.detail, name='detail'),
	path('<str:device_type>/<str:device_name>/data/', views.data, name='data'),
	path('<str:device_type>/<str:device_name>/remove/', views.remove, name='remove'),
]
