/* This is the main app for the detail page - below follow tables for PDmons and Tctrls */
const LaserDetail = Vue.createApp({})

LaserDetail.component('laser', {
	data() { return {
		data : [],
		datas : [],
		setup : {'status' : 'Trying to connect...', 'counter' : 180, 'edfa' : false, 'laser' : false, },
		config : {},
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
	
	[[ this.setup['laser'] ]]
	
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
				<td><button class="btn btn-primary" v-on:click="this.toggle_laser()" id="toggle_LD" disabled>toggle POWER</button></td>
			</tr>
			<tr>
				<td>2. Set setpoint for edfa1 (const. current OR const. voltage mode)</td>
				<td>EDFA1 voltage : <input v-model="this.editForm['power']" placeholder="power setpoint"/> V <button class="btn btn-primary" v-on:click="this.set_edfa()" id="set_edfa" disabled>update edfa</button></td>
			</tr>
			<tr>
				<td>3. Turn emission on/off</td>
				<td><button class="btn btn-warning" v-on:click="this.toggle_edfa()" id="toggle_edfa" disabled>toggle Emission</button></td>
			</tr>
			<tr>
				<td>(4. Wait for the laser to warm up before locking)</td>
				<td>Time remaining : [[ this.setup['counter'] ]] s</td>
			</tr>
		</tbody>
	</table>
	`,
	mounted () {
		this.control('PING', this.laser['ip'])
		if ( this.setup['status'] == 'Device ready.' ) { 
			$("#toggle_LD").removeClass("disabled");
			this.toggle_counter();
		}
	},
	updated () {
		if ( this.setup['counter'] == 0 ) {
			clearInterval(this.timer);
			this.setup['status'] = 'Laser ready!';
		};
	},
	methods: {
		toggle_laser() {
			/* (async () => { 
				response = await this.control('TOGGLE', 'ON');
				this.setup['status'] = response.data['message'];
			})() */
			if (this.setup['laser']) { 
				$("#toggle_edfa").removeClass("enabled");
				$("#set_edfa").removeClass("enabled");
				this.control('TOGGLE', 'OFF'); }
			else { 
				this.control('TOGGLE', 'ON');
				if ( this.setup['laser'] ) { 
					$("#toggle_edfa").removeClass("disabled");
					$("#set_edfa").removeClass("disabled");
					this.toggle_counter(); }
			}
		},
		toggle_counter() {
			this.timer = setInterval(() => { this.setup['counter']--}, 1000)
		},
		toggle_edfa() {
			if ( this.setup['voltage'] ) {
				if (this.setup['edfa']) { this.control('TOGGLE_EDFA', 'OFF'); }
				else { this.control('TOGGLE_EDFA', 'ON'); }
				this.setup['edfa'] != this.setup['edfa'];
			}
			else { this.setup['status'] = 'Power setpoint invalid!' }
		},
		set_edfa() {
			this.control('SET_EDFA', editForm);
		},
		control(command, payload="") {
			config = {	method : 'POST',
					url : 'control/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : { 'command' : command, 'payload' : payload },
			};
			axios(config).then( response => {
				console.log(response);
				this.setup['status'] = response.data['message'];
				this.setup['laser'] = response.data['success']});
		},
	},
})

/* At last, mount the detail-app */
LaserDetail.mount('#laser');
