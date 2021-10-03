from django.urls import path, include
from . import views

app_name='mokugo'
urlpatterns = [
	path('<str:mokugo_name>/', views.mokugo, name='mokugo'),
]
