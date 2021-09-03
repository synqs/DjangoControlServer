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
		<div class="col"><input v-model="this.addForm['description']" class="form-control" placeholder="description"></div>
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
		<tbody><tr v-for="device in devices" :val="device.fields.name">
			<td><a v-bind:href="'/' + device.model + '/' + device.pk + '/'">[[ device.fields.name ]]</a></td>
			<td>[[ device.fields.description ]]</td>
			<td>[[ device.fields.ip ]]</td>
			<td>[[ this.status[device.fields.name] ]]</td>
			<td><button class="btn btn-warning" v-on:click="remove_device(device)">Remove</button></td>
			<td><div class="form-check form-switch text-center text-align-middle">
  				<input class="form-check-input" type="checkbox" v-on:click="this.overview_device(device)">
  			</div></td>
		</tr></tbody>
	</table>
	
	<div class="row">
		<div class="col-3" v-for="device in this.overview">
			<overview_card v-bind:device=device></overview_card>
		</div>
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
		overview_device(device) {
			var index = this.overview.indexOf(device);
			if (index !== -1) {
    				this.overview.splice(index, 1);
			}
			else {
				this.overview.push(device);
			}
		},
	},
});

IndexTable.component('overview_card', {
	data () { return {
		data : [],
		datas : [],
		status : 'Trying to connect...',
		key : [],
		config : [],
		editForm : {},
		}
	},
	props : ['device'],
	compilerOptions: {
		delimiters: ['[[', ']]'],
	},
	template: `
	<div class="card">
		<div class="card-header bg-primary text-light">
			[[ device.fields.name ]] : [[ device.fields.ip ]]
			<h6>[[ device.fields.description ]]</h6>
		</div>
    		<table class="table my-2" v-if="data.value">
				<tr class="bg-dark text-light"><th v-for="k in key.slice(1)">[[ k ]]</th></tr>
				<tr><td v-for="k in key.slice(1)">[[ data['value'][k] ]]</td></tr>
		</table>
  		<div class="btn-group w-100">
			<button class="btn btn-success" data-bs-toggle="button" autocomplete="off" v-on:click="start_device()">start</button>
			<button class="btn btn-danger" v-on:click="stop_device()">stop</button>
			<button class="btn btn-secondary" v-on:click="get_device()">get</button>
			<button class="btn btn-primary" onclick="exportTableToCSV('test.csv')">export as CSV</button>
		</div>
	</div>
	`,
	mounted () {
		this.init_device();
	},
	updated () { // export data every new day automatically
		if (this.data['value'] && this.data['value']['updated'].slice(11,18) == '14:26:0') {
			console.log("TIME");
			Date().toLocaleString(    [], {day: '2-digit', month: '2-digit', year: '4-digit'})
			const date = new Date();
			var day = date.getDay() + '_' + date.getMonth() + '_' + date.getFullYear();
			exportTableToCSV(day + '.csv')
			setTimeout(function() { console.log('WAIT'); }, 10000);
		}
	},
	methods: {
		init_device() { // initialize device and create config for further axios requests
			payload = { model : this.device.model, pk : this.device.pk };
			config = {	method : 'POST',
					url : '/device/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : ['STATUS', payload] };
			this.config = config;
			axios(config)
				.then(response => {
					this.data = response.data;
					this.status = response.data['message'];
					
					if ( response.data['keys'] ) {
						this.key = response.data['keys'];
					}
				})
				.catch(error => {
					this.status = error;
					console.log(error);
				});
		},
		start_device() { // start fetching data every dt = sleeptime
			this.timer = setInterval(()=>{this.get_device()}, 
					1000*this.device.fields.sleeptime);
		},
		stop_device() { // stop fetching data
			clearInterval(this.timer);
		},
		get_device() { // fetch a single set of data directly from arduino (axios)
			config = this.config;
			config['data'][0] = 'DATA';
			axios(config)
				.then(response => {
					this.data = response.data;
					this.datas.unshift(response.data);
					this.status = response.data['message'];
				})
				.catch(error => {
					this.status = error;
					console.log(error);
				});
		},
	},
});

/* At last, mount the index-app */
IndexTable.mount('#index');
