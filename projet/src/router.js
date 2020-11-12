import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import AjouterRestaurant from './components/AjouterRestaurant.vue'
import Acceuil from './components/Acceuil'
import Detail from './components/Detail.vue'

// Définition des routes
export default new Router ({
  routes: [
    {
      // page d'acceuil
      path: '/', 
      component: Acceuil
    },
    {
      path: '/detail/:id', //:id -> dans le chemin il va y avoir un parametre qui s'appelle id
      component: Detail
    },
    {
       path: '/add',
       component: AjouterRestaurant
    }
  ],
  mode : 'history',
})