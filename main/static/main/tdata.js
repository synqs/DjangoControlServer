const Tdata = Vue.createApp({
	data() { return {
		tarray : null,
		}
	},
	methods: {
		get_tdata() {
			path = device_data.ip + 'arduino/tctrl/read/all/'
			axios.get(path)
		             .then(response => (this.tarray = response.data))
		             .catch(error => console.log(error))
		},
	}
});

Tdata.component('tdata-header', {
	template: `
		<table class="table table-striped">
			<thead class="thead-dark">
				<tr>
				<th>Time</th>
				<th>Setpoint</th>
				<th>Input</th>
				<th>Error</th>
				<th>Output</th>
				<th>Gain</th>
				<th>tauI (s)</th>
				<th>tauD (s)</th>
				</tr>
			</thead>
			<tbody>
				<tdata-widget></tdata-widget>
			</tbody>
		</table>
	`,
})

Tdata.component('tdata-widget', {
	props: ['tcrtl'],
	template: `
		<tr>
		<td>{{ tctrl.timestamp }}</td>
  		<td>{{ tctrl.setpoint }}</td>
  		<td>{{ tctrl.value }}</td>
  		<td>{{ tctrl.error }}</td>
  		<td>{{ tctrl.output }}</td>
  		<td>{{ tctrl.gain }}</td>
  		<td>{{ tctrl.integral }}</td>
  		<td>{{ tctrl.diff }}</td>
		</tr>
	`,
})

Tdata.mount('#tdata-table')
