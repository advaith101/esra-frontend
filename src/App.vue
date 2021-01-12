<template>
  <div id="app">
    <v-app>
       <v-main>
        <Loader :is-visible="$store.getters.isLoading"></Loader>
        <router-view/>
       </v-main>
    </v-app>
  </div>
</template>

<script>
import Loader from './components/Loader';
export default{
  components:{
    Loader
  }, 
  
}

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
#app {
  font-family: Open Sans, Helvetica, Arial, sans-serif;
  font-size: 12px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.v-application {
   font-family: Open Sans, sans-serif !important;   
 }

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.v-input ,.v-label {
    font-size: 12px!important;
}
::-webkit-scrollbar {
    width: 5px !important;  /* Remove scrollbar space */
    /* Optional: just make scrollbar invisible */
    
}
/* Optional: show position indicator in red */
::-webkit-scrollbar-thumb {
    background: #C8D1E6;     
}
@media (max-width: 768px) {
  ::-webkit-scrollbar {
    width: 0px;  /* Remove scrollbar space */
    /* Optional: just make scrollbar invisible */
}
::-webkit-scrollbar-thumb {
    background: transparent;
}
}
</style>
