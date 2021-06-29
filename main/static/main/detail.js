const DetailTable = Vue.createApp({})

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
		<td>online</td>
		<td>{{ device.sleeptime }}</td>
		<td>nakalab</td>
		<td><button type="button" class="btn btn-light">Settings</button></td>
	</tr>
	`,
})

DetailTable.mount('#devicedetail')

/* PDDATA APPLICATION */

const PDData = Vue.createApp({})

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
			axios.get('http://' + this.device.fields.ip + '/data/get', {headers: {
                    "Content-Type": "application/json",
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