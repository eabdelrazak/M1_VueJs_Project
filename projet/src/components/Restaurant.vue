<template>
  <div v-if="restaurant">
    <h1>Detail du restaurant qui a pour id : {{id}}</h1>
    <ul>
        <li>Nom : {{restaurant.name}}</li>
        <li>Cuisine : {{restaurant.cuisine}}</li>
        <li>Rue : {{restaurant.address.street}}</li>
        <li>Code postal : {{restaurant.address.zipcode}}</li>
        <li>Ville : {{restaurant.borough}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Restaurant',
  props: {
  },
  computed: {
      id() {
          //this.$route -> acces au information qui sont dans l'url
          //params -> parametre http
          return this.$route.params.id
      }
  },
  data: function(){
      return { 
          restaurant: null
      }
  },
  mounted() {
      console.log("Avant affichage, on pourra faire un fetch...");
      console.log("Id = " + this.id)
      let url = "http://localhost:8080/api/restaurants/" + this.id;
      fetch(url).then(response => {
          return response.json();
      }).then(data => {
          console.log("test"+data.restaurant.name)
          this.restaurant = data.restaurant;
      })
  },
  methods : {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
