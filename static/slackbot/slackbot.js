const SlackBot = Vue.createApp({});

SlackBot.component('slackbot', {
	data ()  { return {
		data : {},
		message : "",
		}
	},
	compilerOptions: {
		delimiters: ['[[', ']]'],
	},
	props: ['slackbot'],
	template: `
	
	[[ this.slackbot ]]
	<div class="input-group mb-3">
		<input v-model="message" class="form-control" placeholder="Text to send via SlackBot">
		<button class="btn btn-outline-secondary" v-on:click="this.talk_slackbot()">SEND!</button>
	</div>
	[[ this.data ]]
	`,
	mounted () { 
	},
	methods: {
		talk_slackbot() {
			config = {	method : 'POST',
					url : '/slackbot/' + this.slackbot['name'] + '/send/',
					xsrfCookieName: 'csrftoken',
					xsrfHeaderName: 'X-CSRFTOKEN',
					data : { command :'TALK', message : this.message, }
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
SlackBot.mount('#slackbot');