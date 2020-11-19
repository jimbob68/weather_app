<template>
  <div id="app">
    <h1 class="title">World Wide Weather</h1>
    <h3>Welcome to the only weather app you'll ever need!
    Find out the weather from any country in the world!</h3>
    <search-weather-location />
    <current-location-weather />
    
  </div>
</template>

<script>

import CurrentLocationWeather from './components/CurrentLocationWeather.vue'
import SearchWeatherLocation from './components/SearchWeatherLocation.vue'
export default {
  name: 'App',
  components: {
    "current-location-weather": CurrentLocationWeather,
    "search-weather-location" : SearchWeatherLocation
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  /* -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  text-align: center;
  color: #2c3e50;
  /* clear: both; */
  background-color:bisque;
  padding-top: 10px;
  
}
body{
  margin: 0px !important;
}
.title  {
  color:rebeccapurple;
}


</style>
