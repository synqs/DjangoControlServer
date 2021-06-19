document.getElementById("demo").innerHTML = "Hello JavaScript!";
document.write("Kill");

const IndexTable = Vue.createApp({
	data() { return {
		data : 'blub',
		device_list : [{ id: 43, name: 'nakafake', description: 'just a faker', sleeptime: '5.0', ip: '0.0.0.0.34.42', port: '2',value: '1.0', added_by_id: 'me'},
			{ id: 5, name: 'nakafake2', description: 'just a faker2', sleeptime: '5.2', ip: '0.0.0.0.2', port: '22',value: '1.2', added_by_id: 'me too'},]
		}
	},
	compilerOptions: {
		delimiters: ['[[', ']]']
	},
	created () {
		// this.get_devices()
	},
	methods: {
		change_data() {
			this.data = blab
		},
		get_devices() {
			axios.get('http://localhost:8000/pd_monitor/jsondata/')
		             .then(response => (this.device_list = response.data))
		             .catch(error => console.log(error))
		},
	}  
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
			<th>Status</th>
			<th>IP</th>
			<th></th>
			</tr>
		</thead>
		<tbody>
		<device-widget v-for="d in devices" v-bind:device="d" v-bind:key="d.id"></device-widget>
		</tbody>
	</table>`,
})

IndexTable.component('device-widget', {
	props: ['device'],
	template: 
	`<tr>
	<td>{{ device.name }}</td>
	<td>0</td>
	<td>{{ device.id }}</td>
	<td><button type="button" class="btn btn-light">Settings</button></td>
	</tr>`,
})

IndexTable.mount('#index-table')
