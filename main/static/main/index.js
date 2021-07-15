const IndexTable = Vue.createApp({});

IndexTable.component('index-table', {
	data () { return {
		devices : null,
		}
	},
	template: `
	<h2>Device Index</h2>
	<hr class="rounded">
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
		this.get_devices();
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
	<td><a v-bind:href="'/' + device.model + '/' + device.pk" class="btn btn-primary">Details</a></td>
	<td><button class="btn btn-warning">Remove</button></td>
	</tr>
	`,
	methods: {
		remove() {
			config = {	method : 'DELETE',
					url : '/' + this.device.model + '/' + this.device.pk + '/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : this.device };
			axios(config)
				.then(response => console.log(response))
				.catch(error => console.log(error));
		},
		get_detail() {
			config = {	method : 'POST',
						url : '/' + this.device.model + '/' + this.device.pk + '/', //'/detail_direct/',
						xsrfCookieName: 'csrftoken',
						xsrfHeaderName: 'X-CSRFTOKEN',
						data : this.device };
			axios(config)
				.then(response => {
					console.log(response);
					console.log(response.request.res);})
				.then(error => console.log(error));
		},
	},
})

IndexTable.mount('#index')
