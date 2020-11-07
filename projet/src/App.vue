<template>
  <div id="app">
    <ListeDesRestaurant msg="Coucou"/>
  </div>
</template>

<script>
import ListeDesRestaurant from './components/ListeDesRestaurant.vue'

export default {
  name: 'App',
  components: {
    ListeDesRestaurant
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
