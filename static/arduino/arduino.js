/* In order to obtain the correct csrf-tokens the Django docs suggest this function. However, it is not needed ?! (https://docs.djangoproject.com/en/3.2/ref/csrf/) */
function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.substring(0, name.length + 1) === (name + '=')) { // Does this cookie string begin with the name we want?
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
};

function range(start, end) {
    return (new Array(end - start + 1)).fill(undefined).map((_, i) => i + start);
}

//const token = getCookie('csrftoken');
//const display = document.getElementById("cors");
//console.log(token);

/* This is the main app for the detail page - below follow tables for PDmons and Tctrls */
const ArduinoDetail = Vue.createApp({})

ArduinoDetail.component('arduino', {
	data() { return {
		data : [],
		datas : [],
		setup : {	'status' : 'Trying to connect...', 'sleep' : '5', 'save' : '00:00:00', 'name' : 'test',
					'convert' : {}, 'lock' : ''},
		key : {},
		config : [],
		editForm : {},
		alert : true,
		init : true,
		}
	},
	compilerOptions: {
		delimiters: ['[[', ']]'],
	},
	props: ['model', 'device'],
	template: `
	<div class="row mb-3 align-middle">
		<div class="col"><div class="card">
			<div class="card-header text-light bg-dark"><div class="row align-center">
				<div class="col-7">
					<h3>[[ device.name ]]:[[ device.ip ]]</h3>
					<h5>[[ device.description ]]</h5>
				</div>
				<div class="col-5">
					<h6>CSV name : <input v-model="this.setup['name']" placeholder="name for CSV"/>.csv</h6>
					<h6>Next CSV Download : <input class="w-25" v-model="this.setup['save']" placeholder="savetime in 'hh:mm:ss'"/> today</h6>
					<h6>Current Sleeptime : <input class="w-25" v-model="this.setup['sleep']" placeholder="sleeptime in s" v-on:blur="this.stop_device(), this.start_device()"> s</h6>
				</div>
			</div></div>
		</div></div>
		<div class="col align-middle">
			<div class="alert alert-info text-center py-1 mb-2" role="alert">[[ this.setup['status'] ]]</div>
			
			<div class="btn-group w-100 mb-2">
			<button class="btn btn-success" data-bs-toggle="button" autocomplete="off" v-on:click="start_device()">start</button>
			<button class="btn btn-danger" v-on:click="stop_device()">stop</button>
			<button class="btn btn-secondary" v-on:click="get_device()">get</button>
			<button class="btn btn-primary" v-on:click="get_CSV()">export as CSV</button>
			<button class="btn btn-warning" v-on:click="this.reset()">reset</button>
			</div>
			
			<div class="alert alert-dark py-0 my-0"><div class="row"><div class="col" v-for="k in Object.keys(this.key).splice(1)">
				<input type="checkbox" v-model="this.key[k]" value="this.key[k]"> [[ k ]]
			</div></div></div>
		</div>
	</div>
	
	<div v-if="this.model == 'tctrl'" class="row mb-3">
		<div class="col"><input v-model="this.editForm['setpoint']" class="form-control" placeholder="setpoint"></div>
		<div class="col"><input v-model="this.editForm['P']" class="form-control" placeholder="P"></div>
		<div class="col"><input v-model="this.editForm['I']" class="form-control" placeholder="I"></div>
		<div class="col"><input v-model="this.editForm['D']" class="form-control" placeholder="D"></div>
		<div class="col-2"><button class="btn btn-info w-100" v-on:click="edit_device()">submit</button></div>
	</div>
	
	<div v-if="this.model == 'pdmon'" class="row mb-3">
		<div class="col-2">Convert to measure 0-12V :</div>
		<div class="col text-center" v-for="k in Object.keys(this.key).splice(1)">
  			<div class="form-check form-switch">
  			<input v-model="this.setup['convert'][k]" class="form-check-input" type="checkbox">[[ k ]]
  			</div>
  		</div>
		<div class="col-3 text-center">laser lock : <input class="w-50" v-model="this.setup['lock']" placeholder="channel (e.g. A3)"></div>
  	</div>
	
	<button class="btn btn-info w-100" v-on:click="this.slackbot('TALK')">talk to me!</button>
	
  	<div id="init_plot" style="width:1600px;height:650px;"></div>
  	
  	<div class="table-responsive" style="height: 200px;"><table class="table table-striped mh-100">
		<thead class="sticky-top">
			<tr class="bg-dark text-light"><th v-for="k in Object.keys(this.key).filter(key => this.key[key])">[[ k ]]</th></tr>
			<tr class="bg-info"><td v-for="k in Object.keys(this.key).filter(key => this.key[key])">
				[[ this.data[k] ]]
			</td></tr>
		</thead>
		<tbody>
			<tr v-for="d in datas.slice(1)"><td v-for="k in Object.keys(this.key).filter(key => this.key[key])">
				[[ d[k] ]]
			</td></tr>
		</tbody>
	</table></div>
	`,
	mounted () {
		this.get_device();
	},
	updated () { // export data every new day automatically
		this.is_locked();
	},
	methods: {
		start_device() { // start fetching data every dt = sleeptime
			this.switch = true;
			this.timer = setInterval(()=>{this.get_device()}, 1000*this.setup['sleep']);
		},
		stop_device() { // stop fetching data
			clearInterval(this.timer);
		},
		get_device() { // fetch a single set of data from arduino (with python in views.py)
			config = {	method : 'POST',
					url : '/arduino/'  + this.device['name'] + '/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : { command :'STATUS', }
			};
			this.config = config;
			axios(config)
				.then(response => {
					if ( this.init ) { 
						this.key = response.data['keys']; 
						this.init_plot(response.data['keys']);
						this.setup['name'] = this.device.name + '_' + response.data['value']['updated'].slice(0,10);
						this.init = !this.init;
					}
					for ( k in Object.keys(this.setup['convert']) ) {
						ch = Object.keys(this.setup['convert'])[k];
						response.data['value'][ch] = this.conversion(response.data['value'][ch]);
					}
					this.data = response.data['value'];
					this.datas.unshift(response.data['value']);
					this.setup['status'] = response.data['message'];
					this.update_plot(response.data['value']);
					
					this.check_time()
				})
				.catch(error => {
					this.setup['status'] = error;
					console.log(error);
				});
		},
		edit_device() {
			config = this.config;
			config['data']['command'] = 'EDIT';
			config['data']['params'] = this.editForm;
			axios(config)
				.then(response => {this.setup['status'] = response.data['message'];})
				.catch(error => console.log(error));
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
		conversion(val) {
			var R1 = 47; var R2 = 33
			return Number(val * ((R1 + R2)/R2)).toFixed(3);
		},
		is_locked() {
			if ( this.setup['lock'] in this.key ) {
				ch = this.setup['lock'];
				if ( (this.data[ch] < 2.8 || 4.8 < this.data[ch]) && this.alert ) {
					this.alert = !this.alert;
					this.setup['status'] = "Laser is not locked !!!";
					alert("Laser out of lock!");
					this.slackbot('ALERT');
				};
			};
		},
		check_time() {
			var now = this.data['updated'].slice(11,19);
			var save = this.setup['save'].slice(0,7);
			console.log('Is ' + now.slice(0,7) + ' equal to ' + save + ' ?');
			console.log('And is ' + parseInt(now.slice(-1)) + ' smaller than ' + parseInt(this.setup['sleep']) + ' ?');
			if (now.slice(0,7) == save && ( parseInt(now.slice(-1)) < parseInt(this.setup['sleep']) ) ) {
				this.get_CSV();
				this.datas = [];
				Plotly.deleteTraces('init_plot', [0,1,2,3,4,5]);
				this.init_plot(Object.keys(this.key));
			}
		},
		get_CSV() {
			var name = this.setup['name'] + '.csv';
			
			var array = typeof this.datas != 'object' ? JSON.parse(this.datas) : this.datas;
			var str = Object.keys(this.data).toString() + '\r\n';

			for (var i = 0; i < array.length; i++) {
				var line = '';
				for (var index in array[i]) {
					if (line != '') line += ','
					line += array[i][index];
				}
				str += line + '\r\n';
			}
			
			downloadCSV(str, name); // Download CSV file
		},
		reset() {
			this.datas = [];
			Plotly.deleteTraces('init_plot', [0,1,2,3,4,5]);
			this.init_plot(Object.keys(this.key));
		},
		slackbot(command) {
			config = {	method : 'POST',
						url : '/slackbot/',
						xsrfCookieName : 'csrftoken',
						xsrfHeaderName : 'X-CSRFTOKEN',
						data : { 	device_url : this.device['model'] + '/' + this.device['name'] + '/',
									command : command , message : 'Hello.', },
			};
					
			axios(config)
				.then(response => {
					console.log(this.response);
					this.setup['status'] = response.data['message'];
					})
				.catch(error => {
					console.log(error);
					this.setup['status'] = error;
				});
		},
	},
})

/* At last, mount the detail-app */
ArduinoDetail.mount('#arduino');

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

function exportTableToCSV() {
	var name = this.setup['name'] + '.csv';
	
	var array = typeof arr != 'object' ? JSON.parse(arr) : arr;
	var str = Object.keys(arr[0]).toString() + '\r\n';

	for (var i = 0; i < array.length; i++) {
		var line = '';
		for (var index in array[i]) {
			if (line != '') line += ','
				line += array[i][index];
		}
		str += line + '\r\n';
	}	
	downloadCSV(str, name); // Download CSV file
}