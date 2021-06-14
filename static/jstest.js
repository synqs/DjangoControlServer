const Table = Vue.createApp({
	data() { return {
		data : 'blub',
		devices : null,
	}},
	compilerOptions: {
		delimiters: ['[[', ']]']
	},
	mounted () {
		// this.get_devices()
	},
	methods: {
		change_data() {
			this.data = 'blab'
		},
		get_devices() {
			axios.get('http://localhost:8000/pd_monitor/json.html')
		             .then(response => (this.data = response.data))
		             .catch(error => console.log(error))
		},
	}  
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
			<th></th>
			</tr>
		</thead>
		<tbody> 
			<tr>
			<td><a href="{% url 'pd_monitor:detail' 1 %}">{{ device.name }}</a></td>
			<td>0</td>
			<td>id</td>
			<td><button type="button" class="btn btn-light">Settings</button></td>
			</tr>
		</tbody>
	</table>`,
})

Table.mount('#info-table')
