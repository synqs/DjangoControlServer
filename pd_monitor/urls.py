from django.urls import path
from . import views

app_name = 'pd_monitor'
urlpatterns = [
	path('', views.index, name='pdmon_index'),
	path('<int:pdmon_id>/', views.detail, name='pdmon_detail'),
]
