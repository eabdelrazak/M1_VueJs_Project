<template>
  <div>
    <form @submit.prevent="ajouterRestaurant($event)">
      <label>
        <!-- si on veut recup les donne de type cle vlaeur faut ajout un parametre name qui permet quand on va soumettre le formulaire dans le protocol http on aura ce formlaire contiendra un param name -->
        Nom : <input name="nom" type="text" required v-model="nom" />
        <!-- v-model si on saisie quelque chose dans le champs nom ça va saisir qqch dans la variable nom dans data -->
      </label>
      <label>
        Cuisine :
        <input name="cuisine" type="text" required v-model="cuisine" />
      </label>

      <button>Ajouter</button>
    </form>

    <h1>Nombre de restaurants : {{ nbRestaurantTotal }}</h1>
    <h2>Nombre de page total : {{ nbPageTotal }}</h2>
    <p>
      Recherche restaurant
      <input
        @input="rechercheRestaurant"
        type="text"
        v-model="rechercheNomRestaurant"
      />
    </p>
    <p>Page actuel : {{ currentPage }}</p>

    <button
      :disabled="currentPage === 0"
      :style="{ width: buttonWidth + 'px' }"
      v-on:click="previousPage()"
    >
      Précédent
    </button>
    <button
      :disabled="currentPage === nbPageTotal"
      :style="{ width: buttonWidth + 'px' }"
      v-on:click="nextPage()"
    >
      Suivant
    </button>
    <table>
      <tr>
        <th>Nom</th>
        <th>Cuisine</th>
      </tr>
      <tbody>
        <tr v-for="(r, index) in restaurants" :key="index" @click.stop="" :style="{ backgroundColor: getColor(index) }">
          <!-- supprimerRestaurant(r)-->
          <!--v-bind:class="{bordureRouge:(index === 2)}"> recupere une propriete css et permet de mettre en pointillé une case -->
          <td>{{ r.name }}</td>
          <td>{{ r.cuisine }}</td>
          <td><router-link :to="'/restaurant/' + r._id">[Detail d'un restaurant]</router-link></td>
        </tr>
      </tbody>
    </table>
    <div class="slidecontainer">
        <input @input="getRestaurantsFromServer()" type="range" min="5" max="1500" step="5" v-model="pageSize" class="slider" id="myRange">
        <p>Nombre de restaurants par page : {{pageSize}} </p>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "ListeDesRestaurant",
  props: {
    msg: String,
  },
  data: function () {
    return {
      restaurants: [],
      nbRestaurantTotal: 0,
      nbPageTotal: 0,
      nom: "",
      cuisine: "",
      buttonWidth: 100,
      currentPage: 0,
      pageSize: 5,
      rechercheNomRestaurant: "",
    };
  },
  mounted() {
    console.log("AVANT RENDU HTML"),
      //this.restaurants = []
      this.getRestaurantsFromServer();
  },
  methods: {
    supprimerRestaurant(r) {
      //this.restaurants.splice(index, 1);
      let url = "http://localhost:8080/api/restaurants/" + r._id;

      fetch(url, {
        // Pour introduire une donnée
        method: "DELETE",
      })
        .then((responseJSON) => {
          responseJSON.json().then((res) => {
            // Maintenant res est un vrai objet JavaScript
            console.log(res.msg);
            this.msg = res.msg;
            // On rafraichit la vue
            this.getRestaurantsFromServer();
          });
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    ajouterRestaurant(event) {
      // eviter le comportement par defaut
      //event.preventDefault(); // PLus besoin on peut ajouter .prevent au submit

      /*this.restaurants.push(
                    {
                        nom: this.nom,
                        cuisine: this.cuisine
                    }
                );*/ // Cette ajout ne ce fait pas dans la base de donnée donc on passe à une solution qui permet de faire une requete POST

      // Récupération du formulaire. Pas besoin de document.querySelector
      // ou document.getElementById puisque c'est le formulaire qui a généré
      // l'événement
      let form = event.target; // objet qui a genere levent submit = le form

      // Récupération des valeurs des champs du formulaire
      // en prévision d'un envoi multipart en ajax/fetch
      let donneesFormulaire = new FormData(form);

      let url = "http://localhost:8080/api/restaurants/";

      fetch(url, {
        // Pour introduire une donnée
        method: "POST",
        body: donneesFormulaire,
      })
        .then((responseJSON) => {
          responseJSON.json().then((res) => {
            // Maintenant res est un vrai objet JavaScript
            console.log(res.msg);
            this.msg = res.msg;
            // On rafraichit la vue
            this.getRestaurantsFromServer();
          });
        })
        .catch(function (err) {
          console.log(err);
        });
      this.nom = "";
      this.cuisine = "";
    },
    getColor(index) {
      return index % 2 ? "lightBlue" : "pink";
    },
    rechercheRestaurant: _.debounce(function () {
      this.getRestaurantsFromServer();
    }, 300),
    getRestaurantsFromServer() {
      let url =
        "http://localhost:8080/api/restaurants?" +
        "page=" +
        this.currentPage +
        "&pagesize=" +
        this.pageSize +
        "&name=" +
        this.rechercheNomRestaurant;

      fetch(url)
        .then((response) => response.json())
        .then((reponseJson) => {
          this.restaurants = reponseJson.data;
          this.nbRestaurantTotal = reponseJson.count;
          this.nbPageTotal = Math.round(reponseJson.count / this.pageSize);
          //console.log(reponseJson.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    nextPage() {
      if (this.currentPage === this.nbPageTotal) return;
      this.currentPage++;
      this.getRestaurantsFromServer();
    },
    previousPage() {
      if (this.currentPage === 0) return;
      this.currentPage--;
      this.getRestaurantsFromServer();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table {
    border: 1px solid black;
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    margin-bottom: 20px;
}

tr,
td {
    border: 1px solid black;
}

td {
    padding: 5px;
}

.slider {
    -webkit-appearance: none;
    width: 100%;
    height: 15px;
    border-radius: 5px;  
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }
  
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%; 
    background: #4CAF50;
    cursor: pointer;
  }
  
  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }

</style>