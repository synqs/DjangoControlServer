/* This is the main app for the detail page - below follow tables for PDmons and Tctrls */
const LaserDetail = Vue.createApp({})

LaserDetail.component('laser', {
	data() { return {
		data : [],
		datas : [],
		setup : {	'status' : 'Trying to connect...', },
		editForm : {},
		}
	},
	compilerOptions: {
		delimiters: ['[[', ']]'],
	},
	props: ['laser'],
	template: `
	<div class="card">
		<div class="card-header text-light bg-dark"><div class="row align-center">
				<div class="col-7">
					<h3>[[ device.fields.name ]]:[[ device.fields.ip ]]</h3>
					<h5>[[ device.fields.description ]]</h5>
				</div>
				<div class="col-5">
					<h6>CSV name : <input v-model="this.setup['name']" placeholder="name for CSV"/>.csv</h6>
					<h6>Next CSV Download : <input class="w-25" v-model="this.setup['save']" placeholder="savetime in 'hh:mm:ss'"/> today</h6>
					<h6>Current Sleeptime : <input class="w-25" v-model="this.setup['sleep']" placeholder="sleeptime in s" v-on:blur="this.stop_device(), this.start_device()"> s</h6>
				</div>
		</div></div>
	</div>
	`,
	mounted () {
	},
	updated () {
	},
	methods: {
		turn_on() {
		},
	},
})

/* At last, mount the detail-app */
LaserDetail.mount('#laser');