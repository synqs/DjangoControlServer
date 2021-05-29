from django.contrib import admin
from django.urls import include, path

urlpatterns = [
	path('temp_control/', include('app/temp_control.urls')),
	path('pd_monitor/', include('app/pd_monitor.urls')),
	path('admin/', admin.site.urls)
]
