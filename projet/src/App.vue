<template>
  <v-app>
    <v-app-bar app src="./assets/food-with-ingredients.jpg" dark>
      <v-btn to="/" text > Home </v-btn>
      <v-spacer></v-spacer>
      <v-btn to="/add" text class="deep-purple mr-2" > Add Restaurant </v-btn>
      <v-btn to="/restaurant" text class="deep-purple"> Detail </v-btn>
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


