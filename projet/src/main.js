import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import ListeDesRestaurant from './components/ListeDesRestaurant.vue'
import HelloWorld from './components/HelloWorld'

Vue.config.productionTip = false
Vue.use(VueRouter);

// Définition des routes
const router = new VueRouter ({
  routes: [
    {
      // page d'acceuil
      path: '/', 
      component: ListeDesRestaurant
    },
    {
       path: '/hello',
       component: HelloWorld,
       props: {
         msg : "Coucou la Miage"
       }
    }
  ],
  mode : 'history'
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
