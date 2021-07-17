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
					url : '/tctrl/' + this.device.pk,
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : this.device };
			axios(config)
				//.then(response => console.log(response))
				.then(response => {
					console.log(response);
					this.data = response.data;
					this.datas.unshift(response.data);
					})
				.catch(error => console.log(error));
		},
		set_parameters(arr) {
			config = {  method : 'POST',
						url : '/tctrl/' + this.device.pk,
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