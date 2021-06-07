Vue.component('app-test', {
	props: ['todo'],
  	template: `<li>{{ todo.text }}</li>`
});

var app = Vue.createApp({
  data() {
    return {
      devices: [
        { id: 0, name: 'device0' },
        { id: 1, name: 'device1' },
        { id: 2, name: 'device2' }
      ]
    }
  }
}).mount('#app');
