from django.urls import path
from . import views

app_label = 'slackbot'
urlpatterns = [
    path('<slug:slackbot_name>/', views.SlackbotDetailView.as_view(), name='slackbot'),
	path('<slug:slackbot_name>/commands/', views.commands, name='commands'),
	path('<slug:slackbot_name>/events/', views.events, name='events'),
]
