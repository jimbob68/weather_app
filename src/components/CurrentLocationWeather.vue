<template>
    <div>
        <h2>The weather in your current location is: </h2>
        <p v-if="this.currentCoordinates != null">Latitude: {{ this.currentCoordinates.latitude }}</p>
        <p v-if="this.currentCoordinates != null">Longatude: {{ this.currentCoordinates.longitude }}</p>
        <p v-if="this.currentLocationWeather != null">Current Weather: {{ this.currentLocationWeather.current.weather[0].description }}</p>
        <p v-if="this.currentLocationDetails != null">Town: {{ this.currentLocationDetails.addresses[0].address.municipality }}</p>
        <p v-if="this.currentLocationDetails != null">Post Code: {{ this.currentLocationDetails.addresses[0].address.postalCode }}</p>
    </div>
</template>

<script>

import apiKey from "../apikey.js"

export default {

    data() {
        return {
            currentCoordinates: null,
            currentLocationWeather: null,
            currentLocationDetails: null
        }
    },

    methods: {
        getCoordinates() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                     fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&appid=' + apiKey.weatherKey )
                    .then(res => res.json())
                    .then(results => this.currentLocationWeather = results)
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
            
        }

    },

    mounted() {
        this.getCoordinates()
    }
}




</script>

<style scoped>

</style>