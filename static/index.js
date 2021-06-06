Vue.component('app-test', {
	data: function () {
		return {
			message-test : 'Test Vue!'
		}
	},
	template: `
		<p> Why do we do this ? {{ message-test }} </p>
	`,
});

var app = new Vue({
  el: '#app',
});