import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);

Vue.use(Vuex);
const getDefaultState = () => {
  return {
    isLoading: false,
    title: '',
    selectedEntities:[],
  }
}

export default new Vuex.Store({
  state: getDefaultState(),
  mutations: {
    SET_IS_LOADING(state, value) {
      state.isLoading = value;
    },
    SetTitle(state, value) {
      state.title = value;
    },
    changeSelected(state, value) {
      var flag = 0;
      var pos = 0;
      state.selectedEntities.forEach((item, index) => {
        if(item.id == value.id) {
          flag = 1;
          pos = index;
        }
      })
      if(flag == 0) {
        state.selectedEntities.push(value);
        //console.log(value)
      } else {
        state.selectedEntities.splice(pos,1);        
      }         
      // setTimeout(() => {
         localStorage.setItem('selectedEntities', JSON.stringify(state.selectedEntities)); 
      // }, 100);
          
    },
    resetState (state) {
      // Merge rather than replace so we don't lose observers
      // https://github.com/vuejs/vuex/issues/1118
      Object.assign(state, getDefaultState())
    }
    
  },
  getters: {
    isLoading(state) {
      return state.isLoading;
    },
    title(state) {
      return state.title;
    }
  },
  actions: {},
  modules: {},
});
