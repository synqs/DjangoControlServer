const IndexTable = Vue.createApp({
	data() { return {
		device_list : null
		}
	},
	compilerOptions: {
		delimiters: ['[[', ']]']
	},
	mounted () {
		this.get_devices()
	},
	methods: {
		get_devices() {
			axios.get('http://localhost:8000/pd_monitor/jsondata/')
		             .then(response => (this.device_list = response.data))
		             .catch(error => console.log(error))
		},
	},  
});

IndexTable.component('device-table', {
	props: ['devices'],
	template:`
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
		<device-widget v-for="d in devices" v-bind:device="d" v-bind:key="d.id"></device-widget>
		</tbody>
	</table>
	`,
})

IndexTable.component('device-widget', {
	props: ['device'],
	data() {
        	return {
            		url: 'https://ecosia.org'
        	}
    	},
	template: 
	`<tr>
	<td><a v-bind:href="'/pd_monitor/' + device.id">{{ device.name }}</a></td>
	<td>{{ device.ip }}</td>
	<td>{{ device.port }}</td>
	<td>0</td>
	<td><button type="button" class="btn btn-light">Settings</button></td>
	</tr>`,
})

IndexTable.mount('#index-table')
