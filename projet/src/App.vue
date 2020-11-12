<template>
  <v-app>
    <v-app-bar app src="./assets/food-with-ingredients.jpg" dark dense >
      <v-btn to="/" text > Home </v-btn>
      <v-spacer></v-spacer>
      <v-btn to="/add" text class="deep-purple mr-2" > Add Restaurant </v-btn>
    </v-app-bar>
    <v-main>
      <!-- affiche ce qui correspond à l'url -->
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    //
  }),
};
</script>


