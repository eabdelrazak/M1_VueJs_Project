<template>
  <v-container>
    <v-layout row wrap>
      <v-flex>
        <v-row>
          <v-col cols="6">
            <v-card class="mx-auto">
              <v-img height="250" :src='getImage()'></v-img>
              <v-row no-gutters class="mb-n4" align="center">
                <v-col cols="10">
                  <v-card-title v-if="restaurant">{{
                    restaurant.name
                  }}</v-card-title>
                </v-col>
                <v-col cols="2">
                  <v-dialog v-model="dialog" persistent max-width="600px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn style="width: 90%" small v-bind="attrs" v-on="on">
                        <v-icon small>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">Restaurant Information</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="nomEdit"
                                label="Restaurant name*"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="cuisineEdit"
                                label="Type of cooking*"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="boroughEdit"
                                label="Legal last name*"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="buildingEdit"
                                label="Building*"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="zipcodeEdit"
                                label="Zipcode*"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="streetEdit"
                                label="Street*"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="latitudeEdit"
                                label="Latitude*"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="longitudeEdit"
                                label="Longitude*"
                                required
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                        <small>*indicates required field</small>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="dialog = false"
                        >
                          Close
                        </v-btn>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click.prevent="updateRestaurant"
                        >
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>

              <v-card-text>
                <v-row align="center" class="ml-n1">
                  <v-rating
                    :value="notes[randomGrade]"
                    color="amber"
                    dense
                    half-increments
                    readonly
                    size="14"
                  ></v-rating>
                  <div class="success--text ml-4">
                    {{ notes[randomGrade] }} (413)
                  </div>
                  <div
                    class="ml-4"
                    v-if="this.grades !== '' && this.grades !== null"
                  >
                    Grade {{ this.grades }} Restaurant
                  </div>
                  <div class="ml-4" v-else>No Grade</div>
                </v-row>

                <div class="my-4 subtitle-1" v-if="restaurant">
                  $ • {{ restaurant.cuisine }}
                </div>
                <v-divider class="mx-4"></v-divider>
                <!-- Génère un trait séparateur -->
                <div>
                  {{ descriptions[randomDescription] }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card dark justify-center>
              <div class="subtitle-2 ml-2">
                <div
                  class="infomap"
                  v-if="this.street !== '' && this.street !== null"
                >
                  {{ this.street }} •
                </div>
                <div class="infomap" v-else>Street Undefined •</div>
                <div
                  class="infomap"
                  v-if="this.zipcode !== '' && this.zipcode !== null"
                >
                  {{ this.zipcode }} •
                </div>
                <div class="infomap" v-else>Zipcode Undefined •</div>
                <div
                  class="infomap"
                  v-if="this.borough !== '' && this.borough !== null"
                >
                  {{ this.borough }}
                </div>
                <div class="infomap" v-else>City Undefined</div>
              </div>
              <v-divider class="mx-4"></v-divider>
              <div style="height: 400px" v-if="restaurant">
                <l-map
                  v-if="showMap"
                  :zoom="zoom"
                  :center="center"
                  :options="mapOptions"
                  style="height: 100%; z-index: 1"
                  @update:center="centerUpdate"
                  @update:zoom="zoomUpdate"
                >
                  <l-tile-layer :url="url" :attribution="attribution" />
                  <l-marker :lat-lng="withPopup">
                    <l-popup>
                      <div>{{ restaurant.name }} {{ restaurant.borough }}</div>
                    </l-popup>
                  </l-marker>
                </l-map>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
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
  computed: {
    id() {
      //this.$route -> acces au information qui sont dans l'url
      //params -> parametre http
      return this.$route.params.id;
    },
    randomDescription: function () {
      const random = Math.floor(Math.random() * this.descriptions.length);
      return random;
    },
    randomPicture: function () {
      const random = Math.floor(Math.random() * this.pictures.length);
      return random;
    },
    randomGrade: function () {
      const random = Math.floor(Math.random() * this.notes.length);
      return random;
    },
  },
  data() {
    return {
      addr: "",
      nom: "",
      cook: "",
      building: "",
      street: "",
      zipcode: "",
      borough: "",
      longitude: 6.9531331000000005,
      latitude: 43.6464916,
      grades: "",
      grade: "",
      descriptions: [
        "Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio seating",
        "Gastronomic restaurant with sea view offers a chic setting with its Art Deco frescoes and mirrors.",
        "Fine seasonal southern cuisine in the old-fashioned charming rooms of a former school or on the tree-lined terrace.",
        "Brasserie-style menu in a designer decor with a glossy white ceiling and karaoke nights at weekends.",
        "Regional cuisine to be tasted in a bright and refined room or in a Provencal patio with stone walls.",
      ],
      pictures: [
        'photo1.jpg',
        'photo2.jpg',
        'photo3.jpg',
        'photo4.jpg'
      ],
      dialog: false,
      notes: [2, 2.5, 3, 3.5, 4, 4.5, 5],
      restaurant: null,
      zoom: 15,
      center: latLng(43.6464916, 6.9531331000000005),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright%22%3EOpenStreetMap</a> contributors',
      withPopup: latLng(43.6464916, 6.9531331000000005),
      currentCenter: latLng(43.6464916, 6.9531331000000005),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5,
      },
      showMap: true,
      nomEdit: "",
      cuisineEdit: "",
      boroughEdit: "",
      buildingEdit: "",
      streetEdit: "",
      longitudeEdit: "",
      latitudeEdit: "",
      zipcodeEdit: "",
    };
  },
  methods: {
    updateRestaurant() {
      console.log(this.nomEdit);
      let myData = new FormData();

      if (this.nomEdit != "" || this.nomEdit != "")
        myData.append("name", this.nomEdit);
      if (this.cuisineEdit != "" || this.cuisineEdit != "")
        myData.append("cuisine", this.cuisineEdit);
      if (this.boroughEdit != "" || this.boroughEdit != "")
        myData.append("borough", this.boroughEdit);
      if (this.building != "" || this.building != "")
        myData.append("building", this.buildingEdit);
      if (this.streetEdit != "" || this.streetEdit != "")
        myData.append("street", this.streetEdit);
      if (this.longitudeEdit != "" || this.longitudeEdit != "") {
        console.log("test");
        myData.set("longitude", this.longitudeEdit);
        console.log(myData.longitude);
      }
      if (this.latitudeEdit != "" || this.latitudeEdit != "")
        myData.append("latitude", this.latitudeEdit);
      if (this.zipcodeEdit != "" || this.zipcodeEdit != "")
        myData.append("zipcode", this.zipcodeEdit);

      console.log(this.longitudeEdit);

      let myUrl =
        "http://localhost:8080/api/restaurants/" + this.restaurant._id;

      axios({
        method: "put",
        url: myUrl,
        data: myData,
      })
        .then((response) => {
          console.log(response);
          console.log(response.data);
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    submit() {
      console.log(this.nomEdit);
    },
    getImage() {
      let images = require.context('../assets/', false, /\.jpg$/)
      return images('./'+this.pictures[this.randomPicture])
    },
  },
  mounted() {
    console.log("Avant affichage, on pourra faire un fetch...");
    //console.log("Id = " + this.id);
    let url = "http://localhost:8080/api/restaurants/" + this.id;

    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.restaurant = data.restaurant;
        this.addr = data.restaurant.address;
        this.nom = this.restaurant.name;
        this.cook = this.restaurant.cuisine;
        this.borough = this.restaurant.borough;

        this.street = this.restaurant.address.street;
        this.building = this.restaurant.address.building;
        this.zipcode = this.restaurant.address.zipcode;
        this.grades = this.restaurant.grades[0].grade;

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
<style>
.infomap {
  display: inline-block;
  padding-left: 5px;
}
</style>
