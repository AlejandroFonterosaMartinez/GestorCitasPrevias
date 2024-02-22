<template>
  <div id="app">
  <!-- <Navbar/> -->
  <Inicio/>
  </div>
</template>

<script>
import Inicio from './components/Inicio.vue'
import Navbar from './components/Nav.vue'

export default {
  name: 'App',
  components: {
    Inicio,Navbar
  }
}
</script>
<style>
#app {
  background-image: url('assets/backgroundIMG.jpg');
  background-size: cover;
  background-position: center;
}



</style>
