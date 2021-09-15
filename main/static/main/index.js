const IndexTable = Vue.createApp({});

IndexTable.component('index-table', {
	data ()  { return {
		status : { global : "Connecting to devices..." },
		config : {},
		addForm : {},
		overview : {},
		}
	},
	compilerOptions: {
		delimiters: ['[[', ']]'],
	},
	props: ['devices'],
	template: `
	
	<div class="alert alert-info alert-dismissible fade show" role="alert">
		[[ this.status['global'] ]]
		<!-- button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button -->
	</div>
	
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
	
	<table class="table table-striped">
		<thead class="table-dark">
			<tr>
			<th>Name</th>
			<th>Description</th>
			<th>IP</th>
			<th style="width: 250px; ">Status</th>
			<th colspan=2></th>
			</tr>
		</thead>
		<tbody><tr v-for="device in this.devices">
			<td><a v-bind:href="'/' + device.model + '/' + device.pk + '/'">[[ device.fields.name ]]</a></td>
			<td>[[ device.fields.description ]]</td>
			<td>[[ device.fields.ip ]]</td>
			<td>[[ this.status[device.fields.name] ]]</td>
			<td><button class="btn btn-warning" v-on:click="remove_device(device)">Remove</button></td>
			<td><div class="form-check form-switch">
  				<input class="form-check-input" type="checkbox" v-model="this.overview[this.devices.indexOf(device)]">
  			</div></td>
		</tr></tbody>
	</table>
	
	<div class="row">
		<div class="col-4" v-for="index in Object.keys(this.overview).filter(dev => this.overview[dev])">
			<overview_card v-bind:device="this.devices[index]"></overview_card>
		</div>
	</div>
	`,
	mounted () {
		this.init_index();
	},
	methods: {
		init_index() {
			for (dev in this.devices) {
				this.init_device(this.devices[dev]);
			};
		},
		add_device() {
			console.log(this.addForm); console.log(typeof(this.addForm));
			config = this.config;
			config['data'][0] = 'ADD';
			config['data'][1] = this.addForm;
			console.log(config);
			axios(config)
				.then(response => {
					//console.log(response.data);
					this.status['global'] = response.data['message']; })
				.catch(error => {
					this.status['global'] = error;
					console.log(error);
				});
		},
		init_device(device) {
			payload = { 'model' : device['model'], 'pk' : device['pk'] };
			config = {	method : 'POST',
					url : '/device/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : ['STATUS', payload] };
			this.config = config;
			axios(config)
				.then(response => { 
					this.status[device['fields']['name']] = response.data['message'];
					this.status['global'] = "All devices ready!";
				})
				.catch(error => {
					this.status[device['fields']['name']] = error;
					this.status['global'] = "There was an error...";
					console.log(error);
				});
		},
		remove_device() {
			config = this.config;
			config['data'][0] = 'DELETE';
			console.log(config)
			axios(config)
				.then(response => {
					console.log(response);
					this.status = response.data['message'];
				})
				.catch(error => {
					this.status['global'] = error;
					console.log(error);
				});
		},
		/* currently not in use
		detail_device() {
			//window.location.replace('/device/');
			
			config = this.config;
			config['data'][0] = 'DETAIL';
			axios(config)
				.then(response => {
					console.log(response); 
					//this.detail = response.data; 
					})
				.catch(error => console.log(error));
		}, */
		overview_device(device) {
			var index = this.overview.indexOf(device);
			if (index !== -1) {
    				this.overview.splice(index, 1);
			}
			else {
				this.overview.push(device);
			}
		},
	},
});

IndexTable.component('overview_card', {
	data () { return {
		data : [],
		datas : [],
		setup : {	'status' : 'Trying to connect...', 'sleep' : '5', 'save' : '00:00:00', 'name' : 'test',
					'convert' : {}, 'lock' : ''},
		key : {},
		config : [],
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
					<h5>[[ device.fields.name ]]:</h5><h5>[[ device.fields.ip ]]</h5>
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
		this.init_device();
	},
	updated () { // export data every new day automatically
		var now = this.data['updated'].slice(11,19);
		var save = this.setup['save'].slice(0,7);
		if (now.slice(0,7) == save && parseInt(now.slice(-1)) < parseInt(this.setup['sleep'])) {
			this.get_CSV();
			this.datas = [];
		}
		
		this.is_locked();
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
					this.data = response.data['value'];
					this.setup['status'] = response.data['message'];
					this.setup['name'] = this.device.fields.name + '_' + this.data['updated'].slice(0,10);
					this.key = response.data['keys'];
				})
				.catch(error => {
					this.setup['status'] = error;
					console.log(error);
				});
		},
		start_device() { // start fetching data every dt = sleeptime
			this.switch = true;
			this.timer = setInterval(()=>{this.get_device()}, 1000*this.setup['sleep']);
		},
		stop_device() { // stop fetching data
			clearInterval(this.timer);
		},
		get_device() { // fetch a single set of data directly from arduino (axios)
			config = this.config;
			config['data'][0] = 'DATA';
			axios(config)
				.then(response => {
					for ( k in Object.keys(this.setup['convert']) ) {
						ch = Object.keys(this.setup['convert'])[k];
						response.data['value'][ch] = this.conversion(response.data['value'][ch]);
					}
					
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
				console.log('yes');
				if ( this.data[ch] < 2.8 || 4.8 < this.data[ch] ) {
					this.setup['status'] = "Laser is not locked !!!";
					
					Email.send({
							SecureToken : "950c40cc-2103-4fb0-a64c-2c732ae8fb81",
							//Host: "smtp.gmail.com",
							//Username : "naka.labpc@gmail.com",
							//Password : "nakaramen",
							To: 'klara101klaro@gmail.com',
							From: "naka.labpc@gmail.com",
							Subject: "NAKA",
							Body: "Laser is not locked !!!",})
						.then(function (message) {
							alert("mail sent successfully")
						});
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
