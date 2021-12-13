/* This is the main app for the detail page - below follow tables for PDmons and Tctrls */
const redpitayaDetail = Vue.createApp({})

redpitayaDetail.component('redpitaya', {
	data() { return {
		data : [],
		datas : [],
		setup : {'status' : 'Trying to connect...', 'sleep' : '10', 'save' : 'never', 'name' : 'test',},
		config : {},
		editForm : {},
		}
	},
	compilerOptions: {
		delimiters: ['[[', ']]'],
	},
	props: ['redpitaya'],
	template: `
        <div class="row mb-3 align-middle">
		<div class="col"><div class="card">
			<div class="card-header text-light bg-dark"><div class="row align-center">
				<div class="col-7">
					<h3>[[ redpitaya.name ]]:[[ redpitaya.ip ]]</h3>
					<h5>[[ redpitaya.description ]]</h5>
				</div>
				<div class="col-5">
					<h6>CSV name : <input v-model="this.setup['name']" placeholder="name for CSV"/>.csv</h6>
					<h6>Next CSV Download : <input v-model="this.setup['save']" placeholder="savetime in 'hh:mm:ss'"/></h6>
					<h6>Current Sleeptime : <input class="w-25" v-model="this.setup['sleep']" placeholder="sleeptime in s" v-on:blur="this.stop_redpitaya(), this.start_redpitaya()"> s</h6>
				</div>
			</div></div>
		</div></div>
		<div class="col align-middle">
			<div class="alert alert-info text-center mb-2" role="alert">[[ this.setup['status'] ]]</div>
			
			<div class="btn-group w-100">
			<button class="btn btn-success" data-bs-toggle="button" autocomplete="off" v-on:click="start_redpitaya()">start</button>
			<button class="btn btn-danger" v-on:click="stop_redpitaya()">stop</button>
			<button class="btn btn-secondary" v-on:click="get_redpitaya()">get</button>
			<button class="btn btn-primary" v-on:click="get_CSV()">export as CSV</button>
			<button class="btn btn-warning" v-on:click="this.reset()">reset</button>
			</div>
		</div>
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
			<tr v-for="d in datas"><td v-for="k in Object.keys(this.data)">
				[[ d[k] ]]
			</td></tr>
		</tbody>
		</table></div></div>
	</div>
	`,
	mounted () {
		this.init_redpitaya();
	},
	updated () {
	},
	methods: {
		init_redpitaya() {
			this.control('STATUS').then( data => {
				this.setup['name'] = this.redpitaya['name'] + '_' + data['updated'].slice(0,10);
				this.setup['save'] = data['updated'].slice(0,10) + ' 23:59:59';
				this.init_plot(Object.keys(data));
				this.update_plot(data);
				
				this.data = Object.assign({}, data, {'status' : this.setup['status']});
				this.datas.unshift(this.data);
			});
		},
                start_redpitaya() { // start fetching data every dt = sleeptime
			this.timer = setInterval(()=>{this.get_redpitaya()}, 1000*this.setup['sleep']);
		},
		stop_redpitaya() { // stop fetching data
			clearInterval(this.timer);
		},
                get_redpitaya() {
                        this.control('STATUS').then( data=> {
				this.data = Object.assign({}, data, {'status' : this.setup['status']});
				this.datas.unshift(this.data);
				this.update_plot(data);
				this.check_time();
			});
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
		init_plot(init_keys) {
			INIT_PLOT = document.getElementById('init_plot');
			var init_data = [];
			for ( k in Object.keys(init_keys).splice(1) ) {
				var k = {
					x: [],
					y: [],
					name: Object.keys(init_keys).splice(1)[k],
					mode: 'lines+markers',
					type: 'scatter'
				};
				init_data.push(k);
			};
			var init_layout = {};
			Plotly.newPlot(INIT_PLOT, init_data, init_layout);
		},
		update_plot(update_data) {
			var update_x = []; var update_y = []; var traces = [];
			
			for ( k in Object.keys(update_data).splice(1) ) {
					update_x[k] = [update_data['updated']];
					update_y[k] = [update_data[Object.keys(this.key).splice(1)[k]]]; 
					traces.push(parseInt(k));
			};
			
			Plotly.extendTraces('init_plot', {x:update_x,y:update_y,},traces);  
		},
		check_time() {
			var now = this.data['updated'];
			var save = this.setup['save'];
			
			if (now >= save ) {
				//this.get_CSV();
				this.datas = [];
				Plotly.deleteTraces('init_plot', [0]);
				this.init_redpitaya();
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
redpitayaDetail.mount('#redpitaya');

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