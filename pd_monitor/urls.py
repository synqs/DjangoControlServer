from django.urls import path
from . import views

app_name = 'pd_monitor'
urlpatterns = [
	path('', views.index, name='index'),
	path('<int:pk>/', views.detail, name='detail'),
	path('jstest/', views.jstest, name='jstest'),
	path('json/', views.json_data, name='json_data')
]
