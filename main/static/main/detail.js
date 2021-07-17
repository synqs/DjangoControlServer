const DetailTable = Vue.createApp({})

DetailTable.component('detail-table', {
	props: ['device'],
	delimiters: ['[[', ']]'],
	template: `
	<table class="table table-striped">
		<thead class="thead-dark">
			<tr>
			<th colspan=5><h4>[[ device.fields.name ]] :</h4> [[ device.fields.description ]]</th>
			<th>IP : [[ device.fields.ip ]]</th>
			<th>Sleeptime : [[ device.fields.sleeptime ]] s</th>
			<th>Status : online</th>
			<th>Owner : nakalab</th>
			<th>
				<button class="btn btn-warning" v-on:click="remove()">remove</button>
			</th>
			</tr>
		</thead>
	</table>
	`,
	methods: {
		remove() {
			config = {	method : 'DELETE',
						url : '/pdmon/' + this.device.pk,
						xsrfCookieName: 'csrftoken',
						xsrfHeaderName: 'X-CSRFTOKEN',
						data : this.device };
			axios(config)
				.then(response => console.log(response))
				.catch(error => console.log(error));
		},
	},
})

DetailTable.mount('#devicedetail')