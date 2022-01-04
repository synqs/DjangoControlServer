from django.urls import path, re_path
from . import views

app_name='main'
urlpatterns = [
	path('index/', views.IndexView.as_view(), name='index'),
	path('index/<slug:device_name>/ping/', views.PingView.as_view(), name='device_ping'),
    	path('index/<int:pk>/delete/', views.DeleteView.as_view(), name='device_delete'),
    	#re_path(r'^.*$', views.HomepageView.as_view(), name='homepage'),
]
