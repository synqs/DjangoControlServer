const DetailTable = Vue.createApp({})

DetailTable.component('detail-table', {
	data() { return {
		dev : [],
		}
	},
	props: ['device', 'm', 'pk'],
	template: `
	device = {{ device }}
	props = {{ pk }} {{ m }}
	<div class="card mb-3 card-xxl">
			<div class="card-header text-light bg-dark">
				<h4>{{ device.fields.name }} : {{ device.fields.description }}</h4>
			</div>
			<div class="card-body text-dark bg-light">
				IP : {{ device.fields.ip }}, Sleeptime : {{ device.fields.sleeptime }} s
			</div>
	</div>
	`,
	mounted () {
		// this.get_device()
	},
	methods : {
		get_device() { // fetch a single set of data directly from arduino (axios)
		config = {	method : 'POST',
				url : '/' + this.m + '/',
				xsrfCookieName: 'csrftoken',
				xsrfHeaderName: 'X-CSRFTOKEN',
				data : [this.pk, 'STATUS'] };
		axios(config)
			.then(response => {
				console.log(response);
				this.device = response.data; })
			.catch(error => console.log(error));
		},
	},
})

DetailTable.mount('#devicedetail')
