from django.urls import path
from . import views

app_name = 't_control'
urlpatterns = [
	path('', views.index, name='tctrl_index'),
	path('<int:tctrl_id>/', views.detail, name='tctrl_detail')
]
