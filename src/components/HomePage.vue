<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar style="background-color:white">
        <md-button class="md-icon-button hidden-md-and-up" @click="menuVisible = !menuVisible">
          <v-icon style="color:black">mdi-menu</v-icon>
        </md-button>
        <NavToolbar v-on:notif-toggle="notifToggle" v-on:search-item="updateSearchString" :isNotif="isNotif" />
        
      </md-app-toolbar>
      <md-app-drawer
      :md-active.sync="menuVisible"
        md-permanent="full"
        style="width:278px;background-color:#FAFAFA;"
      >
        <md-app-toolbar style="background-color:#FFFFFF;height:78px;cursor:pointer" >
          <!-- <span class="title" @click="$router.push('/home')"
            >Tempo
            <pre class="subTitle"> Esra Systems, LLC </pre></span
          > -->
        </md-app-toolbar>

        <Sidebar v-on:mode-change="modeUpdate" :timeMode="timeMode" :dateRange="dateRange"  :searchString="searchString" />
      </md-app-drawer>
      <md-app-content style="margin-top:-10px;">
        <router-view  :mode="mode" @timeModeChanged="timeModeChanged" @dateRangeChanged="dateRangeChanged"/>
      </md-app-content>
    </md-app>
    <div style="float:right;margin-right:-12px"  v-if="showNotification">
      <v-navigation-drawer
          v-model="showNotification"
          absolute
          temporary
          right        
          :width="{'80%': $vuetify.breakpoint.mdAndDown,'30%': $vuetify.breakpoint.xlOnly}"
          class="overlay-card"
      >
        <v-list-item>       
          <v-list-item-content>
            <v-list-item-title class="navtitle">Notifications</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>       
          <v-list-item-content>
            <Notifications :notifications="notifications" />
          </v-list-item-content>
        </v-list-item>
      </v-navigation-drawer>
    </div>
  </div>      
</template>

<script>
import moment from "moment";
import NavToolbar from './NavToolbar.vue';
import Sidebar from './Sidebar.vue';
import Notifications from './Notifications';
export default {
  beforeCreate(){
    if(!localStorage.getItem('token')){
      this.$router.replace('/');
    }
  },
  async beforeMount(){
    var res = await this.$apiService.post('/common/getNotifications',{managerID:3});
    if(res.data.status === 'ok') {
      this.notifications=res.data.data;
      this.notifications.forEach((notification) => {
        notification.date = moment.parseZone(notification.createdTime,"YYYY-MM-DDTHH:mm:ss.SSSZ").format("YYYY-MM-DD");
        notification.time = moment.parseZone(notification.createdTime,"YYYY-MM-DDTHH:mm:ss.SSSZ").format("hh:mm A");
      })
    }
    this.mode="output"
  },

  components:{
    NavToolbar,    
    Sidebar,
    Notifications,
  },
  data() {
    return {
      showNotification: false,
      searchString: "",
      mode:"",
      notifications:[],
      menuVisible: false,
      timeMode:3,
      dateRange:null
    }
  },
  
  computed: {
    isNotif:function() {
      if(this.notifications.length != 0) {
        return this.notifications.length;
      }
      return false
    }
  },

  methods: {
    notifToggle:function() {
      this.showNotification = !this.showNotification
    },
    updateSearchString:function(searchItem) {
      this.searchString = searchItem
    },
    modeUpdate:function(value) {
      this.mode=value;
    },
    timeModeChanged:function(value) {      
      this.timeMode = value;
    },
    dateRangeChanged(value) {
      this.dateRange = value;
    }
  }
}
</script>

<style scoped>
.page-container {
  background-color: #e5e5e5;
}

.navtitle {
  font-family: Open Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 25px;
  line-height: 25px;
  /* identical to box height */
  /* Black */
  color: #202031;
  text-align: left;
}

.title {
  left: 30px;
  top: 13px;
  bottom: 28px;
  font-family: Righteous;
  font-style: normal;
  font-weight: bolder;
  font-size: 30px;
  line-height: 37px;
  color: #144584;
}
.subTitle {
  top: 29px;
  bottom: 14px;
  font-family: Righteous;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  color: #c0cbe4;
}
.overlay-card{
  width:80%;
}
@media (min-width: 1400px) {
  .overlay-card{
  width:30%;
}
}

</style>
