<template>
  <v-container>
    <v-layout row wrap>
      <v-flex>
        <v-row>
          <v-col cols="6">
            <v-card class="mx-auto">
              <v-img height="250" src="../assets/photo1.jpg"></v-img>

              <v-row no-gutters class="mb-n4" align="center">
                <v-col cols="6">
                  <v-card-title v-if="restaurant">{{
                    restaurant.name
                  }}</v-card-title>
                </v-col>
                <v-col cols="6">
                  <v-dialog v-model="dialog" max-width="400px">
                    <template dark v-slot:activator="{ on, attrs }">
                      <v-btn small v-bind="attrs" v-on="on" class="ml-8">
                        <v-icon small>mdi-pencil</v-icon>Edit information
                      </v-btn>
                    </template>
                    <v-card style="border: solid 5px" v-if="restaurant">
                      <v-card-title>
                        <span class="headline">{{ this.restaurant.name }}</span>
                      </v-card-title>
                      <v-form
                        class="px-3"
                        ref="form"
                        @submit.prevent="updateRestaurant"
                      >
                        <v-row class="mx-4">
                          <v-col>
                            <v-text-field
                              v-model="this.nom"
                              prepend-icon="mdi-home"
                              label="Name"
                              :rules="[(v) => !!v || 'Required!']"
                              hide-details
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              v-model="this.cook"
                              label="Cook"
                              :rules="[(v) => !!v || 'Required!']"
                              hide-details
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              v-model="this.borough"
                              label="City"
                              :rules="[(v) => !!v || 'Required!']"
                              hide-details
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row class="mx-4">
                          <v-col>
                            <v-text-field
                              v-model="this.building"
                              prepend-icon="mdi-home"
                              label="Building"
                              :rules="[(v) => !!v || 'Required!']"
                              hide-details
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              v-model="this.street"
                              label="Street"
                              :rules="[(v) => !!v || 'Required!']"
                              hide-details
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              v-model="this.zipcode"
                              label="Zipcode"
                              :rules="[(v) => !!v || 'Required!']"
                              hide-details
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row class="mx-4">
                          <v-col>
                            <v-text-field
                              v-model="this.latitude"
                              prepend-icon="mdi-home"
                              :rules="[(v) => !!v || 'Required!']"
                              label="Latitude"
                              hide-details
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              v-model="this.longitude"
                              label="Longitude"
                              :rules="[(v) => !!v || 'Required!']"
                              hide-details
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text to="/"> Cancel </v-btn>
                <v-btn class="mr-5" type="submit" color="success"> Send </v-btn>
              </v-card-actions>
                      </v-form>
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
                          @click="
                            dialog = false;
                          "
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
                  <div class="ml-4" v-if="restaurant.grades[0]">
                    Grade {{ this.restaurant.grade[0].grade }} Restaurant
                  </div>
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
              <div class="subtitle-2 ml-2" v-if="restaurant.address">
                {{ this.street }},
                {{ this.zipcode }} {{ this.borough }}
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
      addr:"",
      nom: "",
      cook: "",
      building: "Building",
      street: "Street",
      zipcode: "00000",
      borough: "Ville",
      longitude: 6.9531331000000005,
      latitude: 43.6464916,
      grade:"",
      descriptions: [
        "Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio seating",
        "Gastronomic restaurant with sea view offers a chic setting with its Art Deco frescoes and mirrors.",
        "Fine seasonal southern cuisine in the old-fashioned charming rooms of a former school or on the tree-lined terrace.",
        "Brasserie-style menu in a designer decor with a glossy white ceiling and karaoke nights at weekends.",
        "Regional cuisine to be tasted in a bright and refined room or in a Provencal patio with stone walls.",
      ],
      pictures: [
        "../assets/photo1.jpg",
        "../assets/photo2.jpg",
        "../assets/photo3.jpg",
        "../assets/photo4.jpg",
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
      currentZoom: 11.5,
      currentCenter: latLng(43.6464916, 6.9531331000000005),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5,
      },
      showMap: true,
    };
  },
  methods: {
    updateRestaurant() {
      let myData = new FormData();

      myData.set("name", this.nom);
      myData.append("cuisine", this.cook);
      myData.append("borough", this.borough);
      myData.append("building", this.building);
      myData.append("street", this.street);
      myData.append("longitude", this.longitude);
      myData.append("latitude", this.latitude);
      myData.append("zipcode", this.zipcode);

      //console.log(data);

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
        this.restaurant = data.restaurant;
        this.addr = data.restaurant.address
        this.nom = this.restaurant.name
        this.cook = this.restaurant.cuisine
        this.borough = this.restaurant.borough
        
        this.street = this.restaurant.address.street
        this.building = this.restaurant.address.building
        this.zipcode = this.restaurant.address.zipcode
  

        console.log(this.latitude)
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
