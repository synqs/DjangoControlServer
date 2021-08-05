const IndexTable = Vue.createApp({});

IndexTable.component('index-table', {
	data ()  { return {
		status : [],
		config : [],
		addForm : {},
		}
	},
	props: ['devices'],
	template: `
	
	{{ status['global'] }}
	
	<div class="row mb-3 mx-auto" style="height: 30px;">
		<div class="col mh-100"><select class="h-100 w-100" v-model="this.addForm['model']" placeholder="model">
			<option>PDmon</option>
			<option>Tctrl</option>
		</select></div>
		<div class="col mh-100"><input v-model="this.addForm['name']" placeholder="name"></div>
		<div class="col mh-100"><input v-model="this.addForm['ip']" placeholder="IP"></div>
		<div class="col mh-100"><input v-model="this.addForm['sleeptime']" placeholder="sleeptime"></div>
		<div class="col mh-100"><button class="btn btn-block btn-info mh-100 py-1" v-on:click="add_device()">submit</button></div>
	</div>
	
	<table class="table table-striped">
		<thead class="thead-dark">
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
		add_device(arr) {
			console.log(this.addForm); console.log(typeof(this.addForm));
			config = this.config;
			config['data'][0] = 'ADD';
			config['data'][1] = this.addForm;
			console.log(config);
			axios(config)
				.then(response => {
					console.log(response.data);
					this.data = response.data; })
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
