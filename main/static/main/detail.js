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
				<button class="btn btn-warning" v-on:click="remove()">remove</button>
			</th>
			</tr>
		</thead>
	</table>
	`,
	methods: {
		remove() {
			config = {	method : 'DELETE',
					url : '/pdmon/' + this.device.pk,
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : this.device };
			axios(config)
				.then(response => console.log(response))
				.catch(error => console.log(error));
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
	<button class="btn btn-success" data-bs-toggle="button" autocomplete="off" v-on:click="start_data()">start</button>
	<button class="btn btn-danger" v-on:click="stop_data()">stop</button>
	<button class="btn btn-secondary" v-on:click="get_data()">get</button>
	<button class="btn btn-secondary" v-on:click="get_head()">head</button>
	<button class="btn btn-outline-secondary" v-on:click="get_data_direct()">get direct</button>
	<table class="table table-striped" responsive="True">
		<thead class="thead-dark">
			<tr>
			<th>Time</th>
			<th v-for="ch in data['channels']">{{ ch }}</th>
			</tr>
		</thead>
		<tbody>
			<pddata-widget v-for="data in datas" v-bind:data="data"></pddata-widget>
		</tbody>
	</table>
	`,
	mounted () {
		this.get_data()
	},
	methods: {
		sofi_data(obj) { // used for sorting and filtering the CHxx values
			const sort = obj => Object.keys(obj).sort().reduce((res, key) => (res[key] = obj[key], res), {});
			data = sort(obj['value'])
			channels = obj['channels']
			filtered = []; var i = 1;
			filtered[0] = data['updated'];
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
		get_data() { // fetch a single set of data directly from arduino (axios)
			config = {  	method : 'GET',
					url : '/pdmon/' + this.device.fields.name,
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : this.device };
			axios(config)
				//.then(response => console.log(response))
				.then(response => {
					console.log(response);
					this.data = response.data;
					const sofi_data = this.sofi_data(response.data); // is there a quicker way to sort and filter ?
					this.data['value'] = sofi_data;
					this.datas.unshift(sofi_data);
					})
				.catch(error => console.log(error));
		},
		set_channels(arr) {
			config = {  method : 'POST',
						url : '/channels/',
						xsrfCookieName: 'csrftoken',
						xsrfHeaderName: 'X-CSRFTOKEN',
						data : this.device };
			axios(config)
				.then(response => {
					console.log(response.data);})
				.catch(error => console.log(error))
		},
		get_head() { // fetch a single set of data directly from arduino (axios)
			config = {  	method : 'HEAD',
					url : '/pdmon/' + this.device.pk,
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : this.device };
			axios(config)
				.then(response => {console.log(response)})
				.catch(error => console.log(error));
		},
		/* this method does not work due to missing ACAO-header */
		get_data_direct() { // fetch a single set of data directly from arduino (axios)
			config = {  method : 'GET',
						url : 'http://' + this.device.fields.ip + '/data/get',
						xsrfCookieName: 'csrftoken',
						xsrfHeaderName: 'X-CSRFTOKEN',
						proxy : { host: 'proxy.kip.uni-heidelberg.de', port : 8080 },
						headers: { 	'Access-Control-Allow-Origin' : '*',
									'Content-Type' : 'application/json',
									'crossdomain' : 'true'}, 
						data : this.device };
			axios(config)
				.then(response => {
					console.log(response.data['value']);
					const sofi_data = this.sofi_data(response.data['value']); // is there a quicker way to sort and filter ?
					this.data = sofi_data;
					this.datas.unshift(sofi_data); 
					})
				.catch(error => console.log(error))
		},
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
		<!-- td>{{ this.datetime }}</td -->
		<td v-for="ch in data">{{ ch }}</td>
		</tr>
	`,
})

PDData.mount('#pddata')

/* TCTRL APPLICATION */

const TCData = Vue.createApp({})

TCData.component( 'tcdata-table', {
	data () { return {
		data : [],
		datas : [],
		}
	},
	props: ['device'],
	template: `
	<button class="btn btn-success" data-bs-toggle="button" autocomplete="off" v-on:click="start_data()">start</button>
	<button class="btn btn-danger" v-on:click="stop_data()">stop</button>
	<button class="btn btn-secondary" v-on:click="get_data()">get</button>
	<table class="table table-striped" responsive="True">
		<thead class="thead-dark">
			<tr>
			<th>Time</th>
			<th v-for="k in Object.keys(data)">{{ k }}</th>
			</tr>
		</thead>
		<tbody>
			<tcdata-widget v-for="data in datas" v-bind:data="data"></tcdata-widget>
		</tbody>
	</table>
	`,
	mounted () {
		this.get_data()
	},
	methods: {
		start_data() { // start fetching data every dt = sleeptime
			this.timer = setInterval(()=>{this.get_data()}, 
					1000*this.device.fields.sleeptime);
		},
		stop_data() { // stop fetching data
			clearInterval(this.timer);
		},
		get_data() { // fetch a single set of data directly from arduino (axios)
			config = {  	method : 'GET',
					url : '/tctrl/' + this.device.fields.name,
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : this.device };
			axios(config)
				//.then(response => console.log(response))
				.then(response => {
					console.log(response);
					this.data = response.data;
					this.datas.unshift(sofi_data);
					})
				.catch(error => console.log(error));
		},
		set_parameters(arr) {
			config = {  method : 'POST',
						url : '/tctrl/',
						xsrfCookieName: 'csrftoken',
						xsrfHeaderName: 'X-CSRFTOKEN',
						data : this.device + this.arr };
			axios(config)
				.then(response => {
					console.log(response.data);})
				.catch(error => console.log(error))
		},
	},
})

PDData.component( 'tcdata-widget', {
	data () { return {
		datetime : new Date().toLocaleTimeString(),
		}
	},
	props : ['data'],
	template: `
		<tr>
		<!-- td>{{ this.datetime }}</td -->
		<td v-for="d in data">{{ d }}</td>
		</tr>
	`,
})

TCData.mount('#tcdata')
