const DetailTable = Vue.createApp({
	/*
	data() { return {
		meta : null,
		device : null,
		}
	},
	compilerOptions: {
		delimiters: ['[[', ']]']
	},
	created () {
		// this.get_data()
	},
	methods: {
		get_device(device_id) {
			axios.get('http://localhost:8000/pd_monitor/' + device_id)
		             .then(response => (this.device = response.data))
		             .catch(error => console.log(error))
		},
	}
	*/  
});

DetailTable.component('detail-table', {
	props: ['device_detail'],
	template: `
	<h2>{{ device_detail.name }} : {{ device_detail.description }}</h2>
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
			<detail-widget v-bind:device="device_detail"></detail-widget>
		</tbody>
	</table>
	`,
})

DetailTable.component('detail-widget', {
	props: ['device'],
	template: `
	<tr>
		<td>device.ip</td>
		<td>device.port</td>
		<td>status</td>
		<td>sleeptime</td>
		<td>pdmon_added_by</td>
		<td><button type="button" class="btn btn-light">Settings</button></td>
	</tr>
	`,
})

DetailTable.mount('#devicedetail')
