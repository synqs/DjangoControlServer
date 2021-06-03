from django.urls import path
from . import views

app_name = 'pd_monitor'
urlpatterns = [
	path('', views.index, name='index'),
	path('<int:device_id>/', views.detail, name='detail'),
	path('<int:device_id>/remove_device/', views.remove_device, name='remove_device'),
	path('js_test/', views.goto_js, name='goto_js')
]
