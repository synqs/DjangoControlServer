const PDdata = Vue.createApp({
	data() { return {
		pdarray : null,
		}
	},
	template: `
		<table class="table table-striped">
			<thead class="thead-dark">
				<tr>
				<th>Time</th>
				<th cols=12>Input</th>
				</tr>
			</thead>
			<tbody>
				<pddata-widget></pddata-widget>
			</tbody>
		</table>
	`,
	methods: {
		get_pddata() {
			path = device_data.ip + '/arduino/pdmon/read/all/'
			axios.get(path)
		             .then(response => (this.pdarray = response.data))
		             .catch(error => console.log(error))
		},
	}
});

PDdata.component('pddata-widget', {
	props: ['values'],
	template: `
		<tr>
		<td v-for="v in values">{{ v }}</td>
		</tr>
	`,
})

PDdata.mount('#pddata-table')
