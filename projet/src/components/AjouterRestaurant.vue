<template>
  <v-container>
    <v-layout row wrap>
      <v-flex>
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
            <!-- permet d'éviter quela page se recharge -->
            <v-form class="px-3" ref="form" @submit.prevent="ajouterRestaurant">
              <v-row class="mx-4">
                <v-col>
                  <v-text-field
                    v-model="nom"
                    prepend-icon="mdi-home"
                    label="Name"
                    :rules="[(v) => !!v || 'Required!']"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="cook"
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
                    v-model="latitude"
                    prepend-icon="mdi-home"
                    label="Latitude"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="longitude"
                    label="Longitude"
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
      nom: "",
      cook: "",
      building: "Building",
      address: {},
      street: "Street",
      zipcode: "00000",
      coord: [],
      borough: "Ville",
      longitude: 0,
      latitude: 0,
      valueCount: 0,
      booleanConfirm: "",
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
      let myData = new FormData();

      myData.set("name", this.nom)
      myData.append("cuisine", this.cook)
      myData.append("borough", this.borough)
      myData.append("building", this.building)
      myData.append("street", this.street)
      myData.append("longitude", this.longitude)
      myData.append("latitude", this.latitude)
      myData.append("zipcode", this.zipcode)

      //console.log(data);

      let url = "http://localhost:8080/api/restaurants/";
      let isExist = this.verifierSiExist(
        "http://localhost:8080/api/restaurants?name=" + this.nom
      );
      console.log(isExist);

      if (this.nom !== "" && this.cuisine !== "" && this.borough !== "") {
        if (isExist) {
          this.confirmBox();
          if (this.booleanConfirm) {
            this.requetePost(url, myData)
          }
        } else {
          this.requetePost(url, myData)
        }
      } else {
        window.alert(
          "Make sure that you have filled in all the necessary fields "
        );
      }
    },
    requetePost(myurl, mydata) {
      axios({
        method: 'post',
        url: myurl,
        data: mydata
      }).then((response) => {
          console.log(response)
          console.log(response.data)
          this.requeteGet(myurl)
        })
        .catch((e) => {
          this.errors.push(e);
        });
        this.requeteGet("http://localhost:8080/api/restaurants");
    },
    requeteGet(url){
       axios
        .get(url)
        .catch((e) => {
          this.errors.push(e);
        });
    },
    verifierSiExist(url) {
      axios
        .get(url, {})
        .then((response) => {
          // JSON responses are automatically parsed
          this.valueCount = response.data.count;
        })
        .catch((e) => {
          this.errors.push(e);
        });
      console.log(this.valueCount);
      if (this.valueCount === 0) {
        return false;
      } else {
        return true;
      }
    },
    confirmBox() {
      if (confirm("The name already exist ! Do you wish to continue ?")) {
        this.booleanConfirm = true;
      } else {
        this.booleanConfirm = false;
      }
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight * 0.8;
    },
  },
};
</script>


