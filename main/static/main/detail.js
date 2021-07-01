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
		<td></td>
	</tr>
	`,
})

DetailTable.mount('#devicedetail')

/* PDDATA APPLICATION */

const PDData = Vue.createApp({})

PDData.component( 'pddata-table', {
	data () { return {
		datetime : new Date().toLocaleTimeString(),
		data : {"CH" : "0"},
		datas : {},
		}
	},
	props: ['device'],
	template: `
		<table class="table table-striped" responsive="True">
			<thead class="thead-dark">
				<tr>
				<th>Time</th>
				<th v-for="key in Object.keys(data)">{{ key }}</th>
				</tr>
			</thead>
			<tbody>
				<pddata-widget v-bind:data="data" :datetime="datetime"></pddata-widget>
			</tbody>
		</table>
		<button v-on:click="get_data()" class="btn btn-secondary">fetch</button>
		`,
	mounted() {
		setInterval(() => {
			this.get_data()
		}, 5000)
	},
	methods: {
		get_data() {
			const sortObject = obj => Object.keys(obj).sort().reduce((res, key) => (res[key] = obj[key], res), {});
			axios.get('/' + this.device.model + '/' + this.device.fields.name + '/data/')
		             .then(response => (this.data = sortObject(response.data.value)))
		             .catch(error => console.log(error));
			this.datetime = new Date().toLocaleTimeString();
		},
		get_xml(curl) {
			const xhr = new XMLHttpRequest();
			const url = 'http://' + this.device.fields.ip + curl;

			xhr.open('GET', url);
			// xhr.setRequestHeader('Access-Control-Request-Method', 'GET');
			// xhr.setRequestHeader('Content-Type', 'text/html');
			// xhr.onreadystatechange = someHandler;
			xhr.send();
		},
		get_axios() {
			// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
			// axios.defaults.xsrfCookieName = "csrftoken"
			const headers = {"X-CSRFTOKEN" : "VPP8z9DLX4E6F1YO96qBWb26SjZ7c2ayaLY88jLjLAUqy14EY2LKdSCFHgI47bD7"}
			axios.get('http://' + this.device.fields.ip + '/data/get', {headers:headers})
		             .then(response => (this.data = response.data))
		             .catch(error => console.log(error))
		},
	},
})

PDData.component( 'pddata-widget', {
	props : ['datetime','data'],
	template: `
		<tr>
		<td>{{ datetime }}</td>
		<td v-for="ch in data">{{ ch }}</td>
		</tr>
	`,
})

PDData.mount('#pddata')
