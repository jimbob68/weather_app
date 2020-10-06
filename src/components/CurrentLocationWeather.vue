<template>
    <div>
        <h2 v-if="this.currentLocationDetails != null" >The current weather in {{ this.currentLocationDetails.addresses[0].address.municipality }}, {{ this.currentLocationDetails.addresses[0].address.postalCode }} is : </h2>
        <!-- <p v-if="this.currentCoordinates != null">Latitude: {{ this.currentCoordinates.latitude }}</p>
        <p v-if="this.currentCoordinates != null">Longatude: {{ this.currentCoordinates.longitude }}</p> -->
        <h2 v-if="this.currentLocationWeather != null"> {{ this.currentLocationWeather.current.weather[0].description }}</h2>
        <img :src=this.weatherIcon class="image-fit">
        
        <h2 v-if="this.currentLocationWeather != null"> Temperature: {{ this.currentLocationWeather.current.temp  }}°C</h2>
        <h2 v-if="this.currentLocationWeather != null"> Wind Speed: {{ this.currentLocationWeather.current.wind_speed  }}m/s</h2>
        <h2 v-if="this.currentLocationWeather != null"> Sunrise: {{ this.convertTimeFromTimeStamp(this.currentLocationWeather.current.sunrise) }}</h2>
        <h2 v-if="this.currentLocationWeather != null"> Sunset: {{ this.convertTimeFromTimeStamp(this.currentLocationWeather.current.sunset) }}</h2>
        <!-- <p v-if="this.currentLocationDetails != null">Town: </p>
        <p v-if="this.currentLocationDetails != null">Post Code: </p> -->
        <!-- <img src="http://openweathermap.org/img/wn/" +  {{this.currentLocationWeather.current.weather[0].icon}} + "@2x.png"> -->
        
    </div>
</template>

<script>

import apiKey from "../apikey.js"

export default {

    data() {
        return {
            currentCoordinates: null,
            currentLocationWeather: null,
            currentLocationDetails: null,
            weatherIcon: null
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

        convertTimeFromTimeStamp(path) {
            const date = new Date(path * 1000)
            const time = date.toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"})
            return time
        }



    },

    mounted() {
        this.getCoordinates()
    }
}




</script>

<style scoped>
.image-fit{
    height: 25%;
    width: 25%;
}
</style>