<template>
  <div id="app">
    <!-- router-link va afficher dans la page une nav bar-->
    <router-link to="/">[Home]</router-link>
    <router-link to="/restaurant">[Detail d'un restaurant]</router-link>
    <router-link to="/hello">[HelloWorld]</router-link>

    <!-- affiche ce qui correspond à l'url -->
    <router-view></router-view> 
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
