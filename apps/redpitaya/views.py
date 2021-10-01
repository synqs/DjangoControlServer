from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.http import HttpResponse
from django.core import serializers

#from apps import arduino, mokugo
import requests, json, os

from requests.exceptions import HTTPError
from urllib.parse import parse_qs

# Create your views here.
