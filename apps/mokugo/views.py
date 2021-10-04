from django.shortcuts import render, get_object_or_404
from .models import mokugo

# Create your views here.
def mokugo(request, name):
	moku = get_object_or_404(mokugo, name=name)
	
	if request.method == 'DELETE':
		moku.delete()
		render(request, 'main/index.html')
	if request.method == 'GET':
		render(request, 'mokugo/mokugo.html', { 'moku' : moku })
	#if request.method == 'POST':
