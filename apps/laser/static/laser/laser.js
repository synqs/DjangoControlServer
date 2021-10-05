/* This is the main app for the detail page - below follow tables for PDmons and Tctrls */
const LaserDetail = Vue.createApp({})

LaserDetail.component('laser', {
	data() { return {
		data : [],
		datas : [],
		setup : {	'status' : 'Trying to connect...', 'counter' : 5 },
		editForm : {},
		}
	},
	compilerOptions: {
		delimiters: ['[[', ']]'],
	},
	props: ['laser'],
	template: `
	<div class="card-header text-light bg-dark mb-3">
		<h3>[[ laser.name ]]:[[ laser.ip ]]</h3>
		<h5>[[ laser.description ]]</h5>
	</div>
	
	<div class="alert alert-info" role="alert">[[ this.setup['status'] ]]</div>
	
	<div class="row mb-3 align-middle">
			<div class="col-7">1. Turn on the laser</div>
			<div class="col-5"><button class="btn btn-primary" v-on:click="this.toggle_laser()">toggle POWER</button></div>
	</div>
	<div class="row mb-3 align-middle">
			<div class="col-7">2. Wait for the laser to warm up</div>
			<div class="col-5">Time remaining : [[ this.setup['counter'] ]] s</div>
	</div>
	<div class="row mb-3 align-middle">
			<div class="col-7">3. Set setpoint for edfa1 (const. current OR voltage mode)</div>
			<div class="col-5">
				<p>EDFA1 voltage : <input v-model="this.editForm['voltage']" placeholder="voltage setpoint"/> V</p>
				<p>EDFA1 current : <input v-model="this.editForm['current']" placeholder="current setpoint"> A</p>
			</div>
	</div>
	<div class="row mb-3 align-middle">
			<div class="col-7">4. Turn on emission</div>
			<div class="col-5"><button class="btn btn-warning" v-on:click="this.toggle_emission()">toggle Emission</button></div>
	</div>
	
	<table class="table table-striped">
		<thead>
			<tr class="bg-dark text-light">
				<th class="w-50">Directions</th>
				<th>Set-up</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1. Turn on the laser</td>
				<td><button class="btn btn-primary" v-on:click="this.toggle_laser()">toggle POWER</button></td>
			</tr>
			<tr>
				<td>2. Wait for the laser to warm up</td>
				<td>Time remaining : [[ this.setup['counter'] ]] s</td>
			</tr>
			<tr>
				<td>3. Set setpoint for edfa1 (const. current OR const. voltage mode)</td>
				<td><p>EDFA1 voltage : <input v-model="this.editForm['voltage']" placeholder="voltage setpoint"/> V</p>
				<p>EDFA1 current : <input v-model="this.editForm['current']" placeholder="current setpoint"> A</p></td>
			</tr>
			<tr>
				<td>4. Turn on emission</td>
				<td><button class="btn btn-warning" v-on:click="this.toggle_emission()">toggle Emission</button></td>
			</tr>
		</tbody>
	</table>
	`,
	mounted () {
	},
	updated () {
		if ( this.setup['counter'] == 0 ) {
			clearInterval(this.timer);
			this.setup['status'] = 'Laser ready!';
		};
	},
	methods: {
		toggle_laser() {
			this.toggle_counter()
		},
		toggle_counter() {
			this.timer = setInterval(() => { this.setup['counter']--}, 1000)
		},
		toggle_emission() {
		},
	},
})

/* At last, mount the detail-app */
LaserDetail.mount('#laser');