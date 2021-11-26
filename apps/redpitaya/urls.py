from django.urls import path
from . import views

app_name='redpitaya'
urlpatterns = [
    path('<slug:redpitaya_name>/', views.RedPitayaDetailView.as_view(), name='redpitaya'),
	path('<slug:redpitaya_name>/control/', views.RedPitayaControlView.as_view(), name='redpitaya_control'),
]
