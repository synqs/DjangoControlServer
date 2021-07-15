const IndexTable = Vue.createApp({});

IndexTable.component('index-table', {
	data () { return {
		list : null,
		}
	},
	props: ['device_list'],
	template: `
	<h2>Device Index</h2>
	<hr class="rounded">
	<table class="table table-striped">
		<thead class="thead-dark">
			<tr>
			<th>#</th>
			<th>Name</th>
			<th>IP</th>
			<th colspan=3>Status</th>
			</tr>
		</thead>
		<tbody>
		<device-widget v-for="d in device_list" v-bind:device="d" :key="d.pk"></device-widget>
		{{ list }}
		</tbody>
	</table>
	`,
	methods: {
		get_devices() {
			config = {  	method : 'GET',
					url : '/devices/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN', };
			axios(config)
				.then(response => { 
					console.log(response);
					this.list = response.data; });
				.then(error => console.log(error));
		},
	},
})

IndexTable.component('device-widget', {
	props: ['device'],
	template: `
	<tr>
	<td>{{ device.model }} # {{ device.pk }}</td>
	<td><a v-bind:href="'/' + device.model + '/' + device.fields.name">{{ device.fields.name }}</a></td>
	<td>{{ device.fields.ip }}</td>
	<td>online</td>
	<td><button v-on:click="get_detail()" class="btn btn-primary">Details</button></td>
	<td><button class="btn btn-warning">Remove</button></td>
	</tr>
	`,
	methods: {
		get_detail() {
			config = {  	method : 'POST',
					url : '/detail_direct/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : this.device };
			axios(config)
		},
	},
})

IndexTable.mount('#deviceindex')
