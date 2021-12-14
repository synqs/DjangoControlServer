const MokugoDetail = Vue.createApp({});

MokugoDetail.component('mokugo', {
	data ()  { return {data : [],
		datas : [],
		setup : {	'status' : 'Trying to connect...', 'sleep' : '10', 'save' : 'never', 'name' : 'test'},
		key : {},
		config : [],
		editForm : {},
		}
	},
	props : ['mokugo'],
	compilerOptions: {
		delimiters: ['[[', ']]'],
	},
	template: `
	<div class="row mb-3 align-middle">
		<div class="col"><div class="card">
			<div class="card-header text-light bg-dark"><div class="row align-center">
				<div class="col-7">
					<h3>[[ mokugo.name ]]:[[ mokugo.ip ]]</h3>
					<h5>[[ mokugo.description ]]</h5>
				</div>
				<div class="col-5">
					<h6>CSV name : <input v-model="this.setup['name']" placeholder="name for CSV"/>.csv</h6>
					<h6>Next CSV Download : <input v-model="this.setup['save']" placeholder="savetime in 'hh:mm:ss'"/></h6>
					<h6>Current Sleeptime : <input class="w-25" v-model="this.setup['sleep']" placeholder="sleeptime in s" v-on:blur="this.stop_mokugo(), this.start_mokugo()"> s</h6>
				</div>
			</div></div>
		</div></div>
		<div class="col align-middle">
			<div class="alert alert-info text-center mb-2" role="alert">[[ this.setup['status'] ]]</div>
			
			<div class="btn-group w-100">
			<button class="btn btn-success" data-bs-toggle="button" autocomplete="off" v-on:click="start_mokugo()">start</button>
			<button class="btn btn-danger" v-on:click="stop_mokugo()">stop</button>
			<button class="btn btn-secondary" v-on:click="get_mokugo()">get</button>
			<button class="btn btn-primary" v-on:click="get_CSV()">export as CSV</button>
			<button class="btn btn-warning" v-on:click="this.reset()">reset</button>
			</div>
		</div>
	</div>
	
	<div class="table-responsive" style="height: 650px;"><table class="table table-striped mh-100">
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
	</table></div>
	`,
	mounted () {
		this.get_mokugo();
	},
	methods: {
		start_mokugo() { // start fetching data every dt = sleeptime
			this.switch = true;
			this.timer = setInterval(()=>{this.get_mokugo()}, 1000*this.setup['sleep']);
		},
		stop_mokugo() { // stop fetching data
			clearInterval(this.timer);
		},
		get_mokugo() {
			config = {	method : 'GET',
					url : '/mokugo/' + this.mokugo['name'] + '/data/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
			};
			axios(config)
				.then(response => {
					console.log(response.data);
					this.setup['status'] = response.data['message'];
					this.data = response.data['value'];
					this.datas.unshift(this.data);
				})
				.catch(error => {console.log(error);});
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
});

/* At last, mount the slackbot-app */
MokugoDetail.mount('#mokugo');

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
