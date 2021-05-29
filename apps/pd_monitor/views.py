from django.shortcuts import render

# Create your views here.
def index(request):
  devices = Device.objects.all()
  context = {'devices' : devices}
  return render(request, 'pd_monitor/index.html', context)
