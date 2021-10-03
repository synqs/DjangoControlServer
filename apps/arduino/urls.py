from django.urls import path, include
from . import views

app_name='arduino'
urlpatterns = [
	path('<str:arduino_typ>/<str:arduino_name>/', views.arduino, name='arduino'),
]
