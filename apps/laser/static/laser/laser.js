/* This is the main app for the detail page - below follow tables for PDmons and Tctrls */
const LaserDetail = Vue.createApp({})

LaserDetail.component('laser', {
	data() { return {
		data : [],
		datas : [],
		setup : {'status' : 'Trying to connect...', 'counter' : 180, 'edfa' : false, 'laser' : false,  'sleep' : '10', 'save' : 'never', 'name' : 'test',},
		config : {},
		editForm : {},
		}
	},
	compilerOptions: {
		delimiters: ['[[', ']]'],
	},
	props: ['laser'],
	template: `
        <div class="row mb-3 align-middle">
		<div class="col"><div class="card">
			<div class="card-header text-light bg-dark"><div class="row align-center">
				<div class="col-7">
					<h3>[[ laser.name ]]:[[ laser.ip ]]</h3>
					<h5>[[ laser.description ]]</h5>
				</div>
				<div class="col-5">
					<h6>CSV name : <input v-model="this.setup['name']" placeholder="name for CSV"/>.csv</h6>
					<h6>Next CSV Download : <input v-model="this.setup['save']" placeholder="savetime in 'hh:mm:ss'"/></h6>
					<h6>Current Sleeptime : <input class="w-25" v-model="this.setup['sleep']" placeholder="sleeptime in s" v-on:blur="this.stop_laser(), this.start_laser()"> s</h6>
				</div>
			</div></div>
		</div></div>
		<div class="col align-middle">
			<div class="alert alert-info text-center py-1 mb-2" role="alert">[[ this.setup['status'] ]]</div>
			
			<div class="btn-group w-100 mb-2">
			<button class="btn btn-success" data-bs-toggle="button" autocomplete="off" v-on:click="start_laser()">start</button>
			<button class="btn btn-danger" v-on:click="stop_laser()">stop</button>
			<button class="btn btn-secondary" v-on:click="get_laser()">get</button>
			<button class="btn btn-primary" v-on:click="get_CSV()">export as CSV</button>
			<button class="btn btn-info" v-on:click="exportTableToCSV()">export as fCSV</button>
			<button class="btn btn-warning" v-on:click="this.reset()">reset</button>
			</div>
		</div>
	</div>
	
	<div class="alert alert-info" role="alert">[[ this.setup['status'] ]]</div>
	
	laser : [[ this.setup['laser'] ]]
	edfa : [[ this.setup['edfa'] ]]
	editform : [[ this.editForm ]]
	
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
				<td><button class="btn btn-primary" v-on:click="this.toggle_laser()" id="toggle_LD">toggle POWER</button></td>
			</tr>
			<tr>
				<td>2. Set setpoint for edfa1 (const. current OR const. voltage mode)</td>
				<td>EDFA1 voltage : <input v-model="this.editForm['power']" placeholder="power setpoint"/> V <button class="btn btn-primary" v-on:click="this.set_edfa()" id="set_edfa">update edfa</button></td>
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
	
	<div class="table-responsive" style="height: 200px;"><table class="table table-striped mh-100">
		<thead class="sticky-top">
			<tr class="bg-dark text-light">
				<th v-for="k in Object.keys(this.data)">[[ k ]]</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="d in datas"><td v-for="k in Object.keys(this.data)">
				[[ d[k] ]]
			</td></tr>
		</tbody>
	</table></div>
	`,
	mounted () {
		this.get_laser();
                this.setup['name'] = this.laser['name'] + '_' + this.data['updated'].slice(0,10);
                this.setup['save'] = this.data['updated'].slice(0,10) + ' 23:59:59';
	},
	updated () {
		if ( this.setup['counter'] == 0 ) {
			clearInterval(this.timer);
			this.setup['status'] = 'Laser ready!';
		};
		if ( this.setup['laser'] ) {
			document.getElementById("toggle_edfa").disabled = false;
			document.getElementById("set_edfa").disabled = false;
		}
		if ( this.setup['edfa'] ) {
			document.getElementById("toggle_LD").disabled = true;
		}
	},
	methods: {
                start_device() { // start fetching data every dt = sleeptime
			this.switch = true;
			this.timer = setInterval(()=>{this.get_device()}, 1000*this.setup['sleep']);
		},
		stop_device() { // stop fetching data
			clearInterval(this.timer);
		},
                get_laser() {
                        this.control('STATUS')
                },
		toggle_laser() {
			if ( this.setup['laser'] ) { 
				this.control('TOGGLE', 'OFF'); }
			else { 
				this.control('TOGGLE', 'ON');
				this.toggle_counter();
			}
			this.setup['laser'] = !this.setup['laser']
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
			this.control('SET_EDFA', this.editForm['power']);
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
				this.setup['laser'] = response.data['laser'];
				this.data = Object.assign({}, response.data['value'], {'status' : response.data['message']});
				this.datas.unshift(this.data);
				});
		},
	},
})

/* At last, mount the detail-app */
LaserDetail.mount('#laser');

/* These are functions for translating the html data to csv and downloading the log */
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

/* Currently not used as it somehow can't be called by any button in the app...
Also, this function is rather downloading the table shown instead of the data (complications with rows etc) */
function exportTableToCSV(name) {
	var csv = [];
	var rows = document.querySelectorAll("table tr");
    
	for (var i = 0; i < rows.length; i++) {
        	var row = [], cols = rows[i].querySelectorAll("td, th");
        
        	for (var j = 0; j < cols.length; j++) 
        		row.push(cols[j].innerText);
        
        	csv.push(row.join(","));        
	}

    	// Download CSV file
	downloadCSV(csv.join("\n"), filename);
}