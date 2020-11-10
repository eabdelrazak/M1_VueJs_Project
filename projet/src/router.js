import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import ListeDesRestaurant from './components/ListeDesRestaurant.vue'
import Acceuil from './components/Acceuil'
import Restaurant from './components/Restaurant.vue'

// Définition des routes
export default new Router ({
  routes: [
    {
      // page d'acceuil
      path: '/', 
      component: Acceuil
    },
    {
      path: '/restaurant/:id', //:id -> dans le chemin il va y avoir un parametre qui s'appelle id
      component: Restaurant
    },
    {
       path: '/add',
       component: ListeDesRestaurant
    }
  ],
  mode : 'history',
})