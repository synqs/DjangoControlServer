const IndexTable = Vue.createApp({});

IndexTable.component('index-table', {
	data ()  { return {
		status : 'Trying to connect...',
		config : [],
		addForm : [],
		}
	},
	props: ['devices'],
	template: `
	<div class="row mb-3 align-items-center mx-auto" style="height: 40px;">
		<div class="col"><select class="form-select form-select-lg w-100" style="height : 30px;">
			<option selected>model</option>
			<option>PDmon</option>
			<option>Tctrl</option>
		</select></div>
		<div class="col"><input v-model="this.addForm.name" placeholder="name"></div>
		<div class="col"><input type="text" v-model="this.addForm.ip" placeholder="IP"></div>
		<div class="col"><input type="text" v-model="this.addForm.sleeptime" placeholder="sleeptime"></div>
		<div class="col"><button class="btn btn-info" v-on:click="add_device()">submit</button></div>
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
		<tbody><tr v-for="device in devices">
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
			config = {	method : 'POST',
					url : '/device/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : [model, pk, 'STATUS'] };
			this.config = config;
			var sstatus = {};
			axios(config)
				.then(response => { 
					this.status = response.data['message'];
				})
				.catch(error => console.log(error));
		},
		add_device(arr) {
			config = this.config;
			config['data'][2] = 'ADD';
			config['data'][3] = this.addForm;
			axios(config)
				.then(response => {
					console.log(response.data);
					this.data = response.data; })
				.catch(error => console.log(error));
		},
		remove_device() {
			config = this.config;
			config['data'][2] = 'DELETE';
			axios(config)
				.then(response => console.log(response))
				.catch(error => console.log(error));
		},
	},
})

IndexTable.mount('#index')