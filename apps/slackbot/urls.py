from django.urls import path
from . import views

app_label = 'slackbot'
urlpatterns = [
    path('<slug:slackbot_name>/', views.SlackbotDetailView.as_view(), name='slackbot'),
    path('<slug:slackbot_name>/send/', views.SlackbotSendView.as_view(), name='send'),
	path('<slug:slackbot_name>/commands/', views.SlackbotCommandsView.as_view(), name='commands'),
	path('<slug:slackbot_name>/events/', views.SlackbotEventsView.as_view(), name='events'),
]
