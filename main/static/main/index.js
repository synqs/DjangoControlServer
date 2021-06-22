const IndexTable = Vue.createApp({
	data() { return {
		pdmon_list : [{'name' : 'dummy_pdmon'},],
		tctrl_list : [{'name' : 'dummy_tctrl'},],
		device_list : [this.pdmon_list, this.tctrl_list],
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
	<button v-on:click="get_devices" type="button" class="btn btn-primary">GET ALL</button>
	[[ device_list ]]
	`,
	compilerOptions: {
		delimiters: ['[[', ']]']
	},
	updated () {
		this.get_devices()
	},
	methods: {
		get_pdmons() {
			axios.get('http://localhost:8000/pd_monitor/')
			     .then(response => (this.pdmon_list = response.data))
			     .catch(error => console.log(error))
		},		
		get_tctrls() {
			axios.get('http://localhost:8000/t_control/')
		             .then(response => (this.tctrl_list = response.data))
		             .catch(error => console.log(error))
		},
		get_devices() {
			//this.get_pdmons(); 
			//this.get_tctrls();
			
			const devs = [];
			devs.push(this.pdmon_list);
			devs.push(this.tctrl_list);
			this.device_list = devs;
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
