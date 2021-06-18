const Table = Vue.createApp({
	data() { return {
		data : 'blub',
		device_list : 'blab',
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
			axios.get(http://localhost:8000/pd_monitor/jsondata/)
		             .then(response => (this.device_list = response.data))
		             .catch(error => console.log(error))
		},
	}  
});

Table.component(device-list, {
	props: [device],
	template: 
	`<table class=table table-striped>
		<thead class=thead-dark>
			<tr>
			<th>Name</th>
			<th>Status</th>
			<th>IP</th>
			<th></th>
			</tr>
		</thead>
		<tbody>
			<tr>
			<td>{{ device.name }}</td>
			<td>0</td>
			<td>{{ device.id }}</td>
			<td><button type=button class=btn btn-light>Settings</button></td>
			</tr>
		{% endfor %}
		</tbody>
	</table>`,
})

Table.mount(#info-table)
