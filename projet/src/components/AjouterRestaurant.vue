<template>
  <v-container >
    <v-layout row >
      <v-flex >
        <!-- Carte pour effectuer une rechercher ou modifier le nombre d'affichage de restaurant -->
        <v-card class="ma-2" dark>
          <v-card-text>
            <v-row>
              <v-col>
                <v-card-title>
                  <span style="color: white">Fill restaurant informations</span>
                </v-card-title>
              </v-col>
            </v-row>
            <v-form class="px-3" ref="form" @submit.prevent="ajouterRestaurant">
              <v-row class="mx-4">
                <v-col>
                  <v-text-field
                    v-model="name"
                    prepend-icon="mdi-home"
                    label="Name"
                    :rules="[(v) => !!v || 'Required!']"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="cuisine"
                    label="Cook"
                    :rules="[(v) => !!v || 'Required!']"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="borough"
                    label="City"
                    :rules="[(v) => !!v || 'Required!']"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mx-4">
                <v-col>
                  <v-text-field
                    v-model="building"
                    prepend-icon="mdi-home"
                    label="Building"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="street"
                    label="Street"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="zipcode"
                    label="Zipcode"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mx-4">
                <v-col>
                  <v-text-field
                    v-model="longitude"
                    prepend-icon="mdi-home"
                    label="Longitude"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="latitude"
                    label="Latitude"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text to="/"> Cancel </v-btn>
                <v-btn class="mr-5" type="submit" color="success">
                 Send
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data: function () {
    return {
      window: {
        width: 0,
        height: 0,
      },
      restaurants: [],
      name: "",
      cuisine: "",
      building: "",
      address: {},
      street: "",
      zipcode: "",
      coord: [],
      borough: "",
      longitude: "",
      latitude: "",
      post: [],
    };
  },
  mounted() {
    console.log("AVANT RENDU HTML"),
      //this.restaurants = []
      window.addEventListener("resize", this.handleResize),
      this.handleResize(),
      console.log(this.window);
  },
  methods: {
    ajouterRestaurant() {
      this.coord[0]=this.longitude
      this.coord[1]=this.latitude
      this.address.building = this.building
      this.address.street = this.street
      this.address.zipcode = this.zipcode
      this.address.coord = this.coord

      let data = {
        name: this.nom,
        cuisine: this.cuisine,
        address: this.address,
        borough: this.borough,
      };
      console.log(data);

      let url = "http://localhost:8080/api/restaurants/";

      if (this.nom !== "" && this.cuisine !== "" && this.borough !== "") {
        axios
          .post(url, {
            body: data,
          })
          .then((response) => {
            // JSON responses are automatically parsed.
            console.log(response.msg);
          })
          .catch((e) => {
            this.errors.push(e);
          });
      } else {
        window.alert("Make sure that you have filled in all the necessary fields ");
      }
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight * 0.8;
      //console.log('taille '+this.window.height)
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
