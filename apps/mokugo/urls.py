from django.urls import path, include
from . import views

urlpatterns = [
	path('<str:mokugo_name>/', views.mokugo, name='mokugo'),
]
