document.getElementById("jstest").innerHTML = "JavaScript is imported in detail!";

document.getElementById("demo").innerHTML = "Hello JavaScript!";
document.write("Kill");

const DetailTable = Vue.createApp({
	data() { return {
		device : { id: 43, name: 'nakafake', description: 'just a faker', sleeptime: '5.0', ip: '0.0.0.0.34.42', port: '2',value: '1.0', added_by_id: 'me'},
		}
	},
	compilerOptions: {
		delimiters: ['[[', ']]']
	},
	created () {
		// this.get_devices()
	},
	methods: {
		get data() {
			axios.get('http://localhost:8000/pd_monitor/jsondata/')
		             .then(response => (this.device_list = response.data))
		             .catch(error => console.log(error))
		},
	}  
});

DetailTable.component('detail-table', {
	props: ['device'],
	template: `
	<h2>{{ device.name }} : {{ device:description }}</h2>
	<hr class="rounded">
	<table class="table table-striped">
		<thead class="thead-dark">
			<tr>
			<th>IP</th>
			<th>Port</th>
			<th>Status</th>
			<th>Sleeptime</th>
			<th>Owner</th>
			<th></th>
			</tr>
		</thead>
		<tbody>
		<tr>
			<td>{{ device.ip }}</td>
			<td>{{ device.port }}</td>
			<td>{{ device.status</td>
			<td>{{ device.sleeptime }}</td>
			<td>{{ device.added_by }}</td>
			<td><button type="button" class="btn btn-light">Settings</button></td>
		</tr
		</tbody>
	</table>`,
})

DetailTable.component('device-widget', {
	props: ['device'],
	template: 
	`<tr>
	<td>{{ device.name }}</td>
	<td>0</td>
	<td>{{ device.id }}</td>
	<td><button type="button" class="btn btn-light">Settings</button></td>
	</tr>`,
})
DetailTable.mount('#info-table')
