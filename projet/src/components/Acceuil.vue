<template>
  <div>
    <v-container fluid>
      <v-layout row>
        <v-flex md4>
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

            <!--<v-form
              class="px-3"
              ref="form"
              @submit.prevent="ajouterRestaurant"
              lazy-validation
            >
              <v-card-text>
                <v-row class="mb-n10">
                  <v-col>
                    <v-text-field v-model="nom" label="Nom" required />
                  </v-col>
                </v-row>
                <v-row class="mb-n10">
                  <v-col>
                    <v-text-field v-model="cuisine" label="Cuisine" required />
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="hide()"> Cancel </v-btn>
                <v-btn class="mr-5" type="submit" color="success">
                  Valider
                </v-btn>
              </v-card-actions>
            </v-form>-->
          </v-card>

          <!-- Pagination -->
          <div class="text-center pt-2">
            <v-pagination
              v-model="pageCourante"
              :length="this.nbPageTotal"
              circle
              @input="gestionChangementPage"
            ></v-pagination>
          </div>
        </v-flex>

        <v-flex md8>
          <v-card class="ma-2">
            <!-- Permet d'afficher le tableau avec les différents éléments récupérer dans la base de données -->
            <v-simple-table
              v-if="restaurants.length > 0"
              fixed-header
              :height="this.window.height"
            >
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
                    <v-icon small class="mr-2 ml-3">mdi-pencil</v-icon>
                    <v-icon
                      small
                      class="mr-2"
                      @click="supprimerRestaurant(item)"
                      >mdi-delete</v-icon
                    >
                    <v-icon small>mdi-loupe</v-icon>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>

            <!-- Génère un loader pendant le temps de chargement de la base de données dans le tableau -->
            <v-data-table
              v-if="restaurants.length < 1"
              loading
              loading-text="Veuillez patienter le contenu se charge..."
              :hide-default-footer="true"
            ></v-data-table>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";

export default {
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
      pageItems: [10, 20, 30, 40, 50, 100, 500],
      nbRestaurantTotal: 0,
      nbPageTotal: 0,
      valeurNombreLigne: 20,
      pageCourante: 1,
      restaurants: [],
      errors: [],
      nom: "",
      cuisine: "",
      nomRecherche: "",
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
          this.nbPageTotal = Math.round(
            this.nbRestaurantTotal / this.valeurNombreLigne
          );
          console.log(response.data);
          console.log(response.data.data);
        })
        .catch((e) => {
          this.errors.push(e);
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
          this.errors.push(e);
        });
    },
    ajouterRestaurant() {
      let data = {
        name: this.nom,
        cuisine: this.cuisine,
      };
      console.log(data);

      let url = "http://localhost:8080/api/restaurants/";

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
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight * 0.8;
      //console.log('taille '+this.window.height)
    },
    gestionChangementPage(value) {
      this.pageCourante = value;
      this.getRestaurantsFromServer();
    },
  },
};
</script>
