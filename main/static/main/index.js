const IndexTable = Vue.createApp({});

IndexTable.component('index-table', {
	data ()  { return {
		status : 'Trying to connect...',
		config : [],
		addForm : {},
		}
	},
	props: ['devices'],
	template: `
	<div class="row mb-3 mx-auto" style="height: 30px;">
		<div class="col mh-100"><select class="h-100 w-100" v-model="this.addForm.model">
			<option disabled>model</option>
			<option>PDmon</option>
			<option>Tctrl</option>
		</select></div>
		<div class="col mh-100"><input v-model="this.addForm['name']" placeholder="name"></div>
		<div class="col mh-100"><input v-model="this.addForm['ip']" placeholder="IP"></div>
		<div class="col mh-100"><input v-model="this.addForm['sleeptime']" placeholder="sleeptime"></div>
		<div class="col mh-100"><button class="btn btn-block btn-info mh-100 py-1" v-on:click="add_device()">submit</button></div>
	</div>
	
	{{ this.addForm.name }}
	
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
		<tbody><tr v-for="device in devices">
			{{ this.init_device(device.model, device.pk) }}
			<td>{{ device.model }} # {{ device.pk }}</td>
			<td><a v-bind:href="'/' + device.model + '/' + device.pk + '/'">{{ device.fields.name }}</a></td>
			<td>{{ device.fields.ip }}</td>
			<td>{{ status }}</td>
			<!-- td><button class="btn btn-outline-primary" v-on:click="init_device(device.model, device.pk)">Status</button></td -->
			<td><button class="btn btn-primary" v-on:click=this.detail_device()>Details</button></td>
			<td><button class="btn btn-warning">Remove</button></td>
		</tr></tbody>
	</table>
	`,
	mounted () {
		// this.get_devices(); currently, the index is load with django template tags
	},
	methods: {
		init_device(model, pk) {
			payload = {'model' : model, 'pk' : pk}
			config = {	method : 'POST',
					url : '/device/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : ['STATUS', payload] };
			this.config = config;
			var sstatus = {};
			axios(config)
				.then(response => { 
					this.status = response.data['message'];
				})
				.catch(error => console.log(error));
		},
		add_device(arr) {
			console.log(this.addForm); console.log(typeof(this.addForm));
			let list = this.addForm;
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
		remove_device() {
			config = this.config;
			config['data'][0] = 'DELETE';
			axios(config)
				.then(response => console.log(response))
				.catch(error => console.log(error));
		},
	},
})

IndexTable.mount('#index')