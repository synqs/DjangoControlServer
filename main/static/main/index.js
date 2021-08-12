const IndexTable = Vue.createApp({});

IndexTable.component('index-table', {
	data ()  { return {
		status : { global : "Connecting to devices..." },
		config : {},
		addForm : {},
		overview : [],
		}
	},
	compilerOptions: {
		delimiters: ['[[', ']]'],
	},
	props: ['devices'],
	template: `
	
	<div class="alert alert-info alert-dismissible fade show" role="alert">
		[[ this.status['global'] ]]
		<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
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
			<th>Name</th>
			<th>Description</th>
			<th>IP</th>
			<th style="width: 250px; ">Status</th>
			<th colspan=2></th>
			</tr>
		</thead>
		<tbody><tr v-for="device in devices">
			<td><a v-bind:href="'/' + device.model + '/' + device.pk + '/'">[[ device.fields.name ]]</a></td>
			<td>[[ device.fields.description ]]</td>
			<td>[[ device.fields.ip ]]</td>
			<td>[[ this.status[device.fields.name] ]]</td>
			<td><button class="btn btn-warning" v-on:click="remove_device(device)">Remove</button></td>
			<td><div class="form-check form-switch text-center text-align-middle">
  				<input class="form-check-input" type="checkbox" data-bind="value: device.fields.name" v-model="this.overview">
  			</div></td>
		</tr>
			<!-- device-widget v-for="device in devices" v-bind:device="device"></device-widget -->
		</tbody>
	</table>
	[[ this.overview ]]

	<div class="row">
		<div class="col" v-for="device in this.overview">[[ device ]]</div>
	</div>
	`,
	mounted () {
		this.init_index();
	},
	methods: {
		init_index() {
			for (dev in this.devices) {
				this.init_device(this.devices[dev]);
			};
		},
		add_device() {
			console.log(this.addForm); console.log(typeof(this.addForm));
			config = this.config;
			config['data'][0] = 'ADD';
			config['data'][1] = this.addForm;
			console.log(config);
			axios(config)
				.then(response => {
					//console.log(response.data);
					this.status['global'] = response.data['message']; })
				.catch(error => {
					this.status['global'] = error;
					console.log(error);
				});
		},
		init_device(device) {
			payload = { 'model' : device['model'], 'pk' : device['pk'] };
			config = {	method : 'POST',
					url : '/device/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : ['STATUS', payload] };
			this.config = config;
			axios(config)
				.then(response => { 
					this.status[device['fields']['name']] = response.data['message'];
					this.status['global'] = "All devices ready!";
				})
				.catch(error => {
					this.status[device['fields']['name']] = error;
					this.status['global'] = "There was an error...";
					console.log(error);
				});
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
				.catch(error => {
					this.status['global'] = error;
					console.log(error);
				});
		},
		/* currently not in use
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
		}, */
		overview_device() {
		},
	},
});

/* At last, mount the index-app */
IndexTable.mount('#index');
