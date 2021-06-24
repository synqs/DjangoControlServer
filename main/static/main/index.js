const IndexTable = Vue.createApp({
	data() { return {
		device_list : null,
		}
	},
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
			<th></th>
			</tr>
		</thead>
		<tbody>
		<device-widget v-for="d in device_list" v-bind:device="d.fields" :meta="d.model"></device-widget>
		</tbody>
	</table>
	<button v-on:click="get_devices" type="button" class="btn btn-primary">REFRESH</button>
	[[ device_list ]]
	`,
	compilerOptions: {
		delimiters: ['[[', ']]']
	},
	mounted () {
		this.get_devices()
	},
	methods: {		
		get_devices() {
			axios.get('http://localhost:8000/devices/')
		             .then(response => (this.device_list = response.data))
		             .catch(error => console.log(error))
		},
	},  
});

IndexTable.component('device-widget', {
	props: ['meta','device'],
	template: 
	`<tr>
	<td>{{ device.name }}</td>
	<td>{{ device.ip }}</td>
	<td>{{ device.port }}</td>
	<td>{{ meta }}</td>
	<td v-if="meta == 'main.pdmon'">blub</td>
	</tr>`,
})

IndexTable.mount('#index-table')
