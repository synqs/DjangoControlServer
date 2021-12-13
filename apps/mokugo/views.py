from django.views.generic import DetailView, View
from django.views.generic.edit import CreateView, DeleteView, UpdateView
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404
from django.core import serializers

from .models import mokugo

import json
from pathlib import Path
from moku.instruments import ArbitraryWaveformGenerator

# Create your views here.
class MokugoDetailView(DetailView):
	model = mokugo
	slug_url_kwarg = 'mokugo_name'
	slug_field = 'name'
	template_name = 'mokugo/mokugo.html'

	def get_context_data(self, **kwargs):
		Mokugo = super().get_object()
		context = {}
		context['mokugo'] = json.loads(serializers.serialize('json', [Mokugo]))[0]['fields']
		context['mokugo']['model'] = 'mokugo'
		return context
	
class MokugoDataView(DetailView):
	model = mokugo
	slug_url_kwarg = 'mokugo_name'
	slug_field = 'name'
	template_name = 'mokugo/mokugo.html'

	def get_context_data(self, **kwargs):
		response = { 'value' : ''}
		Mokugo = super().get_object()
		print(self.object)
		print(Mokugo)

		try:
			i = AbritrarySignalGenerator(Mokugo['ip'], force_connect=True)
		except Exception as e:
			response['message'] = str(e)
		else:
			offset = np.round(i.read_power_supply(1)['set_voltage'],3)
			response['message'] = 'Data available.'
			response['value']['offset'] = str(offset)

			full_path = Path(Path.home().as_posix()+'/Dropbox (CoQuMa)/LabNotes/NaKa/'+timestamp[:7]+'/'+timestamp[:10]+'/data')
			try :
				full_path.mkdir(parents=True, exist_ok=True)
			except FileExistsError :
				print('already exists!')
				full_path = Path(Path.cwd().as_posix()+'/data')
			with open(str(full_path)+'\\'+kwargs['laser_name']+'_'+timestamp[:10]+'.csv', 'a', newline='', encoding='UTF8') as f:
				writer = csv.writer(f)
				writer.writerow([value for key, value in response['value'].items()])
				f.close()

		return HttpResponse(json.dumps(response))
