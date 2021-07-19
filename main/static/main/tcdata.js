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
	<div class="container mb-3"><div class="row">
		<div class="col">
			<button class="btn btn-info btn-block">{{ data['message'] }}</button>
		</div>
		<div class="col">
			<div class="btn-group w-100">
			<button class="btn btn-success" data-bs-toggle="button" autocomplete="off" v-on:click="start_device()">start</button>
			<button class="btn btn-danger" v-on:click="stop_device()">stop</button>
			<button class="btn btn-secondary" v-on:click="get_device()">get</button>
			<button class="btn btn-warning" v-on:click="remove_device()">remove</button>
			<!-- button class="btn btn-outline-secondary" v-on:click="get_data_direct()">get direct</button -->
			</div>
		</div>
	</div></div>
	blaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
	<table class="table table-striped" responsive="True">
		<thead class="thead-dark">
			<tr>
			<th>Time</th>
			<th v-for="k in Object.keys(data.value)">{{ k }}</th>
			</tr>
		</thead>
		<tbody>
			<tcdata-widget v-for="data in datas" v-bind:data="data"></tcdata-widget>
		</tbody>
	</table>
	blaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
	{{ data.value }}
	`,
	mounted () {
		this.get_device()
	},
	methods: {
		start_device() { // start fetching data every dt = sleeptime
			this.timer = setInterval(()=>{this.get_device()}, 
					1000*this.device.fields.sleeptime);
		},
		stop_device() { // stop fetching data
			clearInterval(this.timer);
		},
		get_device() { // fetch a single set of data directly from arduino (axios)
			config = {	method : 'POST',
					url : '/' + this.device.model + '/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : [this.device.pk, 'DATA'] };
			axios(config)
				.then(response => {
					console.log(response);
					this.data = response.data;
					this.datas.unshift(response.data); })
				.catch(error => console.log(error));
		},
		edit_device(arr) {
			config = {  method : 'POST',
						url : '/pdmon/' + this.device.pk,
						xsrfCookieName: 'csrftoken',
						xsrfHeaderName: 'X-CSRFTOKEN',
						data : [this.device, EDIT] };
			axios(config)
				.then(response => {
					console.log(response.data);
					this.data['message'] = response.data['message']; })
				.catch(error => console.log(error));
		},
		remove_device() {
			config = {	method : 'DELETE',
						url : '/' + this.device.model + '/',
						xsrfCookieName: 'csrftoken',
						xsrfHeaderName: 'X-CSRFTOKEN',
						data : [this.device.pk, 'DELETE'] };
			axios(config)
				.then(response => console.log(response))
				.catch(error => console.log(error));
		},
	},
})

TCData.component( 'tcdata-widget', {
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
