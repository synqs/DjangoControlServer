const IndexTable = Vue.createApp({});

IndexTable.component('index-table', {
	data ()  { return {
		addForm : {},
		overview : {},
		}
	},
	compilerOptions: {
		delimiters: ['[[', ']]'],
	},
	props: ['devices'],
	template: `
	<div class="row mb-3">
		<div class="col"><select v-model="this.addForm['model']" class="form-select">
			<option value="main.pdmon">PDmon</option>
			<option value="main.tctrl">Tctrl</option>
		</select></div>
		<div class="col"><input v-model="this.addForm['name']" class="form-control" placeholder="name"></div>
		<div class="col"><input v-model="this.addForm['ip']" class="form-control" placeholder="IP"></div>
		<div class="col"><input v-model="this.addForm['description']" class="form-control" placeholder="description"></div>
		<div class="col"><button class="btn btn-info w-100" v-on:click="add_device()">submit</button></div>
	</div>
	
	<table class="table table-striped align-middle">
		<thead class="table-dark"><tr>
			<th>Name</th>
			<th>Description</th>
			<th>IP</th>
			<th>Status</th>
			<th></th>
			<th>Show Overview</th>
		</tr></thead>
		<tbody><tr v-for="device in this.devices">
			<device-widget v-bind:device="device" v-model="this.overview[this.devices.indexOf(device)]"></device-widget>
		</tr></tbody>
	</table>
	
	<div class="row">
		<div class="col-4" v-for="index in Object.keys(this.overview).filter(dev => this.overview[dev])">
			<overview-card v-bind:device="this.devices[index]"></overview-card>
		</div>
	</div>
	`,
	mounted () { 
	},
	methods: {
		add_device() {
			config = {	method : 'POST',
					url : '/' + this.device['model'] + '/' + this.device['name'] + '/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : { command :'ADD', device : this.addForm, }
			};
			axios(config)
				.then(response => {this.globalstatus = response.data['message']; })
				.catch(error => {
					this.globalstatus = error;
					console.log(error);
				});
			location.reload(true);
		},
	},
});

IndexTable.component('device-widget', {
	data () { return {
		status : 'Trying to connect...',
		config : {},
		overview : false,
		}
	},
	props : ['device', 'modelValue'],
	emits: ['update:modelValue'],
	compilerOptions: {
		delimiters: ['[[', ']]'],
	},
	template: `
	<td>
		<button class="btn btn-secondary" v-on:click="detail_device()">[[ this.device['name'] ]]</button>
	</td>
	<td>[[ this.device['description'] ]]</td>
	<td>[[ this.device['ip'] ]]</td>
	<td>[[ this.status ]]</td>
	<td><button class="btn btn-warning" v-on:click="remove_device()">Remove</button></td>
	<td><div class="form-check form-switch">
		<input class="form-check-input" type="checkbox" v-on:click="this.overview = !this.overview, $emit('update:modelValue', this.overview)">
	</div></td>
	`,
	mounted () {
		this.ping_device();
	},
	methods : {
		ping_device() {
			config = {	method : 'GET',
					url : 'ping/' + this.device['name'] + '/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data: { 'ip' : this.device['ip'] },
			};
			this.config = config;
			axios(config)
				.then(response => {
					this.status = response.data['message'];
					console.log(response.data);})
				.catch(error => {
					this.status = error;
					console.log(error);
				});
		},
		remove_device() {
			config = this.config;
			config['data']['command'] = 'DELETE';
			axios(config)
				.then(response => {this.status = response.data['message'];})
				.catch(error => {
					this.status = error;
					this.status['global'] = error;
					console.log(error);
				});
			location.reload(true);
		},
		detail_device() {
			var windowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
			domain = window.location.href.slice(0,22)
			window.open(domain + this.device['url']);
		},
	},
});

IndexTable.component('overview-card', {
	data () { return {
		data : [],
		datas : [],
		setup : {	'status' : 'Trying to connect...', 'sleep' : '5', 'save' : '00:00:00',
				'name' : 'test', 'convert' : {}, 'lock' : ''},
		key : {},
		init : true,
		}
	},
	props : ['device'],
	compilerOptions: {
		delimiters: ['[[', ']]'],
	},
	template: `
	<div class="card">
		<div class="card-header bg-info text-light"><div class="row align-center">
				<div class="col-5">
					<h5>[[ device.name ]]:</h5><h5>[[ device.ip ]]</h5>
				</div>
				<div class="col-7">
					<h6>CSV name : <input class="w-50" v-model="this.setup['name']" placeholder="name for CSV"/>.csv</h6>
					<h6>Next CSV Download : <input class="w-25" v-model="this.setup['save']" placeholder="savetime in 'hh:mm:ss'"/> today</h6>
					<h6>Current Sleeptime : <input class="w-25" v-model="this.setup['sleep']" placeholder="sleeptime in s"> s</h6>
				</div>
		</div></div>
    		<table class="table my-0">
				<tr class="bg-dark text-light"><th v-for="k in Object.keys(this.key)">[[ k ]]</th></tr>
				<tr><td v-for="k in Object.keys(this.key)">[[ data[k] ]]</td></tr>
		</table>
  		<div class="btn-group w-100">
			<button class="btn btn-success" data-bs-toggle="button" autocomplete="off" v-on:click="start_device()">start</button>
			<button class="btn btn-danger" v-on:click="stop_device()">stop</button>
			<button class="btn btn-secondary" v-on:click="get_device()">get</button>
			<button class="btn btn-primary" v-on:click="this.get_CSV()">export as CSV</button>
		</div>
	</div>
	`,
	mounted () {
		this.get_device();
	},
	updated () { // export data as csv on savetime automatically & check lock
		var now = this.data['updated'].slice(11,19);
		var save = this.setup['save'].slice(0,7);
		if (now.slice(0,7) == save && parseInt(now.slice(-1)) < parseInt(this.setup['sleep'])) {
			this.get_CSV();
			this.datas = [];
		}
		
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
					url : '/arduino/' + this.device['name'] + '/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : { command :'STATUS', }
			};
			axios(config)
				.then(response => {
					for ( k in Object.keys(this.setup['convert']) ) {
						ch = Object.keys(this.setup['convert'])[k];
						response.data['value'][ch] = this.conversion(response.data['value'][ch]);
					}
					if ( this.init ) { this.key = response.data['keys']; this.init = !this.init; }
					this.data = response.data['value'];
					this.datas.unshift(response.data['value']);
					this.setup['status'] = response.data['message'];
				})
				.catch(error => {
					this.setup['status'] = error;
					console.log(error);
				});
		},
		is_locked() {
			if ( this.setup['lock'] in this.key ) {
				ch = this.setup['lock'];
				if ( this.data[ch] < 2.8 || 4.8 < this.data[ch] ) {
					this.setup['status'] = "Laser is not locked !!!";
				};
			};
		},
		conversion(val) {
			var R1 = 47; var R2 = 33;
			return Number(val * ((R1 + R2)/R2)).toFixed(3);
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
			console.log(str);
			
			downloadCSV(str, name); // Download CSV file
		},
	},
});

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

/* At last, mount the index-app */
IndexTable.mount('#index');
