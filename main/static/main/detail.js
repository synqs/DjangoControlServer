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
		time : {'sleep' : '5', 'save' : '00:00:00'},
		key : {},
		conversion : [],
		config : [],
		editForm : {},
		editTime : {},
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
				<h6>IP : [[ device.fields.ip ]]</h6>
			</div>
		</div></div>
		<div class="col">
			<div class="alert alert-info text-center py-1" role="alert">[[ status ]]</div>
			
			<div class="btn-group w-100">
			<button class="btn btn-success" data-bs-toggle="button" autocomplete="off" v-on:click="start_device()">start</button>
			<button class="btn btn-danger" v-on:click="stop_device()">stop</button>
			<button class="btn btn-secondary" v-on:click="get_device()">get</button>
			<button class="btn btn-primary" onclick="exportTableToCSV('test.csv')">export as CSV</button>
			</div>
		</div>
	</div>
	
	<div v-if="this.device.model == 'main.tctrl'" class="row mb-3">
		<div class="col"><input v-model="this.editForm['setpoint']" class="form-control" placeholder="setpoint"></div>
		<div class="col"><input v-model="this.editForm['P']" class="form-control" placeholder="P"></div>
		<div class="col"><input v-model="this.editForm['I']" class="form-control" placeholder="I"></div>
		<div class="col"><input v-model="this.editForm['D']" class="form-control" placeholder="D"></div>
		<div class="col-2"><input v-model="this.editForm['save']" class="form-control" placeholder="savetime in 'hh:mm:ss'"/></div>
  		<div class="col-2"><input v-model="this.editForm['sleep']" class="form-control" placeholder="sleeptime in s"></div>
		<div class="col"><button class="btn btn-info w-100" v-on:click="edit_device()">submit</button></div>
	</div>
  		
  	<div v-if="this.device.model == 'main.pdmon'" class="row mb-3">
  		<div class="col" v-for="k in Object.keys(this.key).splice(1)"><div class="form-check form-switch text-center align-middle my-2">
  			<input class="form-check-input" type="checkbox" v-on:click="this.conversion_12(k)">[[ k ]]
  		</div></div>
  		<div class="col-2"><input v-model="this.editForm['save']" class="form-control" placeholder="savetime in 'hh:mm:ss'"/></div>
  		<div class="col-2"><input v-model="this.editForm['sleep']" class="form-control" placeholder="sleeptime in s"></div>
		<div class="col-2"><button class="btn btn-info w-100" v-on:click="edit_device()">submit</button></div>
  	</div>
  	
  	<div class="row">
  		<div class="col" v-for="k in Object.keys(this.key).splice(1)">
  			<input type="checkbox" v-model="this.key[k]" value="this.key[k]"> [[ k ]] : [[ this.key[k] ]]
  		</div>
  	</div>
  	
  	[[ this.time ]]
  	
  	<div id="init_plot" style="width:1600px;height:650px;"></div>
  	
  	<div class="table-responsive" style="height: 200px;"><table class="table table-striped mh-100">
		<thead class="sticky-top">
			<tr class="bg-dark text-light"><th v-for="k in Object.keys(this.key)"><div v-if="this.key[k]">[[ k ]]</div></th></tr>
			<tr class="bg-info" v-if="data['value']"><td v-for="k in Object.keys(this.key)"><div v-if="this.key[k]">[[ data['value'][k] ]]</div></td></tr>
		</thead>
		<tbody>
			<tr v-for="d in datas.slice(1)"><td v-for="k in Object.keys(this.key)">[[ d['value'][k] ]]</td></tr>
		</tbody>
	</table></div>
	`,
	mounted () {
		this.init_device();
	},
	updated () { // export data every new day automatically
		if (this.data['value'] && this.data['value']['updated'].slice(0,7) == this.time['sleep'].substring(0,7)) {
			console.log("TIME");
			Date().toLocaleString([], {day: '2-digit', month: '2-digit', year: '4-digit'})
			const date = new Date();
			var day = date.getDay() + '_' + date.getMonth() + '_' + date.getFullYear();
			exportTableToCSV(this.device.fields.name + '-' + day + '-' + this.data['value']['updated'] + '.csv')
			setTimeout(function(){ console.log("WAIT"); }, 10000);
			delete this.datas;
		}
	},
	methods: {
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
					this.status = response.data['message'];
					
					if ( response.data['keys'] ) {
						this.key = response.data['keys'];
						this.init_plot(response.data['keys']);
					}
				})
				.catch(error => {
					this.status = error;
					console.log(error);
				});
		},
		start_device() { // start fetching data every dt = sleeptime
			this.timer = setInterval(()=>{this.get_device()}, 1000*this.time['sleep']);
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
						this.update_plot(response.data['value']);
					};
				})
				.catch(error => {
					this.status = error;
					console.log(error);
				});
		},
		edit_device() {
			if ( 'save' in this.editForm ) {
				this.time['save'] = this.editForm['save'];
				delete this.editForm['save'];
			}
			else if ( 'sleep' in this.editForm ) {
				this.time['sleep'] = this.editForm['sleep'];
				delete this.editForm['sleep'];
			};
			
			config = this.config;
			config['data'][0] = 'EDIT';
			config['data'][1]['params'] = this.editForm;
			axios(config)
				.then(response => {
					console.log(response.data);
					this.status = response.data['message'];
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
			for ( k in Object.keys(init_keys).splice(1) ) {
				var t = {
					x: [],
					y: [],
					name: Object.keys(init_keys).splice(1)[k],
					mode: 'lines+markers',
					type: 'scatter'
				};
				init_data.push(t);
			};
			var init_layout = {};
			
			Plotly.newPlot(INIT_PLOT, init_data, init_layout);
		},
		update_plot(update_data) {
			var update_x = []; var update_y = []; var traces = [];
			
			for ( k in Object.keys(update_data).splice(1) ) {
				//if ( Object.values(this.key).splice(1)[k] ) {
					update_x[k] = [update_data['updated']];
					update_y[k] = [update_data[Object.keys(this.key).splice(1)[k]]]; 
					traces.push(parseInt(k));
				//};
				// traces.push(parseInt(k));
			};
			
			Plotly.extendTraces('init_plot', {x:update_x,y:update_y,},traces); 
		},
		conversion_p(channel) {
			var index = this.key.indexOf('A'+channel);
			if (index !== -1) {
    				this.key[index] = 'P' + channel;
			}
			else {
				var newindex = this.key.indexOf('P'+channel);
				this.key[newindex] = 'A' + channel;
			}
		},
		conversion_12(channel) {
			var R1 = 47000.0; var R2 = 33000.0;
			var index = this.conversion.indexOf(channel);
			
			if (index !== -1) {
    				this.conversion.pop(channel);
    				this.data['value'][channel] = Number( (this.data['value'][channel] * ((R1 + R2)/R2)).toFixed(3));
			}
			else {
				this.conversion.push(channel);
				this.data['value'][channel] = Number( (this.data['value'][channel] / ((R1 + R2)/R2)).toFixed(3));
			}
		},
	},
})

DetailTable.component('checkboxbind', {
	props : ['mod','val'],
	template: `
		<input type="checkbox" v-model="this.mod" value="this.val" checked> [[ this.val ]]
	`,
});

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
