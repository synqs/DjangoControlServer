const IndexTable = Vue.createApp({
	data() { return {
		pdmon_list : [{'name' : 'dummy_pdmon'},],
		tctrl_list : [{'name' : 'dummy_tctrl'},],
		device_list : null,
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
		<device-widget v-for="pdmon in pdmon_list" v-bind:device="pdmon" :type="'/pd_monitor/'" v-bind:key="pdmon.name"></device-widget>
		<device-widget v-for="c in tctrl_list" v-bind:device="c" :type="'/t_control/'" v-bind:key="c.name"></device-widget>
		</tbody>
	</table>
	<button v-on:click="get_devices" type="button" class="btn btn-primary">REFRESH</button>
	[[ device_list ]]
	`,
	compilerOptions: {
		delimiters: ['[[', ']]']
	},
	mounted () {
		this.get_devices()
	},
	updated () {
		// this.joinlist()
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
			this.get_pdmons(); 
			this.get_tctrls();
			const devs = this.pdmon_list.concat(this.tctrl_list);
			this.device_list = devs;
		}, 
	},  
});

IndexTable.component('device-widget', {
	props: ['device', 'type'],
	template: 
	`<tr>
	<td><a v-bind:href="'http://localhost:8000' + type + device.id">{{ device.name }}</a></td>
	<td>{{ device.ip }}</td>
	<td>{{ device.port }}</td>
	<td>0</td>
	<td><button type="button" class="btn btn-light">Settings</button></td>
	</tr>`,
})

IndexTable.mount('#index-table')
