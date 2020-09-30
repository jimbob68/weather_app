<template>
    <div>
        <h2>The weather in your current location is: </h2>
        <p v-if="this.currentLocation != null">Latitude: {{ this.currentLocation.latitude }}</p>
        <p v-if="this.currentLocation != null">Longatude: {{ this.currentLocation.longitude }}</p>
        <p v-if="this.currentLocationWeather != null">Current Weather: {{ this.currentLocationWeather.current.weather[0].description }}</p>
    </div>
</template>

<script>

import apiKey from "../apikey.js"

export default {

    data() {
        return {
            currentLocation: null,
            currentLocationWeather: null
        }
    },

    methods: {
        getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                     fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&appid=' + apiKey )
                    .then(res => res.json())
                    .then(results => this.currentLocationWeather = results)

                    this.currentLocation = position.coords
                })
            } else {
                console.log("not working");
            }
        },

        // setPosition(position) {
        //      this.currentLocation = position.coords
        //     // x.innerHTML = "Latitude: " + position.coords.latitude +
        //     // "<br>Longitude: " + position.coords.longitude;
        // }
    },
    mounted() {
        this.getLocation()
        

        //  if (navigator.geolocation) {
        //         navigator.geolocation.getCurrentPosition((position) => {
        //             console.log("position", position);
        //             this.currentLocation = position.coords
        //             console.log(this.currentLocation);
        //         })
        //     } else {
        //         console.log("not working");
        //     }
        // this.currentLocation="test"
    }
}




</script>

<style scoped>

</style>