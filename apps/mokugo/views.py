from django.shortcuts import render, get_object_or_404
from .models import mokugo

# Create your views here.
def mokugo(request):
	moku = get_object_or_404(mokugo, name=slug)
	
	if request.method == 'DELETE':
		moku.delete()
		render(request, 'main/index.html')
	if request.method == 'GET':
		render(request, 'mokugo/mokugo.html', { 'moku' : moku })
	#if request.method == 'POST':
	
def mokugo_ping(request):
	moku = get_object_or_404(mokugo, name=slug)
	success = moku.ping()
	if success: return ok
	else: return fail
