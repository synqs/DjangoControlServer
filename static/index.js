var myObject = new Vue({
    	el: '#app',
    	data: { message : "JS imported" },
	delimiters: ['[[', ']]']
});

/*
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
const apptest = new Vue(ComponentsApp)

apptest.component('todo-item', {
  props: ['todo'],
  template: `<li>{{ todo.text }}</li>`
});

apptest.mount('#components-app');
