const DetailTable = Vue.createApp({})

DetailTable.component('detail-table', {
	props: ['device'],
	delimiters: ['[[', ']]'],
	template: `
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
			const url = '/' + this.device.model + '/' + this.device.fields.name + '/remove/';
			const payload = { this.device };
			axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
			axios.defaults.xsrfCookieName = "csrftoken";
			axios.get(url)
				.then(response => console.log(response))
				.catch(error => console.log(error));
		},
		remove_fetch() {
			const url = '/' + this.device.model + '/' + this.device.fields.name + '/remove/';
			config = {	method : 'POST', 
                        		mode : 'cors', 
					credentials : 'include', };
			const payload = this.device; 
			fetch(url, config, payload)
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
		data : [],
		datas : [],
		}
	},
	props: ['device'],
	template: `
	<button class="btn btn-success" v-on:click="start_data()">start</button>
	<button class="btn btn-danger" v-on:click="stop_data()">stop</button>
	<button class="btn" v-on:click="get_data()">get</button>
        {{ device.fields.channel_string }}
		<table class="table table-striped" responsive="True">
			<thead class="thead-dark">
				<tr>
				<th>Time</th>
				<th v-for="ch in get_channels()">{{ ch }}</th>
				</tr>
			</thead>
			<tbody>
				<pddata-widget v-for="data in datas" v-bind:data="data"></pddata-widget>
			</tbody>
		</table>
	`,
	mounted() {
		this.get_data()
	},
	methods: {
		get_channels() { // get an array of desired channels
			buff = this.device.fields.channel_string.split(',');
			channels = []; var i = 0;
			for (ch in buff) {
				channels[i] = "CH" + buff[i].padStart(2, 0);
				i++;
			};
			return channels;
		},
		set_channels() {
			
		sofi_data(obj) { // used for sorting and filtering the CHxx values
			const sort = obj => Object.keys(obj).sort().reduce((res, key) => (res[key] = obj[key], res), {});
			data = sort(obj)
			channels = this.get_channels();
			filtered = []; var i = 0;
			for (ch in data){ if (channels.includes(String(ch))) {
				filtered[i] = data[ch];
				i++;
			}};
			return filtered; 
		},
		start_data() { // start fetching data every dt = sleeptime
			this.timer = setInterval(()=>{this.get_data()}, 
					1000*this.device.fields.sleeptime);
		},
		stop_data() { // stop fetching data
			clearInterval(this.timer);
		},
		get_data() { // fetch a single set of data with python request
			var buff;
			const url = '/' + this.device.model + '/' + this.device.fields.name + '/data/';
			config = {  method : 'GET',
                        mode : 'cors', }; 
			fetch(url)
				.then(response => response.json())
				.then(data => this.sofi_data(data.value))
				.then(data => {
					this.data = data;
					this.datas.unshift(data); 
				})
				.catch(error => console.log(error));
			
			// can we use this as a quicker way to sort and filter ?
			//console.log(this.data.filter( function(item){
			//	return Objects.keys(item) in this.get_channels()
			//}));
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
	data () { return {
		datetime : new Date().toLocaleTimeString(),
		}
	},
	props : ['data'],
	template: `
		<tr>
		<td>{{ this.datetime }}</td>
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
