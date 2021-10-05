from django.urls import path
from . import views

app_name='laser'
urlpatterns = [
	path('<slug:slug>/', views.LaserDetailView.as_view(), name='laser'),
]