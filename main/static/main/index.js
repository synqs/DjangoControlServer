const IndexTable = Vue.createApp({});

IndexTable.component('index-table', {
	data ()  { return {
		status : {},
		config : {	method : 'POST',
				url : '/device/',
				xsrfCookieName: 'csrftoken',
				xsrfHeaderName: 'X-CSRFTOKEN',
				data : [] },
		addForm : {},
		}
	},
	compilerOptions: {
		delimiters: ['[[', ']]'],
	},
	props: ['devices'],
	template: `
	
	<!-- div v-if="this.status" class="alert alert-dismissible fade show" role="alert">
		[[ this.status ]]
		<button class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
	</div -->
	
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
		<tbody><tr v-for="device in devices">
			<td>[[ device.model ]] # [[ device.pk ]]</td>
			<td><a v-bind:href="'/' + device.model + '/' + device.pk + '/'">[[ device.fields.name ]]</a></td>
			<td>[[ device.fields.ip ]]</td>
			<td>[[ this.status[device.fields.name] ]]</td>
			<td><button class="btn btn-warning" v-on:click="remove_device(dev)">Remove</button></td>
		</tr>
			<!-- device-widget v-for="device in devices" v-bind:device="device"></device-widget -->
		</tbody>
	</table>
	
	[[ this.status ]]
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
					console.log(response.data);
					this.status = response.data['message']; })
				.catch(error => console.log(error));
		},
		init_device(device) {
			console.log(device);
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
})
