Vue.component('app-test', {
	data: function () {
		return {
			message-test : 'Let's test Vue!'
		}
	},
	template: `
		<p> Why do we do this ? {{ message-test }} </p>
	`,
});

var app = new Vue({
  el: '#app',
});
