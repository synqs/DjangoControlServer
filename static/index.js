// document.getElementById("demo").innerHTML = "Hello JavaScript!";
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
			<th>IP</th>
			<th>Port</th>
			<th>Status</th>
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
	<td><a href="{% url 'pd_monitor:detail' device.id %}">{{ device.name }}</a></td>
	<td>{{ device.ip }}</td>
	<td>{{ device.port }}</td>
	<td>0</td>
	<td><button type="button" class="btn btn-light">Settings</button></td>
	</tr>`,
})

IndexTable.mount('#index-table')
