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
const DetailTable = Vue.createApp({})

DetailTable.component('detail-table', {
	data() { return {
		data : [],
		datas : [],
		status : 'Trying to connect...',
		key : [],
		config : [],
		editForm : {},
		}
	},
	compilerOptions: {
		delimiters: ['[[', ']]'],
	},
	props: ['device'],
	template: `
	<div class="row mb-3">
		<div class="col"><div class="card">
			<div class="card-header text-light bg-dark" style="height : 87.07px;">
				<h4>[[ device.fields.name ]] : [[ device.fields.description ]]</h4>
				<h6>IP : [[ device.fields.ip ]], Sleeptime : [[ device.fields.sleeptime ]] s</h6>
			</div>
		</div></div>
		<div class="col">
			<div class="alert alert-info text-center py-1" role="alert">[[ status ]]</div>
			
			<div class="btn-group w-100">
			<button class="btn btn-success" data-bs-toggle="button" autocomplete="off" v-on:click="start_device()">start</button>
			<button class="btn btn-danger" v-on:click="stop_device()">stop</button>
			<button class="btn btn-secondary" v-on:click="get_device()">get</button>
			<button class="btn btn-primary" onclick="exportTableToCSV('test.csv')">export as CSV</button>
			<button class="btn btn-warning" v-on:click="remove_device()">remove</button>
			</div>
		</div>
	</div>
	
	<div v-if="this.device.model == 'main.tctrl'" class="row mb-3">
		<div class="col"><input v-model="this.editForm['setpoint']" class="form-control" placeholder="setpoint"></div>
		<div class="col"><input v-model="this.editForm['P']" class="form-control" placeholder="P"></div>
		<div class="col"><input v-model="this.editForm['I']" class="form-control" placeholder="I"></div>
		<div class="col"><input v-model="this.editForm['D']" class="form-control" placeholder="D"></div>
		<div class="col"><input v-model="this.editForm['sleeptime']" class="form-control" placeholder="sleeptime"></div>
		<div class="col"><button class="btn btn-info w-100" v-on:click="edit_device()">submit</button></div>
	</div>
  	
  	<!-- div class="col" v-for="i in Array(6).keys()">
  			<input type="checkbox" class="btn-check" id="i" v-on:click="this.conversion(i)"> 
  			<label class="btn btn-outline-secondary" for="i">A[[ i ]]</label>
  	</div -->
  		
  	<div v-if="this.device.model == 'main.pdmon'" class="row mb-3">
  		<div class="col" v-for="i in Array(6).keys()"><div class="form-check form-switch text-center text-align-middle">
  			<input class="form-check-input" type="checkbox" v-on:click="this.conversion(i)"> A[[ i ]]
  		</div></div>
  		<div class="col-3"><input v-model="this.editForm['sleeptime']" class="form-control" placeholder="sleeptime"></div>
  		<div class="col-3"><button class="btn btn-info w-100" v-on:click="edit_device()">submit</button></div>
  	</div>
  	
  	<div id="init_plot" style="width:1600px;height:650px;"></div>
  	
  	<div class="table-responsive" style="height: 350px;"><table class="table table-striped mh-100">
		<thead class="table-dark"><tr>
			<th v-for="k in key">[[ k ]]</th>
		</tr></thead>
		<tbody><tr v-for="data in datas"><td v-for="k in key">[[ data['value'][k] ]]</td></tr></tbody>
	</table></div>
	`,
	mounted () {
		this.init_device();
	},
	updated () { // export data every new day automatically
		if (this.data['value'] && this.data['value']['updated'] == '00:00:00') {
			// Date().toLocaleString(    [], {day: '2-digit', month: '2-digit', year: '4-digit'})
			const date = new Date();
			var day = date.getDay() + '_' + date.getMonth() + '_' + date.getFullYear();
			exportTableToCSV(day + '.csv')
		}
	},
	methods: {
		convert_voltage(v) { // conversion formular to obtain preassure
			const p = 10**((v-7.75)/0.75) * 10000000;
			return p
		},
		init_device() { // initialize device and create config for further axios requests
			payload = { model : this.device.model, pk : this.device.pk };
			config = {	method : 'POST',
					url : '/device/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : ['STATUS', payload] };
			this.config = config;
			axios(config)
				.then(response => {
					this.data = response.data;
					this.key = response.data['keys'];
					this.status = response.data['message'];
					
					this.init_plot(this.key);
				})
				.catch(error => {
					this.status = error;
					console.log(error);
				});
		},
		start_device() { // start fetching data every dt = sleeptime
			this.timer = setInterval(()=>{this.get_device()}, 
					1000*this.device.fields.sleeptime);
		},
		stop_device() { // stop fetching data
			clearInterval(this.timer);
		},
		get_device() { // fetch a single set of data directly from arduino (axios)
			config = this.config;
			config['data'][0] = 'DATA';
			axios(config)
				.then(response => {
					this.data = response.data;
					this.datas.unshift(response.data);
					this.status = response.data['message'];
					
					if (response.data['value']) {
						this.update_plot(response.data['value'], this.key);
					};
				})
				.catch(error => {
					this.status = error;
					console.log(error);
				});
		},
		edit_device(arr) {
			config = this.config;
			config['data'][0] = 'EDIT';
			config['data'][1]['params'] = this.editForm;
			axios(config)
				.then(response => {
					console.log(response.data);
					this.status = response.data['message'];
					this.key = response.data['keys'];
					})
				.catch(error => console.log(error));
		},
		remove_device() {
			config = this.config;
			config['data'][0] = 'DELETE';
			axios(config)
				.then(response => {
					console.log(response);
					this.status = response.data['message'];
					})
				.catch(error => {
					this.status = error;
					console.log(error);
				});
		},
		init_plot(init_keys) {
			INIT_PLOT = document.getElementById('init_plot');
			var init_data = [];
			for ( var u = 0; u < init_keys.length - 1; u++) {
				var t = {
					x: [],
					y: [],
					name: init_keys[u+1],
					mode: 'lines+markers',
					type: 'scatter'
				};
				init_data.push(t);
			};
			var init_layout = {};
			
			Plotly.newPlot(INIT_PLOT, init_data, init_layout);
		},
		update_plot(update_data, update_keys) {
			var update_x = []; var update_y = []; var traces = [];
			
			for ( var u = 0; u < update_keys.length - 1; u++) {
				update_x[u] = [update_data['updated']];
				update_y[u] = [update_data[update_keys[u+1]]]; 
				traces.push(u);
			};
			
			Plotly.extendTraces('init_plot', {x:update_x,y:update_y,},traces); 
		},
		conversion(channel) {
			var index = this.key.indexOf('A'+channel);
			if (index !== -1) {
    				this.key[index] = 'P' + channel;
			}
			else {
				var newindex = this.key.indexOf('P'+channel);
				this.key[newindex] = 'A' + channel;
			}
		},
	},
})

/* At last, mount the detail-app */
DetailTable.mount('#devicedetail');

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

function exportTableToCSV(filename) {
	var csv = [];
	var rows = document.querySelectorAll("table tr");

	for (var i = 0; i < rows.length; i++) {
		var row = [], cols = rows[i].querySelectorAll("td, th");

		for (var j = 0; j < cols.length; j++) {
			row.push(cols[j].innerText);
		}
		csv.push(row.join(","));
	}
	downloadCSV(csv.join("\n"), filename); // Download CSV file
}

/* These are the functions for creating the plots */
/*PLOT = document.getElementById('plot');

var setpoint_trace = {
	x: [],
	y: [],
	name: 'setpoint',
	mode: 'lines+markers',
	type: 'scatter'
};

var input_trace = {
	x: [],
	y: [],
	name: 'T',
	mode: 'lines+markers',
	type: 'scatter'
};

var output_trace = {
	x: [],
	y: [],
	name: 'output',
	mode: 'lines+markers',
	type: 'scatter'
};

var data = []; //setpoint_trace, input_trace, output_trace];

var layout = {
	title: 'input trace',  // more about "layout.title": #layout-title
	xaxis: { title: 'time' },
	yaxis: { title: 'control', side: 'right' },
};

Plotly.newPlot(PLOT, data, layout);

Math.random().toString().substr(2, 5);
//document.getElementById("cors") = token;*/
