// document.write("Kill");

const DetailTable = Vue.createApp({
	data() { return {
		device : null
		}
	},
	compilerOptions: {
		delimiters: ['[[', ']]']
	},
	created () {
		// this.get_data()
	},
	methods: {
		get_device() {
		},
	}  
});

DetailTable.component('detail-table', {
	props: ['device'],
	template: `
	<h2>{{ device.name }} : {{ device.description }}</h2>
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
			<td>{{ device.status }}</td>
			<td>{{ device.sleeptime }}</td>
			<td>{{ device.added_by }}</td>
			<td><button type="button" class="btn btn-light">Settings</button></td>
		</tr>
		</tbody>
	</table>`,
})

DetailTable.mount('#detail-table')
