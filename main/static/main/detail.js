const DetailTable = Vue.createApp({})

DetailTable.component('detail-table', {
	props: ['device'],
	delimiters: ['[[', ']]'],
	template: `
	<p>BLUB</p>
	<table class="table table-striped">
		<thead class="thead-dark">
			<tr>
			<th colspan=5><h4>[[ device.fields.name ]] : [[ device.fields.description ]]</h4></th>
			</tr>
			<tr>
			<th>IP : [[ device.fields.ip ]]</th>
			<th>Port : [[ device.fields.port ]]</th>
			<th>Status : online</th>
			<th>Owner : nakalab</th>
			<th>
				<!-- button class="btn btn-primary">Settings</button>
				<form action="/remove/?device_type=device.model&device_name=device.fields.name" method="post">
				<button type="submit" class="btn btn-warning">Remove</button>
				</form -->
				<button class="btn btn-primary" v-on:click="remove_fetch()">remove fetch</button>
				<button class="btn btn-primary" v-on:click="remove_axios()">remove axios</button>
			</th>
			</tr>
		</thead>
	</table>
	`,
	methods: {
		remove_axios() {
			const url = '/remove/';
			const payload = { 	"device_type":this.device.model,
						"device_name":this.device.fields.name};
			axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
			axios.defaults.xsrfCookieName = "csrftoken";
			axios.post(url, payload)
			     .catch(error => console.log(error));
		},
		remove_fetch() {
			url = '/remove/';
			config = {	method : 'POST', 
					mode : 'cors', 
					credentials : 'include' };
			data = {	device_type : this.device.model, 								device_name : this.device.fields.name}; 
			fetch(url, config, data)
				//.then(response => this.data)
				.then(response => console.log(response))
				.catch(error => console.log(error))
		},
	},
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
		{{ data }}
		<!-- table class="table table-striped" responsive="True">
			<thead class="thead-dark">
				<tr>
				<th>Time</th>
				<th v-for="key in Object.keys(data)">{{ key }}</th>
				</tr>
			</thead>
			<tbody>
				<pddata-widget v-bind:data="data" :datetime="datetime"></pddata-widget>
			</tbody>
		</table -->
		<button class="btn btn-success" v-on:click="start_data()">start</button>
		<button class="btn btn-danger" v-on:click="stop_data()">stop</button>
		<button class="btn" v-on:click="fetch_data()">fetch</button>
		<!-- button class="btn" v-on:click="fetch_direct()">fetch direct</button>
		<button class="btn" v-on:click="get_xml()">xml direct</button>
		<button class="btn" v-on:click="get_axios()">axios direct</button -->
	`,
	mounted() {
		this.fetch_data()
	},
	methods: {
		sort_data(obj) { // used for sorting the CHxx values
			const sortObject = obj => Object.keys(obj).sort().reduce((res, key) => (res[key] = obj[key], res), {});
			return sortObject(obj)
		},
		start_data() { // start fetching data every dt = sleeptime
			this.timer = setInterval(()=>{this.fetch_data()}, 
					1000*this.device.fields.sleeptime);
		},
		stop_data() { // stop fetching data
			clearInterval(this.timer);
		},
		fetch_data() { // fetch a single set of data with python request
			url = '/' + this.device.model + '/' + this.device.fields.name + '/data/';
			config = {	method : 'GET', 
					mode : 'cors', }; 
			fetch(url, config)
				.then(response => response.json())
				.then(data => (this.data = this.sort_data(data.value)))
				.then(data => console.log(data))
				.catch(error => console.log(error))
		},
		/* all those methods do not work due to missing ACAO-header
		fetch_direct() { // fetch a single set of data directly from arduino (fetch)
			url = 'http://' + this.device.fields.ip + '/read/all/';
			config = {	method : 'GET', 
					mode : 'cors',
					credentials : 'include',
					headers : {'Content-Type': 'application/json'}
					}; 
			fetch(url, config)
				.then(response => console.log(response.json()))
				//.then(data => (this.data = data.value))
				.then(data => console.log(data))
				//.catch(error => console.log(error));
		},
		get_xml() { // fetch a single set of data directly from arduino (xml)
			const xhr = new XMLHttpRequest();
			const url = 'http://' + this.device.fields.ip + '/data/get';
			headers = {'Content-Type': 'application/json'};
				
			xhr.open('GET', url);
			xhr.send();
		},
		get_axios() { // fetch a single set of data directly from arduino (axios)
			axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
			axios.defaults.xsrfCookieName = "csrftoken"
			const headers = {"X-CSRFTOKEN" : "VPP8z9DLX4E6F1YO96qBWb26SjZ7c2ayaLY88jLjLAUqy14EY2LKdSCFHgI47bD7"}
			axios.get('http://' + this.device.fields.ip + '/data/get') //, {headers:headers})
		             .then(response => (this.data = response.data))
		             .catch(error => console.log(error))
		},
		*/
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

/* TCTRL APPLICATION */
/*
const TCData = Vue.createApp({})

TCData.component( 'tcdata-table', {
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
		/*
		get_xml(curl) {
			const xhr = new XMLHttpRequest();
			const url = 'http://' + this.device.fields.ip + curl;

			xhr.open('GET', url);
			xhr.setRequestHeader('Access-Control-Request-Method', 'GET');
			xhr.setRequestHeader('Content-Type', 'text/html');
			xhr.onreadystatechange = someHandler;
			xhr.send();
		},
		get_axios() {
			axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
			axios.defaults.xsrfCookieName = "csrftoken"
			const headers = {"X-CSRFTOKEN" : "VPP8z9DLX4E6F1YO96qBWb26SjZ7c2ayaLY88jLjLAUqy14EY2LKdSCFHgI47bD7"}
			axios.get('http://' + this.device.fields.ip + '/data/get', {headers:headers})
		             .then(response => (this.data = response.data))
		             .catch(error => console.log(error))
		},
	},
})

TCData.component( 'tcdata-widget', {
	props : ['datetime','data'],
	template: `
		<tr>
		<td>{{ datetime }}</td>
		<td v-for="ch in data">{{ ch }}</td>
		</tr>
	`,
})

TCData.mount('#tcdata')
*/
