const PDdata = Vue.createApp({
	data() { return {
<<<<<<< HEAD:pd_monitor/static/pd_monitor/pddata.js
		pdarray : {0,0,0,0,0,0,0,0,0,0,0,0},
=======
		pdarray : null,
>>>>>>> unity:main/static/main/pddata.js
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
<<<<<<< HEAD:pd_monitor/static/pd_monitor/pddata.js
				<pddata-widget v-bind:values="pdarray"></pddata-widget>
=======
				<pddata-widget></pddata-widget>
>>>>>>> unity:main/static/main/pddata.js
			</tbody>
		</table>
		<button v-on:click="get_pddata">REFRESH</button>
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
