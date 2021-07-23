/* In order to obtain the correct csrf-tokens the Django docs suggest this function. However, it is not needed ?! (https://docs.djangoproject.com/en/3.2/ref/csrf/) */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const token = getCookie('csrftoken');
console.log(token);

/* This is the main app for the detail page - below follow tables for PDmons and Tctrls */
const DetailTable = Vue.createApp({})

DetailTable.component('detail-table', {
	data() { return {
		dev : [],
		}
	},
	props: ['device', 'm', 'pk'],
	template: `
	<div class="card mb-3 card-xxl">
			<div class="card-header text-light bg-dark">
				<h4>{{ device.fields.name }} : {{ device.fields.description }}</h4>
			</div>
			<div class="card-body text-dark bg-light">
				IP : {{ device.fields.ip }}, Sleeptime : {{ device.fields.sleeptime }} s
			</div>
	</div>
	<template v-if="device.model == 'main.pdmon'">
		<pddata-table v-bind:device="device"></pddata-table>
	</template>
	<template v-else-if="device.model == 'main.tctrl'">
		<tcdata-table v-bind:device="device"></tcdata-table>
	</template>
	`,
	mounted () {
		// this.get_device()
	},
	methods : {
		get_device() { // fetch a single set of data directly from arduino (axios)
		config = {	method : 'POST',
				url : '/' + this.m + '/',
				xsrfCookieName: 'csrftoken',
				xsrfHeaderName: 'X-CSRFTOKEN',
				data : [this.pk, 'STATUS'] };
		axios(config)
			.then(response => {
				console.log(response);
				this.device = response.data; })
			.catch(error => console.log(error));
		},
	},
})

/* PDDATA APPLICATION */

DetailTable.component( 'pddata-table', {
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
			</div>
		</div>
	</div></div>
	
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
					//headers : {'X-CSRFTOKEN' : token},
					data : [this.device.pk, 'DATA'] };
			axios(config)
				.then(response => {
					console.log(response);
					this.data = response.data;
					this.datas.unshift(response.data); 
					})
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

DetailTable.component( 'pddata-widget', {
	props : ['data'],
	template: `
		<tr>
		<td>{{ data['value']['updated'] }}</td>
		<td v-for="ch in data['channels']">{{ data.value[ch] }}</td>
		</tr>
	`,
})

/* TCTRL APPLICATION */
DetailTable.component( 'tcdata-table', {
	data () { return {
		data : [],
		datas : [],
		key : [],
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
			</div>
		</div>
	</div></div>
	<table class="table table-striped" responsive="True">
		<thead class="thead-dark">
			<tr>
			<th>Time</th>
			<th v-for="k in key">{{ k }}</th>
			</tr>
		</thead>
		<tbody>
			<tcdata-widget v-for="data in datas" v-bind:data="data"></tcdata-widget>
		</tbody>
	</table>
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
					console.log(response.data);
					this.key = Object.keys(response.data['value']); // this is weird 
					this.data = response.data;
					this.datas.unshift(response.data); 
					})
				.catch(error => console.log(error));
		},
		edit_device(arr) {
			config = {  	method : 'POST',
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

DetailTable.component('tcdata-widget', {
	data () { return {
		datetime : new Date().toLocaleTimeString(),
		}
	},
	props : ['data'],
	template: `
		<tr>
		<td>{{ this.datetime }}</td>
		<td v-for="d in data.value">{{ d }}</td>
		</tr>
	`,
})

/* At last, mount the detail-app */
DetailTable.mount('#devicedetail')
