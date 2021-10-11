from django.urls import path
from . import views

app_name='redpitaya'
urlpatterns = [
	path('<str:redpitaya_name>/', views.redpitaya, name='redpitaya'),
]
