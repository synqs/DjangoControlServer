const Table = Vue.createApp({
	data() { return {
		devices: [
			{ id: '0', name: 'device0', ip: '0', value: '0'},
			{ id: '1', name: 'device1', ip: '0', value: '0'},
			{ id: '2', name: 'device2', ip: '0', value: '0'},
		]
	}},
	/*compilerOptions: {
		delimiters: ['[[', ']]'],
	}*/
});

Table.component('device-list', {
	props: ['device'],
	template: 
	`<table class="table table-striped">
		<thead class="thead-dark">
			<tr>
			<th>Name</th>
			<th>Status</th>
			<th>IP</th>
			<th>Current Value</th>
			<th></th>
			</tr>
		</thead>
		<tbody> 
			<tr v-for="d in device">
			<td><a href="{% url 'pd_monitor:detail' device.id %}">{{ d.name }}</a></td>
			<td>0</td>
			<td>{{ d.ip }}</td>
			<td>{{ d.value }}</td>
			<td><button type="button" class="btn btn-light">Settings</button></td>
			</tr>
		</tbody>
	</table>`,
})

Table.mount('#info-table')
