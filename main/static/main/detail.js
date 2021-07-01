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
		data : {ch0 : "read", ch1 : "1", ch2 : "2", ch3 : "3", 
			ch4 : "4", ch5 : "5", ch6 : "6", ch7 : "7",
			ch8 : "8", ch9 : "9", ch10 : "10", ch11 : "11",},
		}
	},
	props: ['device'],
	template: `
		{{ data }}
		<table class="table table-striped" responsive="True">
			<thead class="thead-dark">
				<tr>
				<th>Time</th>
				<th colspan="12">Input</th>
				</tr>
			</thead>
			<tbody>
				<pddata-widget v-bind:values="data"></pddata-widget>
			</tbody>
		</table>
		<button v-on:click="get_data()" class="btn btn-secondary">DATA</button>
	`,
	methods: {
		get_data() {
			axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
			axios.defaults.headers.common["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS, DELETE, PUT";
			axios.defaults.headers.common["Access-Control-Allow-Headers"] = "append,delete,entries,foreach,get,has,keys,set,values,Authorization";
			axios.post('http://' + this.device.fields.ip + '/read')
		             .then(response => (this.data = response.data))
		             .catch(error => console.log(error))
		},
	},
})

PDData.component( 'pddata-widget', {
	data() { return {
		time : new Date().toLocaleString()
		}
	},
	props : ['values'],
	template: `
		<tr>
		<td>{{ time }}</td>
		<td v-for="v in values">{{ v }}</td>
		</tr>
	`,
})

PDData.mount('#pddata')
