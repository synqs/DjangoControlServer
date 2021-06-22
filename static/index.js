const IndexTable = Vue.createApp({
	data() { return {
		pdmon_list : null,
		tctrl_list : null,
		}
	},
	compilerOptions: {
		delimiters: ['[[', ']]']
	},
	mounted () {
		// this.get_pdmons()
	},
	methods: {
		get_pdmons() {
			axios.get('http://localhost:8000/pd_monitor/index/')
			     .then(response => (this.pdmon_list = response.data))
			     .catch(error => console.log(error))
		},
		get_pdmons_json() {
			axios.get('http://localhost:8000/pd_monitor/json/')
			     .then(response => (this.pdmon_list = response.data))
			     .catch(error => console.log(error))
		},		
		get_tcrls() {
			axios.get('http://localhost:8000/t_control/index/')
		             .then(response => (this.tcrtl_list = response.data))
		             .catch(error => console.log(error))
		}
	},  
});

IndexTable.component('device-header', {
	props: ['devices'],
	template:`
	<h2>Device Index</h2>
	<hr class="rounded">
	<table class="table table-striped">
		<thead class="thead-dark">
			<tr>
			<th>Name</th>
			<th>IP</th>
			<th>Port</th>
			<th>Status</th>
			<th></th>
			</tr>
		</thead>
		<tbody>
		<device-widget v-for="d in devices" v-bind:device="d" v-bind:key="d.id"></device-widget>
		</tbody>
	</table>
	`,
})

IndexTable.component('device-widget', {
	props: ['device'],
	template: 
	`<tr>
	<td><a v-bind:href="'/pd_monitor/' + device.id">{{ device.name }}</a></td>
	<td>{{ device.ip }}</td>
	<td>{{ device.port }}</td>
	<td>0</td>
	<td><button type="button" class="btn btn-light">Settings</button></td>
	</tr>`,
})

IndexTable.mount('#index-table')
