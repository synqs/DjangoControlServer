const IndexTable = Vue.createApp({});

IndexTable.component('index-table', {
	props: ['devices'],
	template: `
	<table class="table table-striped">
		<thead class="thead-dark">
			<tr>
			<th>#</th>
			<th>Name</th>
			<th>IP</th>
			<th colspan=4>Status</th>
			</tr>
		</thead>
		<tbody>
		<device-widget v-for="d in devices" v-bind:device="d" :key="d.pk"></device-widget>
		</tbody>
	</table>
	`,
	mounted () {
		// this.get_devices(); currently, the index is load with django template tags
	},
	methods: {
		get_devices() {
			config = {	method : 'GET',
						url : '/devices/',
						xsrfCookieName: 'csrftoken',
						xsrfHeaderName: 'X-CSRFTOKEN', };
			axios(config)
				.then(response => {
					console.log(response);
					this.devices = response.data})
				.then(error => console.log(error));
		},
	},
})

IndexTable.component('device-widget', {
	props: ['device'],
	template: `
	<tr>
	<td>{{ device.model }} # {{ device.pk }}</td>
	<td><a v-bind:href="'/' + device.model + '/' + device.pk">{{ device.fields.name }}</a></td>
	<td>{{ device.fields.ip }}</td>
	<td>online</td>
	<td><button class="btn btn-primary" v-on:click="get_detail()">Details</button></td>
	<td><button class="btn btn-warning">Remove</button></td>
	</tr>
	`,
	methods: {
		remove_device() {
			config = {	method : 'POST',
					url : '/' + this.device.model + '/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : [this.device.pk, 'DELETE'] };
			axios(config)
				.then(response => console.log(response))
				.catch(error => console.log(error));
		},
		get_detail() {
			config = {	method : 'POST',
					url : '/' + this.device.model + '/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : [this.device.pk, 'DETAIL'] };
			axios(config)
				.then(response => {
					console.log(response); })
				.then(error => console.log(error));
		},
	},
})

IndexTable.mount('#index')
