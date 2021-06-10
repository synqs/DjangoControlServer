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
			</tr>
		</thead>
		<tbody> 
			<tr v-for="d in device">
			<td>{{ d.name }}</td>
			<td>0</td>
			<td>{{ d.ip }}</td>
			<td>{{ d.value }}</td>
			</tr>
		</tbody>
	</table>`,
})

Table.mount('#info-table')
