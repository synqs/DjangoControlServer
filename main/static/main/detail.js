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
	<h2>{{ device_detail.fields.name }} : {{ device_detail.fields.description }}</h2>
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
			<detail-widget v-bind:device="device_detail.fields" :key="device_detail.pk"></detail-widget>
		</tbody>
	</table>
	`,
})

DetailTable.component('detail-widget', {
	props: ['device'],
	template: `
	<tr>
		<td>{{ device.ip }}</td>
		<td>{{ device.port }}</td>
		<td>status</td>
		<td>{{ device.sleeptime }}</td>
		<td>pdmon_added_by</td>
		<td><button type="button" class="btn btn-light">Settings</button></td>
	</tr>
	`,
})

DetailTable.mount('#devicedetail')

const PDData = Vue.createApp({
	/*
	data () { return {
			appdevice : { 'name' : 'fake', ip : '129.206.182.149'},
			appdata : "appdata",
		}
	},
	template: `
		{{ appdevice }}
		{{ appdata }}
		<button v-on:click="get_data()">DATA</button>
	`,
	created () {
		// this.get_data()
	},
	methods: {
		get_data() {
			axios.get('http://' + this.appdevice.ip + '/data/get')
		             .then(response => (this.data = response.data))
		             .catch(error => console.log(error))
		},
	},
	*/
})

PDData.component( 'pddata-table', {
	data () { return {
		data : null,
		}
	},
	props: ['device'],
	template: `
		{{ device }}
		{{ data }}
		<table class="table table-striped">
			<thead class="thead-dark">
				<tr>
				<th>Time</th>
				<th cols=12>Input</th>
				</tr>
			</thead>
			<tbody>
				<!-- pddata-widget v-bind:values="data"></pddata-widget -->
			</tbody>
		</table>
		<button v-on:click="get_data()">DATA</button>
	`,
	methods: {
		get_data() {
			axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
			axios.get('http://' + this.device.fields.ip + '/data/get', {headers: {
                    "Content-Type": "application/json",
                    "Cookie": this.sessionid,
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token, Authorization, Accept,charset,boundary,Content-Length"
                }, })
		             .then(response => (this.data = response.data))
		             .catch(error => console.log(error))
		},
	},
})

PDData.component( 'pddata-widget', {
	props : ['values'],
	template: `
		{{ values }}
		<tr>
		<td v-for="v in values">{{ v }}</td>
		</tr>
	`,
})

PDData.mount('#pddata')
