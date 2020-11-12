<template>
  <v-container fluid>
    <v-layout row>
      <v-flex md4 class="px-2">
        <!-- Carte pour effectuer une rechercher ou modifier le nombre d'affichage de restaurant -->
        <v-card class="ma-2" dark>
          <v-card-text>
            <v-row>
              <v-col>
                <v-card-title class="justify-center">
                  <span style="color: white">Restaurant</span>
                </v-card-title>
              </v-col>
            </v-row>
            <v-row class="mx-4">
              <v-col>
                <v-text-field
                  v-model="nomRecherche"
                  append-icon="mdi-magnify"
                  label="Search a restaurant"
                  single-line
                  hide-details
                  @input="this.getRestaurants"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mx-4">
              <v-col>
                <v-select
                  v-model="valeurNombreLigne"
                  :items="this.pageItems"
                  label="Restaurant per page"
                  @input="this.getRestaurants"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Pagination -->

        <v-row>
          <v-col>
            <v-pagination
              v-model="pagination"
              :length="this.nbPageTotal"
              total-visible="7"
              dark
              color="deep-purple"
              @input="gestionChangementPage"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-flex>

      <v-flex md8>
        <v-card class="ma-2">
          <!-- Génère un loader pendant le temps de chargement de la base de données dans le tableau -->
          <!--<v-data-table
          v-if="restaurants.length < 1"
            loading
            loading-text="Veuillez patienter le contenu se charge..."
            :hide-default-footer="true"
          ></v-data-table> -->
          <!-- Permet d'afficher le tableau avec les différents éléments récupérer dans la base de données -->
          <div v-if="!ready">
            <v-data-table
              loading
              loading-text="Please wait for the content to load..."
              :hide-default-footer="true"
            ></v-data-table>
          </div>
          <div v-else-if="!this.restaurants.length">
            <v-simple-table fixed-header :height="this.window.height">
              <thead>
                <tr>
                  <th class="text-left font-weight-bold">Name</th>
                  <th class="text-left font-weight-bold">Cook</th>
                  <th class="text-left font-weight-bold">City</th>
                  <th class="text-left font-weight-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td width="30%">No Data Found</td>
                  <td width="30%"></td>
                  <td width="25%"></td>
                  <td width="15%"></td>
                </tr>
              </tbody>
            </v-simple-table>
          </div>
          <div v-else>
            <v-simple-table fixed-header :height="this.window.height">
              <thead>
                <tr>
                  <th class="text-left font-weight-bold">Name</th>
                  <th class="text-left font-weight-bold">Cook</th>
                  <th class="text-left font-weight-bold">City</th>
                  <th class="text-left font-weight-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in restaurants" :key="index">
                  <td width="30%">{{ item.name }}</td>
                  <td width="30%">{{ item.cuisine }}</td>
                  <td width="25%">{{ item.borough }}</td>
                  <td width="15%" class="pa-0">
                    <v-icon
                      small
                      class="mr-4"
                      @click="supprimerRestaurant(item)"
                      >mdi-delete</v-icon
                    >
                    <router-link :to="'/detail/' + item._id"
                      ><v-icon small> mdi-loupe</v-icon></router-link
                    >
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import _ from "lodash";

export default {
  name: "Acceuil",
  mounted() {
    console.log("AVANT RENDU HTML"),
      window.addEventListener("resize", this.handleResize),
      this.handleResize(),
      this.getRestaurantsFromServer();
  },
  data() {
    return {
      window: {
        width: 0,
        height: 0,
      },
      ready: false,
      pageItems: [10, 20, 30, 40, 50, 100, 500],
      nbRestaurantTotal: 0,
      nbPageTotal: 0,
      valeurNombreLigne: 10,
      pageCourante: 0,
      restaurants: [],
      nom: "",
      cuisine: "",
      nomRecherche: "",
      pagination: 1,
    };
  },
  methods: {
    getRestaurants: _.debounce(function () {
      this.getRestaurantsFromServer();
    }, 300),
    getRestaurantsFromServer() {
      let url =
        "http://localhost:8080/api/restaurants" +
        "?page=" +
        this.pageCourante +
        "&pagesize=" +
        this.valeurNombreLigne +
        "&name=" +
        this.nomRecherche;

      axios
        .get(url)
        .then((response) => {
          // JSON responses are automatically parsed.
          console.log(response.status);
          this.restaurants = response.data.data;
          this.nbRestaurantTotal = response.data.count;
          console.log(this.nbRestaurantTotal);
          this.nbPageTotal = Math.ceil(
            this.nbRestaurantTotal / this.valeurNombreLigne
          );
          this.ready = true;
          console.log(response.data);
          console.log(response.data.data);
          console.log(response.data.data[0].grades[0]);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    supprimerRestaurant(r) {
      //this.restaurants.splice(index, 1);
      let url = "http://localhost:8080/api/restaurants/" + r._id;

      axios
        .delete(url, {})
        .then((response) => {
          // JSON responses are automatically parsed.
          console.log(response.msg);
          this.getRestaurantsFromServer();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight * 0.8;
      //console.log('taille '+this.window.height)
    },
    gestionChangementPage(value) {
      this.pagination = value;
      this.pageCourante = value - 1;
      this.getRestaurantsFromServer();
    },
    handleLastPage() {
      let url =
        "http://localhost:8080/api/restaurants" + "?page=" + this.nbPageTotal;
      console.log(url);

      axios
        .get(url)
        .then((response) => {
          if (response.data.data.length == 0) {
            this.nbPageTotal--;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
<style>
a {
  text-decoration: none;
}
</style>
