from django.urls import path
from . import views

app_name='redpitaya'
urlpatterns = [
    path('<slug:redpitaya_name>/', views.RedPitayaDetailView.as_view(), name='redpitaya'),
	path('<str:redpitaya_name>/', views.redpitaya, name='redpitaya_ping'),
]
