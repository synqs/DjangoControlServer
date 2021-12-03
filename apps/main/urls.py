from django.urls import path
from . import views

app_name='main'
urlpatterns = [
	path('', views.HomepageView.as_view(), name='homepage'),
	path('index/', views.IndexView.as_view(), name='index'),
	path('index/<slug:device_name>/ping/', views.PingView.as_view(), name='device_ping'),
    path('index/<int:pk>/delete/', views.DeleteView.as_view(), name='device_delete'),
]
