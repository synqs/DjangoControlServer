from django.urls import path
from . import views

app_name='mokugo'
urlpatterns = [
	path('<slug:mokugo_name>/', views.MokugoDetailView.as_view(), name='mokugo'),
	path('<slug:mokugo_name>/data/', views.MokugoDataView.as_view(), name='mokugo_data'),
	path('<slug:mokugo_name>/edit/', views.MokugoEditView.as_view(), name='mokugo_edit'),
]
