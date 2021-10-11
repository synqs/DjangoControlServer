from django.urls import path
from . import views

app_name='arduino'
urlpatterns = [
	path('pdmon/<slug:slug>/', views.PDmonDetailView.as_view(), name='pdmon'),
	path('tctrl/<slug:slug>/', views.TctrlDetailView.as_view(), name='tctrl'),
	path('<str:arduino_name>/', views.arduino, name='arduino'),
]
