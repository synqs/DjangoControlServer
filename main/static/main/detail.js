/* In order to obtain the correct csrf-tokens the Django docs suggest this function. However, it is not needed ?! (https://docs.djangoproject.com/en/3.2/ref/csrf/) */
function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.substring(0, name.length + 1) === (name + '=')) { // Does this cookie string begin with the name we want?
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
};

const token = getCookie('csrftoken');
console.log(token);

/* This is the main app for the detail page - below follow tables for PDmons and Tctrls */
const DetailTable = Vue.createApp({})

DetailTable.component('detail-table', {
	data() { return {
		dev : [],
		}
	},
	props: ['device', 'model', 'pk'],
	template: `
	<div class="card mb-3">
			<div class="card-header text-light bg-dark"><div class="row">
				<h4 class="col">{{ device.fields.name }} : {{ device.fields.description }}</h4>
				<h4 class="col">IP : {{ device.fields.ip }}, Sleeptime : {{ device.fields.sleeptime }} s</h4>
			</div></div>
	</div>
	<data-widget v-bind:device="device"></data-widget>
	`,
	mounted () {
		// this.get_device()
	},
	methods : {
		get_device() { // fetch a single set of data directly from arduino (axios)
		config = {	method : 'POST',
				url : '/' + 'main.pdmon' + '/',
				xsrfCookieName: 'csrftoken',
				xsrfHeaderName: 'X-CSRFTOKEN',
				data : [this.pk, 'DETAIL'] };
		axios(config)
			.then(response => {
				console.log(response);
				this.dev = response.data; })
			.catch(error => console.log(error));
		},
	},
})

/* Widget to display data from device */
DetailTable.component( 'data-widget', {
	data () { return {
		data : [],
		datas : [],
		key : [],
		config : [],
		}
	},
	props: ['device'],
	template: `
	<div class="row mb-3">
		<div class="col-md-4">
			<!-- div class="alert alert-info" role="alert">{{ data['message'] }}</div -->
			<button class="btn btn-outline-info btn-block" disabled>{{ data['message'] }}</button>
		</div>
		<div class="col-md-8">
			<div class="btn-group w-100">
			<button class="btn btn-success" data-bs-toggle="button" autocomplete="off" v-on:click="start_device()">start</button>
			<button class="btn btn-danger" v-on:click="stop_device()">stop</button>
			<button class="btn btn-secondary" v-on:click="get_device()">get</button>
			<button class="btn btn-primary" onclick="exportTableToCSV('test.csv')">export as CSV</button>
			<button class="btn btn-warning" v-on:click="remove_device()">remove</button>
			</div>
		</div>
	</div>
	
	<v-container><v-layout column style="height: 90vh">
		<v-flex md6 style="overflow: auto">        <--- added overflow
      		<v-data-table class="elevation-1">
		<thead class="thead-dark">
			<tr>
				<th v-for="k in key">{{ k }}</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="data in datas">
				<td v-for="k in key">{{ data['value'][k] }}</td>
			</tr>
		</tbody>
      		</v-data-table>
    		</v-flex>
  	</v-layout><v-container>
  	
	<table class="table table-striped" responsive="True">
		<thead class="thead-dark">
			<tr>
				<th v-for="k in key">{{ k }}</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="data in datas">
				<td v-for="k in key">{{ data['value'][k] }}</td>
			</tr>
		</tbody>
	</table>
	`,
	mounted () {
		this.init_device();
	},
	updated () { // export data every new day automatically
		if (this.data['value'] && this.data['value']['updated'] == '00:00:00') {
			console.log('time');
			var day = '30/07/2021'
			exportTableToCSV(day + '.csv')
		}
	},
	methods: {
		convert_voltage(v) { // conversion formular to obtain preassure
			const p = 10**((v-7.75)/0.75) * 10000000;
			return p
		},
		init_device() { // initialize device and create config for further axios requests
			config = {	method : 'POST',
					url : '/device/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : [this.device.model, this.device.pk, 'STATUS'] };
			this.config = config;
			axios(config)
				.then(response => {
					this.key = response.data['keys'];
					this.data = response.data;
					});
		},
		start_device() { // start fetching data every dt = sleeptime
			this.timer = setInterval(()=>{this.get_device()}, 
					1000*this.device.fields.sleeptime);
		},
		stop_device() { // stop fetching data
			clearInterval(this.timer);
		},
		get_device() { // fetch a single set of data directly from arduino (axios)
			config = this.config;
			config['data'][2] = 'DATA';
			axios(config)
				.then(response => {
					this.data = response.data;
					this.datas.unshift(response.data); 
					})
				.catch(error => console.log(error));
		},
		edit_device(arr) {
			config = this.config;
			config['data'][2] = 'EDIT';
			axios(config)
				.then(response => {
					console.log(response.data);
					this.data = response.data; })
				.catch(error => console.log(error));
		},
		remove_device() {
			config = this.config;
			config['data'][2] = 'DELETE';
			axios(config)
				.then(response => {
					console.log(response);
					this.data = response.data;
					})
				.catch(error => console.log(error));
		},
		/* this method does not work due to missing ACAO-header
		get_data_direct() { // fetch a single set of data directly from arduino (axios)
			config = {  	method : 'GET',
					url : 'http://' + this.device.fields.ip + '/data/get',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					proxy : { host: 'proxy.kip.uni-heidelberg.de', port : 8080 },
					headers: {	'Access-Control-Allow-Origin' : '*',
							'Content-Type' : 'application/json',
							'crossdomain' : 'true'}, 
							data : this.device };
			axios(config)
				.then(response => console.log(response)
				.catch(error => console.log(error))
		}, */
	},
})

/* At last, mount the detail-app */
DetailTable.mount('#devicedetail');

function downloadCSV(csv, filename) {
	var csvFile;
	var downloadLink;
	csvFile = new Blob([csv], {type: "text/csv"}); // CSV file

	downloadLink = document.createElement("a"); // Download link
	downloadLink.download = filename; // File name
	downloadLink.href = window.URL.createObjectURL(csvFile); // Create a link to the file
	downloadLink.style.display = "none"; // Hide download link

	document.body.appendChild(downloadLink); // Add the link to DOM

	downloadLink.click(); // Click download link
}

function exportTableToCSV(filename) {
	var csv = [];
	var rows = document.querySelectorAll("table tr");

	for (var i = 0; i < rows.length; i++) {
		var row = [], cols = rows[i].querySelectorAll("td, th");

		for (var j = 0; j < cols.length; j++) {
			row.push(cols[j].innerText);
		}
		csv.push(row.join(","));
	}
	downloadCSV(csv.join("\n"), filename); // Download CSV file
}
