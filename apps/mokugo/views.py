from django.shortcuts import render, get_object_or_404

# Create your views here.
def mokugo(request, name):
	moku = get_object_or_404(mokugo, name=name)
	render(request, 'mokugo.html', { 'moku' : moku })
