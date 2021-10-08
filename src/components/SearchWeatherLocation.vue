<template>
    <div class="form-container">
        <form @submit.prevent >
            <label class="form-label">Search a country: </label>
            <select v-model="selectedCountry" required>
                <option v-for="(country, index) in this.countriesData" v-bind:value="country" v-bind:key="index">{{ country.name.common }}</option>
            </select>
            <label class="form-label">Search a location: </label>
            <input v-model="searchTerm" />
            <br/>
            <button v-on:click="submit" class="form-button">Submit</button>
        </form>
    </div>
</template>

<script>

import { eventBus } from '../main.js'
export default {
  name: 'SearchLocation',
  data() {
      return {
          searchTerm: "",
          searchLocationResults: null,
          searchLocationWeather: null,
          weatherIcon: null,
          countriesData: null,
          selectedCountry: null
      }
  },
  methods: {
      submit() {
            fetch("https://api.tomtom.com/search/2/structuredGeocode.json?countryCode=" + this.selectedCountry.cca3 + "&municipalitySubdivision=" + this.searchTerm + "&key=" + apiKey.tomTomKey )
            .then(res => res.json())
            .then(results => {
                this.searchLocationResults = results
            })
            .then(() => {
                if(this.searchLocationResults.results.length === 0) {
                    alert("Please enter a valid location.")
                } else {
                    this.conditionalFetch() 
                }
            })
          
      },
      conditionalFetch(){
          fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + this.searchLocationResults.results[0].position.lat + '&lon=' + this.searchLocationResults.results[0].position.lon + '&units=metric&appid=' + process.env.VUE_APP_weatherKey )
          .then(res => res.json())
          .then(results => this.searchLocationWeather = results)
          .then((results) => this.weatherIcon = "http://openweathermap.org/img/wn/" +  results.current.weather[0].icon + "@2x.png")
          .then(() => eventBus.$emit("searched-weather-data", {searchLocationWeather: this.searchLocationWeather, searchLocationResults: this.searchLocationResults, weatherIcon: this.weatherIcon}))
      }

  },
  mounted() {
      fetch("https://restcountries.com/v3.1/all")
        .then(res => res.json())
        .then(results => {
            results.sort((a, b) => {
                if(a.name.common < b.name.common){
                    return - 1
                }
                if(a.name.common > b.name.common){
                    return 1
                }
                return 0
            })
            this.countriesData = results})
  }

}
</script>

<style scoped>
.form-container {
    background-color: aquamarine;
    padding-top: 15px;
}
.form-label {
    font-size: 20px;
    font-weight: bold;
    padding-left: 20px;

}
.form-button {
    margin-top: 15px;
    font-size: 20px;
    background-color:rebeccapurple;
    color: white;
    border: solid 1px ridge;
    border-radius: 10px;
    padding: 5px 10px;
    cursor: pointer;
    font-family: Arial, Helvetica, sans-serif;
}
.form-button:hover {
    color:rebeccapurple;
    background-color: white;
    border: solid 1px ridge;
}

</style>