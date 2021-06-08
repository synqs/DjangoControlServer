var myObject = new Vue({
    	el: '#app',
    	data: {
		devices: [
        		{ id: 0, name: 'device0' },
        		{ id: 1, name: 'device1' },
        		{ id: 2, name: 'device2' }
      		]
	},
	delimiters: ['[[', ']]']
});

const ComponentsApp = {
  data() {
    return {
      groceryList: [
        { id: 0, text: 'Vegetables' },
        { id: 1, text: 'Cheese' },
        { id: 2, text: 'Whatever else humans are supposed to eat' }
      ]
    }
  }
};

const apptest = Vue.createApp(ComponentsApp)

app.component('todo-item', {
  props: ['todo'],
  template: `<li>{{ todo.text }}</li>`
});

apptest.mount('#components-app');