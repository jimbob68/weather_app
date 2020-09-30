<template>
  <div id="app">
    <h1>Hello World!</h1>
    <current-location-weather />
  </div>
</template>

<script>

import CurrentLocationWeather from './components/CurrentLocationWeather.vue'
export default {
  name: 'App',
  components: {
    "current-location-weather": CurrentLocationWeather
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
