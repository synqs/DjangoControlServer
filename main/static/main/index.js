const IndexTable = Vue.createApp({
	data() { return {
		pdmon_list : [{"id": 1, "name": "nakayun1", "description": "fake", "sleeptime": 1.0, "ip": "1.1.1.1", "port": "11", "value": 1.0, "pdmon_added_by_id": 4},],
		tctrl_list : [{'name' : 'dummy'},],
		device_list : [{'name' : 'dummy'},],
		}
	},
	template: `
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
		<device-widget v-for="pdmon in pdmon_list" v-bind:device="pdmon" v-bind:key="pdmon.id"></device-widget>
		<device-widget v-for="tctrl in tctrl_list" v-bind:device="tctrl" v-bind:key="tctrl.id"></device-widget>
		</tbody>
	</table>
	<button v-on:click="get_pdmons" type="button" class="btn btn-primary">GET PDMONS</button>
	<button v-on:click="get_tctrls" type="button" class="btn btn-primary">GET TCTRL</button>
	{{ device_list }}
	`,
	compilerOptions: {
		delimiters: ['[[', ']]']
	},
	mounted () {
		// this.get_pdmons()
	},
	methods: {
		get_pdmons() {
			axios.get('http://localhost:8000/pd_monitor/')
			     .then(response => (this.pdmon_list = response.data))
			     .catch(error => console.log(error))
		},		
		get_tctrls() {
			axios.get('http://localhost:8000/t_control/')
		             .then(response => (this.tcrtl_list = response.data))
		             .catch(error => console.log(error))
		},
		get_devices() {
			const pdmons = axios.get('http://localhost:8000/pd_monitor/')
			const tctrls = axios.get('http://localhost:8000/t_control/')
			axios.all([pdmons, tctrls])
		             .then(axios.spread((...responses) => {
		             	this.device_list = responses[0].data
		             })
		             .catch(error => console.log(error))
		},
	},  
});

/*
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
*/

IndexTable.component('device-widget', {
	props: ['device'],
	template: 
	`<tr>
	<td>{{ device.name }}</td>
	<td>{{ device.ip }}</td>
	<td>{{ device.port }}</td>
	<td>0</td>
	<td><button type="button" class="btn btn-light">Settings</button></td>
	</tr>`,
})

IndexTable.mount('#index-table')
