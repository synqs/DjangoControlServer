/* This is the main app for the detail page - below follow tables for PDmons and Tctrls */
const LaserDetail = Vue.createApp({})

LaserDetail.component('laser', {
	data() { return {
		data : [],
		datas : [],
		setup : {'status' : 'Trying to connect...', 'counter' : 180, 'sleep' : '10', 'save' : 'never', 'name' : 'test',},
		config : {},
		editForm : { 'power' : '1' },
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
			<div class="alert alert-info text-center mb-2" role="alert">[[ this.setup['status'] ]]</div>
			
			<div class="btn-group w-100">
			<button class="btn btn-success" data-bs-toggle="button" autocomplete="off" v-on:click="start_laser()">start</button>
			<button class="btn btn-danger" v-on:click="stop_laser()">stop</button>
			<button class="btn btn-secondary" v-on:click="get_laser()">get</button>
			<button class="btn btn-primary" v-on:click="get_CSV()">export as CSV</button>
			<button class="btn btn-warning" v-on:click="this.reset()">reset</button>
			</div>
		</div>
	</div>
	
	<div class="row mb-3">
		<div class="col">1. Turn on the laser : <button class="btn btn-primary" v-on:click="this.toggle_laser()" id="toggle_LD">toggle POWER</button></div>
		<div class="col">2. Set power for high power output : <input v-model="this.editForm['power']" placeholder="power setpoint"/> W <button class="btn btn-primary" v-on:click="this.set_edfa()" id="set_edfa" disabled>update edfa</button></div>
		<div class="col">3. Turn emission on/off : <button class="btn btn-warning" v-on:click="this.toggle_edfa()" id="toggle_edfa" disabled>toggle Emission</button></div>
		<div class="col">(4. Wait for the laser to warm up before locking - Time remaining : [[ this.setup['counter'] ]] s)</div>
	</div>
	
	<div class="row mb-3 align-middle">
		<div class="col"><div id="init_plot" style="width:1600px;height:650px;"></div></div>
		
		<div class="col"><div class="table-responsive" style="height: 650px;"><table class="table table-striped mh-100">
		<thead class="sticky-top">
			<tr class="bg-dark text-light">
				<th v-for="k in Object.keys(this.data)">[[ k ]]</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="d in datas">
				<td v-for="k in Object.keys(this.data)">[[ d[k] ]]</td>
			</tr>
		</tbody>
		</table></div></div>
	</div>
	`,
	mounted () {
		this.init_laser();
	},
	updated () {
		if ( this.setup['counter'] == 0 ) {
			clearInterval(this.timer);
			this.setup['status'] = 'Laser ready!';
		};
		if ( this.setup['status'].includes('Laser diode ON.') ) {
			document.getElementById("toggle_edfa").disabled = false;
			document.getElementById("set_edfa").disabled = false;
		}
		else {
			document.getElementById("toggle_edfa").disabled = true;
			document.getElementById("set_edfa").disabled = true;
		};
		if ( this.setup['status'].includes('Emission ON.') ) {
			document.getElementById("toggle_LD").disabled = true;
		}
		else {
			document.getElementById("toggle_LD").disabled = false;
		};
	},
	methods: {
		init_laser() {
			this.control('STATUS').then( data => {
				this.setup['name'] = this.laser['name'] + '_' + data['updated'].slice(0,10);
				this.setup['save'] = data['updated'].slice(0,10) + ' 23:59:59';
				this.init_plot();
				this.update_plot(data);
				
				this.data = Object.assign({}, data, {'status' : this.setup['status']});
				this.datas.unshift(this.data);
			});
		},
                start_laser() { // start fetching data every dt = sleeptime
			this.timer = setInterval(()=>{this.get_laser()}, 1000*this.setup['sleep']);
		},
		stop_laser() { // stop fetching data
			clearInterval(this.timer);
		},
                get_laser() {
                        this.control('STATUS').then( data=> {
				this.data = Object.assign({}, data, {'status' : this.setup['status'], 'power setpoint' : this.editForm['power'] });
				this.datas.unshift(this.data);
				this.update_plot(data);
				this.check_time()
			});
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
		async control(command, payload="") {
			config = {	method : 'POST',
					url : 'control/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : { 'command' : command, 'payload' : payload },
			};
			let response = await axios(config)
			
			//console.log(response);
			this.setup['status'] = response.data['message'];
			return response.data['value']
		},
		init_plot() {
			INIT_PLOT = document.getElementById('init_plot');
			var init_data = [];
			var k = {
				x: [],
				y: [],
				name: 'EDFA1',
				mode: 'lines+markers',
				type: 'scatter'
			};
			var init_layout = {};
			Plotly.newPlot(INIT_PLOT, [k], init_layout);
		},
		update_plot(update_data) {
			var update_x = [update_data['updated']];
			var update_y = [update_data['EDFA']]; 
			
			Plotly.extendTraces('init_plot', {x:[update_x],y:[update_y],},[0]); 
		},
		check_time() {
			var now = this.data['updated'];
			var save = this.setup['save'];
			
			if (now >= save ) {
				//this.get_CSV();
				this.datas = [];
				Plotly.deleteTraces('init_plot', [0]);
				this.init_laser();
			}
		},
		get_CSV() {
			var csv = [];
			var rows = document.querySelectorAll("table tr");
    
			for (var i = 0; i < rows.length; i++) {
				var row = [], cols = rows[i].querySelectorAll("td, th");
				for (var j = 0; j < cols.length; j++) 
					row.push(cols[j].innerText);
				csv.push(row.join(","));        
			}
	
			// Download CSV file
			downloadCSV(csv.join("\n"), this.setup['name']);
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
