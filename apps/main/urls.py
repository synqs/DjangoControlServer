from django.urls import path
from . import views

app_name='main'
urlpatterns = [
	path('', views.HomepageView.as_view(), name='homepage'),
	path('index/', views.IndexView.as_view(), name='index'),
	path('index/ping/<slug:device_name>/', views.PingView.as_view(), name='device_ping'),
]
