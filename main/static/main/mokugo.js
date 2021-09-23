const MokugoDetail = Vue.createApp({});

MokugoDetail.component('slackbot', {
	data ()  { return {
		data : { 'message' : '',},
		}
	},
	compilerOptions: {
		delimiters: ['[[', ']]'],
	},
	template: `
	[[ this.data['message'] ]]
	
	<div class="input-group mb-3">
		<input v-model="message" class="form-control" placeholder="Text to send via SlackBot">
		<button class="btn btn-outline-secondary" v-on:click="this.get_mokugo()">SEND!</button>
	</div>
	[[ this.data ]]
	`,
	mounted () { 
	},
	methods: {
		get_mokugo() {
			ip = '129.206.180.142'
			config = {	method : 'POST',
					url : '/mokugo/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : { 'ip' : ip }
			};
			axios(config)
				.then(response => {
					console.log(response.data);
					this.data = response.data;
					this.message = response.data['message']
				})
				.catch(error => {console.log(error);});
		},
	},
});

/* At last, mount the slackbot-app */
MokugoDetail.mount('#mokugo');