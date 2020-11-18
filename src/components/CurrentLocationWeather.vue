<template>
    <div class="background-color">
        <h2 v-if="this.currentLocationDetails != null" class="location-title">The current weather in {{ this.currentLocationDetails.addresses[0].address.municipality }}, {{ this.currentLocationDetails.addresses[0].address.postalCode }} is : </h2>
        <h2 v-if="this.searchLocation != null">The current weather in {{ this.searchLocationName }} is:</h2>
    <div v-if="this.searchLocation">
        <select v-if="this.searchLocation.results.length > 1" v-model="selectedLocation" v-on:change="sublocationWeatherFetch">
            <option value="Other locations for this search:" disabled hidden>Other locations for this search:</option>
            <option v-for="(location, index) in this.searchLocation.results" v-bind:value="location" v-bind:key="index">{{ location.address.freeformAddress }}</option>
        </select>
    </div>
        <h2 v-if="this.currentLocationWeather != null" class="current-weather"> {{ this.currentLocationWeather.current.weather[0].description }}</h2>
        <img :src=this.weatherIcon class="image-fit">
        
        <h2 v-if="this.currentLocationWeather != null"> Temperature: {{ this.currentLocationWeather.current.temp  }}°C</h2>
        <h2 v-if="this.currentLocationWeather != null"> Wind Speed: {{ this.currentLocationWeather.current.wind_speed  }}m/s</h2>
        <h2 v-if="this.currentLocationWeather != null"> Sunrise: {{ this.convertTimeFromTimeStamp(this.currentLocationWeather.current.sunrise) }}</h2>
        <h2 v-if="this.currentLocationWeather != null"> Sunset: {{ this.convertTimeFromTimeStamp(this.currentLocationWeather.current.sunset) }}</h2>
        <h2>Click on Date for 7 Day Forecast:</h2>
        <ul v-if="this.currentLocationWeather != null" :refresh='refresh' class="dates-list">
            <li v-for="(item, index) in this.currentLocationWeather.daily" :key="item.dt">
                <button v-on:click="toggleIsVisible(index)"><a href="#weather-description"> date: {{ convertDateFromTimeStamp(item.dt) }}</a></button>
                <h2 v-if="isVisible[index] === true"> Morning Temperature: {{ item.temp.morn }}°C</h2>
                <h2 v-if="isVisible[index] === true"> Day Temperature: {{ item.temp.day }}°C</h2>
                <h2 v-if="isVisible[index] === true"> Night Temperature: {{ item.temp.night }}°C</h2>
                <h2 v-if="isVisible[index] === true" id="weather-description"> Weather: {{ item.weather[0].description }}</h2>
            </li>
        </ul>
        
    </div>
</template>

<script>

import apiKey from "../apikey.js"
import { eventBus } from "../main.js"
const tzlookup = require("tz-lookup")

export default {

    data() {
        return {
            currentCoordinates: null,
            currentLocationWeather: null,
            currentLocationDetails: null,
            weatherIcon: null,
            isVisible: [false, false, false, false, false, false, false, false],
            refresh: false,
            searchLocationName: null,
            searchLocation: null,
            selectedLocation: "Other locations for this search:"
        }
    },

    methods: {
        getCoordinates() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                     fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&units=metric&appid=' + apiKey.weatherKey )
                    .then(res => res.json())
                    .then(results => this.currentLocationWeather = results)
                    .then((results) => this.weatherIcon = "http://openweathermap.org/img/wn/" +  results.current.weather[0].icon + "@2x.png")
                    .then(() => this.getLocationName(position)) 

                    this.currentCoordinates = position.coords
                })
            } else {
                console.log("not working");
            }
        },

        getLocationName(position) {
            fetch("https://api.tomtom.com/search/2/reverseGeocode/" + position.coords.latitude + "%2C" + position.coords.longitude + ".json?key=" + apiKey.tomTomKey)
            .then(res => res.json())
            .then(results => this.currentLocationDetails = results)
        },

        sublocationWeatherFetch() {
            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + this.selectedLocation.position.lat + '&lon=' + this.selectedLocation.position.lon + '&units=metric&appid=' + apiKey.weatherKey )
          .then(res => res.json())
          .then(results => this.currentLocationWeather = results)
          .then((results) => this.weatherIcon = "http://openweathermap.org/img/wn/" +  results.current.weather[0].icon + "@2x.png")
          .then(() => this.searchLocationName = this.selectedLocation.address.freeformAddress)
        },

        convertTimeFromTimeStamp(path) {
            const date = new Date(path * 1000)
              let timeZoneString = ""
            if(this.selectedLocation.position){
                console.log(this.selectedLocation.position.lat)
                timeZoneString = tzlookup(this.selectedLocation.position.lat, this.selectedLocation.position.lon)
            } else if(this.searchLocation) { 
                console.log(this.searchLocation.results[0])
                // timeZoneString = tzlookup(this.searchLocation.results[0].lat, this.searchLocation.results[0].lon)
            } else {
                timeZoneString = tzlookup(this.currentCoordinates.latitude, this.currentCoordinates.longitude)
                // console.log(this.currentCoordinates)
            }
            console.log(timeZoneString)
            const time = date.toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit", timeZone: timeZoneString})
            return time
        },
        convertDateFromTimeStamp(path) {
            const date = new Date(path * 1000)
            const formattedDate = date.toLocaleDateString()
            return formattedDate
        },
        toggleIsVisible(index) {
            const tempIsVisible = this.isVisible

            if (tempIsVisible[index] === true){
                tempIsVisible[index] = false
            } else {
                tempIsVisible[index] = true
            }

            this.isVisible = tempIsVisible
            this.refreshPage()
        },

        refreshPage() {
            this.refresh = !this.refresh
        }
            

    },

    mounted() {
        this.getCoordinates()
        eventBus.$on("searched-weather-data", ({searchLocationWeather, searchLocationResults, weatherIcon}) => {
            this.currentLocationWeather = searchLocationWeather
            this.currentLocationDetails = null
            this.searchLocation = searchLocationResults
            this.searchLocationName = searchLocationResults.results[0].address.freeformAddress
            this.weatherIcon = weatherIcon
        })
    }
}




</script>

<style scoped>

.image-fit{
    height: 25%;
    width: 25%;
    margin: 0px;
}
.dates-list{
    list-style-type: none;
    margin: 0px;
    padding: 0px;
}
.background-color{
    background-color:aquamarine;
    padding-bottom: 10px;
}
.current-weather{
    margin-bottom: 0px;
}
.location-title{
    padding-top: 10px;
}
</style>