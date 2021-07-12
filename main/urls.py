from django.urls import path
from . import views

app_name='main'
urlpatterns = [
	path('index/', views.index, name='index'),
	path('<str:device_type>/<str:device_name>/', views.detail, name='detail'),
	path('data/', views.data, name='data'),
	path('remove/', views.remove, name='remove'),
	path('pdmon/<int:device_id>/', views.pdmon, name='pdmon'),
]
