const MokugoDetail = Vue.createApp({});

MokugoDetail.component('mokugo', {
	data ()  { return {
		data : { 'message' : '',},
		}
	},
	props : ['mokugo'],
	compilerOptions: {
		delimiters: ['[[', ']]'],
	},
	template: `
	[[ this.data['message'] ]]
	[[ this.mokugo ]]
	
	<div class="mb-3 text-center">
		<button class="btn btn-outline-secondary" v-on:click="this.get_mokugo()">Mokugo!</button>
	</div>
	[[ this.data ]]
	`,
	mounted () { 
	},
	methods: {
		get_mokugo() {
			ip = '129.206.180.142'
			config = {	method : 'POST',
					url : '/mokugo/' + this.mokugo.fields['name'] + '/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : { 'ip' : ip, 'command' : 'DATA', }
			};
			axios(config)
				.then(response => {
					console.log(response.data);
					this.data = response.data;
				})
				.catch(error => {console.log(error);});
		},
		exit_mokugo() {
			ip = '129.206.180.142'
			config = {	method : 'POST',
					url : '/mokugo/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : { 'ip' : ip, 'command' : 'EXIT', }
			};
			axios(config)
				.then(response => {
					console.log(response.data);
					this.data = response.data;
				})
				.catch(error => {console.log(error);});
		},
	},
});

/* At last, mount the slackbot-app */
MokugoDetail.mount('#mokugo');