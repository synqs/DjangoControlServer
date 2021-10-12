from django.urls import path
from . import views

app_name='arduino'
urlpatterns = [
	path('pdmon/<slug:arduino_name>/', views.PDmonDetailView.as_view(), name='pdmon'),
	path('tctrl/<slug:arduino_name>/', views.TctrlDetailView.as_view(), name='tctrl'),
	path('<str:arduino_name>/', views.arduino, name='arduino'),
]
