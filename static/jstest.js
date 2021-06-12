const Table = Vue.createApp({
	data() { return {
		data : null,
		devices : null,
	}},
	compilerOptions: {
		delimiters: ['[[', ']]']
	},
	mounted () {
	},
	methods: {
		get_moneydata() {
			axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')
		             .then(response => (this.data = response))
		             .catch(error => console.log(error))
		},
		get_devices() {
			axios.get('http://localhost:8000/pd_monitor/jstest.html')
		             .then(response => (this.data = response))
		             .catch(error => console.log(error))
		},
	}  
});

Table.component('device-list', {
	props: ['device'],
	template: 
	`<p v-for="x in device">{{ x.pk }}</p>
	`
	/*
	<table class="table table-striped">
		<thead class="thead-dark">
			<tr>
			<th>Name</th>
			<th>Status</th>
			<th>IP</th>
			<th></th>
			</tr>
		</thead>
		<tbody> 
			<tr v-for="d in device">
			<td><a href="{% url 'pd_monitor:detail' d.id %}">{{ d.name }}</a></td>
			<td>0</td>
			<td>{{ d.ip }}</td>
			<td><button type="button" class="btn btn-light">Settings</button></td>
			</tr>
		</tbody>
	</table>*/
})

Table.mount('#info-table')
