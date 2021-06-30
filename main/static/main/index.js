const IndexTable = Vue.createApp({
	/*
	data() { return {
		list : null,
		}
	},
	template: `
		<index-table v-bind:device_list="list"></index-table>
		<button v-on:click="get_devices" type="button" class="btn btn-primary">List</button>
	`,
	compilerOptions: {
		delimiters: ['[[', ']]']
	},
	mounted () {
		// this.get_devices()
	},
	methods: {		
		get_devices() {
			axios.get('http://localhost:8000/devices/')
		             .then(response => (this.list = response.data))
		             .catch(error => console.log(error))
		},
	},
	*/
});

IndexTable.component('index-table', {
	props: ['device_list'],
	template: `
	<h2>Device Index</h2>
	<hr class="rounded">
	<table class="table table-striped">
		<thead class="thead-dark">
			<tr>
			<th>Name</th>
			<th>IP</th>
			<th>Port</th>
			<th>Status</th>
			<th>Type</th>
			</tr>
		</thead>
		<tbody>
		<device-widget v-for="d in device_list" v-bind:device="d" :key="d.pk"></device-widget>
		</tbody>
	</table>
	`,
})

IndexTable.component('device-widget', {
	props: ['device'],
	template: `
	<tr>
	<td><a v-bind:href="'/' + device.model +'/' + device.fields.name">{{ device.fields.name }}</a></td>
	<td>{{ device.fields.ip }}</td>
	<td>{{ device.fields.port }}</td>
	<td>online</td>
	<td>{{ device.model }}</td>
	</tr>
	`,
})

IndexTable.mount('#deviceindex')
