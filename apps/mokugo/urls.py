from django.urls import path
from . import views

app_name='mokugo'
urlpatterns = [
	path('<slug:mokugo_name>/', views.MokugoDetailView.as_view(), name='mokugo'),
	path('<slug:mokugo_name>/ping/', views.mokugo_ping, name='mokugo_ping'),
]
