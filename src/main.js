import Vue from 'vue'
import App from './App.vue'
import router from './router'
import "./plugins/bootstrap-vue";
import "@/plugins/apexcharts";
import vuetify from './plugins/vuetify';
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import moment from 'moment';
import "@/assets/css/main.css";
import store from "./store";
import httpservice from "./service/httpservice";
import VueSimpleAlert from "vue-simple-alert";
import {mixin} from './service/mixin';
import OtpInput from "@bachdgvn/vue-otp-input";

Vue.config.productionTip = false
Vue.use(VueMaterial);
Vue.use(VueSimpleAlert);
Vue.component("v-otp-input", OtpInput);
Vue.mixin(mixin);
Vue.filter('formatDate', function(value) {
  if (value) {
      return moment(String(value)).format('DD-MM-YY hh:mm A')
  }
});


httpservice.defaults.timeout = 100000;
httpservice.interceptors.request.use((config) => {  
  // store.commit('SET_IS_LOADING', true);
  const token = localStorage.getItem('token');
  if(token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

httpservice.interceptors.response.use((response) => {
 // store.commit('SET_IS_LOADING', false);
  return response;
}, (error) => { 
  const originalRequest = error.config;
  store.commit('SET_IS_LOADING', false);
   if (error.response.status === 403 && originalRequest.url === 
          'http://localhost:3000/home') {
       router.push('/');
       return Promise.reject(error);
   }
   if (error.response.status === 403 && !originalRequest._retry) {
       originalRequest._retry = true;
       const refreshToken = localStorage.getItem('refreshToken');
       return httpservice.post('/users/renewtoken',
           {
               "refreshToken": refreshToken
           })
           .then(res => {
               if (res.status === 200) {
                   localStorage.setItem('token',res.data.token);
                   httpservice.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
                   return httpservice(originalRequest);
               } 
           })
   }
  store.commit('SET_IS_LOADING', false);
    return Promise.reject(error)
})

Vue.prototype.$apiService = httpservice;

new Vue({
  store:store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
