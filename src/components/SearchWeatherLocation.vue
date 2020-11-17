<template>
    <form @submit.prevent>
        <label>Search a location: </label>
        <input v-model="searchTerm" />
        <button v-on:click="submit">Submit</button>
    </form>
</template>

<script>

import apiKey from "../apikey.js"
import { eventBus } from '../main.js'
export default {
  name: 'SearchLocation',
  data() {
      return {
          searchTerm: "",
          searchLocationResults: null,
          searchLocationWeather: null,
          weatherIcon: null
      }
  },
  methods: {
      submit() {
            fetch("https://api.tomtom.com/search/2/structuredGeocode.json?countryCode=GB&municipalitySubdivision=" + this.searchTerm + "&key=" + apiKey.tomTomKey )
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
          console.log("searchLocationResults", this.searchLocationResults)
          fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + this.searchLocationResults.results[0].position.lat + '&lon=' + this.searchLocationResults.results[0].position.lon + '&units=metric&appid=' + apiKey.weatherKey )
          .then(res => res.json())
          .then(results => this.searchLocationWeather = results)
          .then((results) => this.weatherIcon = "http://openweathermap.org/img/wn/" +  results.current.weather[0].icon + "@2x.png")
          .then(() => eventBus.$emit("searched-weather-data", {searchLocationWeather: this.searchLocationWeather, searchLocationResults: this.searchLocationResults}))
      }

  }

}
</script>

<style scoped>

</style>