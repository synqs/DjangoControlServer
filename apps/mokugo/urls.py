from django.urls import path, include
from . import views

app_name='mokugo'
urlpatterns = [
	path('<slug:slug>/', views.MokugoDetailView.as_view(), name='mokugo'),
	path('<slug:mokugo_name>/ping/', views.mokugo_ping, name='mokugo_ping'),
]
