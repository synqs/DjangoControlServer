const IndexTable = Vue.createApp({});

IndexTable.component('index-table', {
	data ()  { return {
		status : null,
		config : {	method : 'POST',
					url : '/device/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : [] },
		addForm : {},
		}
	},
	props: ['devices'],
	template: `
	
	<div v-if="this.status" class="alert alert-dismissible fade show" role="alert">
		{{ this.status }}
		<button class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
	</div>
	
	<div class="row mb-3">
		<div class="col"><select v-model="this.addForm['model']" class="form-select">
			<option>PDmon</option>
			<option>Tctrl</option>
		</select></div>
		<div class="col"><input v-model="this.addForm['name']" class="form-control" placeholder="name"></div>
		<div class="col"><input v-model="this.addForm['ip']" class="form-control" placeholder="IP"></div>
		<div class="col"><input v-model="this.addForm['sleeptime']" class="form-control" placeholder="sleeptime"></div>
		<div class="col"><button class="btn btn-info w-100" v-on:click="add_device()">submit</button></div>
	</div>
	
	<table class="table table-striped">
		<thead class="table-dark">
			<tr>
			<th>#</th>
			<th>Name</th>
			<th>IP</th>
			<th style="width: 250px; ">Status</th>
			<th colspan=2></th>
			</tr>
		</thead>
		<tbody>
			<device-widget v-for="device in devices" v-bind:device="device"></device-widget>
		</tbody>
	</table>
	`,
	methods: {
		add_device() {
			console.log(this.addForm); console.log(typeof(this.addForm));
			config = this.config;
			config['data'][0] = 'ADD';
			config['data'][1] = this.addForm;
			console.log(config);
			axios(config)
				.then(response => {
					console.log(response.data);
					this.status = response.data['message']; })
				.catch(error => console.log(error));
		},
	},
})

IndexTable.component('device-widget', {
	data ()  { return {
		status : 'Trying to connect...',
		config : [],
		}
	},
	props: ['device'],
	template: `
	<tr>
		<td>{{ this.device.model }} # {{ this.device.pk }}</td>
		<td><a v-bind:href="'/' + this.device.model + '/' + this.device.pk + '/'">{{ this.device.fields.name }}</a></td>
		<td>{{ this.device.fields.ip }}</td>
		<td>{{ this.status }}</td>
		<!-- td><button class="btn btn-outline-primary" v-on:click="init_device(device.model, device.pk)">Status</button></td -->
		<td><button class="btn btn-primary" v-on:click="detail_device()">Details</button></td>
		<td><button class="btn btn-warning" v-on:click="remove_device()">Remove</button></td>
	</tr>
	`,
	mounted () {
		this.init_device(this.device.model, this.device.pk);
	},
	methods: {
		init_device(model, pk) {
			payload = { 'model' : model, 'pk' : pk};
			config = {	method : 'POST',
					url : '/device/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : ['STATUS', payload] };
			this.config = config;
			axios(config)
				.then(response => { 
					this.status = response.data['message'];
				})
				.catch(error => console.log(error));
		},
		remove_device() {
			config = this.config;
			config['data'][0] = 'DELETE';
			console.log(config)
			axios(config)
				.then(response => {
					console.log(response);
					this.status = response.data['message'];
				})
				.catch(error => console.log(error));
		},
		detail_device() {
			//window.location.replace('/device/');
			
			config = this.config;
			config['data'][0] = 'DETAIL';
			axios(config)
				.then(response => {
					console.log(response); 
					//this.detail = response.data; 
					})
				.catch(error => console.log(error));
		},
	},
})

IndexTable.mount('#index')
