<!--
const VueTable = Vue.createApp({
	data() { return {
		device_list: [
			{ id : 1, name : yun1, description : the 1jsyun, ip : yun1_ip },
			{ id : 2, name : yun2, description : the 2jsyun, ip : yun2_ip },
			{ id : 3, name : yun3, description : the 3jsyun, ip : yun3_ip },
		] }
	},
	template: `
		<table class="table">
    			<thead><tr>
        			<th>Name</th>
				<th>Status</th>
				<th>IP</th>
      			</tr></thead>
    			<tbody><tr v-for="device in device_list">
        			<td>
					<a href="{% url 'pd_monitor:detail' device.id %}">{{ device.name }}
					<small class="text-muted d-block">{{ device.description }}</small>
				</td>
				<td>0</td>
				<td>{{ device.ip }}</td>
      			</tr></tbody>
  		</table>`,
})


VueTable.mount('#device_index_table')
-->

var device_index = new Vue({
	el: '#device_index_table',
	data: {
		device_list: [
			{ id : 1, name : yun1, description : the 1jsyun, ip : yun1_ip },
			{ id : 2, name : yun2, description : the 2jsyun, ip : yun2_ip },
			{ id : 3, name : yun3, description : the 3jsyun, ip : yun3_ip },
		],
		title : ['index']
	},
})