<template>
  <div v-if="restaurant">
    <h1>Detail du restaurant qui a pour id : {{ id }}</h1>
    <ul>
      <li>Nom : {{ restaurant.name }}</li>
      <li>Cuisine : {{ restaurant.cuisine }}</li>
      <li>Rue : {{ restaurant.address.street }}</li>
      <li>Code postal : {{ restaurant.address.zipcode }}</li>
      <li>Ville : {{ restaurant.borough }}</li>
    </ul>
    <div style="height: 500px; width: 50%;">
      <l-map
        v-if="showMap"
        :zoom="zoom"
        :center="center"
        :options="mapOptions"
        style="height: 80%;"
        @update:center="centerUpdate"
        @update:zoom="zoomUpdate"
      >
        <l-tile-layer :url="url" :attribution="attribution" />
        <l-marker :lat-lng="withPopup">
          <l-popup>
            <div>I am a restaurant.</div>
          </l-popup>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";

export default {
  name: "Restaurant",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
  },

  props: {},
  computed: {
    id() {
      //this.$route -> acces au information qui sont dans l'url
      //params -> parametre http
      return this.$route.params.id;
    },
  },
  data: function () {
    return {
      restaurant: null,
      zoom: 15,
      center: latLng(47.41322, -1.219482),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright%22%3EOpenStreetMap</a> contributors',
      withPopup: latLng(47.41322, -1.219482),
      currentZoom: 11.5,
      currentCenter: latLng(47.41322, -1.219482),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5,
      },
      showMap: true,
    };
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
  },
  mounted() {
    console.log("Avant affichage, on pourra faire un fetch...");
    console.log("Id = " + this.id);
    let url = "http://localhost:8080/api/restaurants/" + this.id;
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("test" + data.restaurant.name);
        this.restaurant = data.restaurant;
        this.center = latLng(
          data.restaurant.address.coord[1],
          data.restaurant.address.coord[0]
        );
        this.withPopup = latLng(
          data.restaurant.address.coord[1],
          data.restaurant.address.coord[0]
        );
      });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
