<template>
<div class="header pa-0 ma-0">
<div >
  <v-col cols="12">
      <v-row>
          <v-flex lg9>
            <!-- <v-text-field
                        class="searchbar"            
                       dense
                        outlined            
                        placeholder="Start Typing.."
                        v-model="searchString"
                        v-on:keydown="keyPress"
                >
                <v-img slot="prepend-inner" class='search-icon' :src="require('@/assets/icons/search.png')"></v-img>
            </v-text-field> -->
            <span class="title" @click="$router.push('/home')"
            >Tempo
            <pre class="subTitle"> Esra Systems, LLC </pre></span
          > 
          </v-flex>
          <v-flex lg2>
               <v-row >
                    <v-img max-height="30" max-width="30" :src="require('@/assets/icons/share.png')" class="img-buttons" />
                    <v-img max-height="30" max-width="30" :src="require('@/assets/icons/print.png')" class="img-buttons" />
                    <v-badge color="indigo" overlap :content="isNotif" :value="isNotif" offset-x="10" offset-y="17">
                        <v-img max-height="30" max-width="30" :src="require('@/assets/icons/notification.png')" class="img-buttons" @click="toggleNotif" v-show="!isNotif" />
                        <v-img max-height="30" max-width="30" :src="require('@/assets/icons/notification_active.png')" class="img-buttons" @click="toggleNotif" v-show="isNotif" />
                    </v-badge>
               </v-row>
          </v-flex>
            <v-flex lg1 v-show="!$vuetify.breakpoint.xsOnly" >
              <v-row >                   
                <v-menu nudge-bottom=55>
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                            <v-avatar style="margin-right:10px;top:7px">          
                                <img src="https://randomuser.me/api/portraits/women/81.jpg">           
                            </v-avatar>
                        </v-btn>
                    </template>
                    <v-card width="250px" height="120px" >                       
                        <v-card-actions>
                            <v-avatar style="margin-right:10px;top:7px">          
                                <img src="https://randomuser.me/api/portraits/women/81.jpg">           
                            </v-avatar>
                           <div class="d-flex flex-column namediv ">
                            <span class="name align-self-center mr-auto">{{ userName}} </span>
                            <span class="nametitle">{{ userRole}}</span>
                            <div class="myaccount">
                                <v-row class="row1">
                                    <div class="button-sect">
                                        <v-btn class="text-caption button white--text" color="#144584" @click="gotoprofile()" small dark>My Account</v-btn>
                                            <v-btn
                                                class="button btnCancel"
                                                color="#144584"
                                                outlined
                                                small
                                                @click="signOut()"
                                                >Logout</v-btn
                                            >
                                    </div>
                                </v-row>
                            </div>
                          </div>
                        </v-card-actions>
                    </v-card>
                </v-menu>
                <div class="d-flex flex-column namediv ">
                    <span class="name align-self-center mr-auto">{{ userName }} </span>
                    <span class="nametitle">Manager</span>
                </div>
              </v-row>
        </v-flex>
        </v-row>
    </v-col>
    </div>
</div>
</template>

<script>

export default {
    mounted(){
        this.userName = localStorage.getItem("userName")
    },
    props: ['isNotif'],
    data (){ 
        return {
            showNotification:true,
            searchString: "",
            userName: "",
            userRole: localStorage.getItem("userEmail")
        }
    },
    methods: {
        toggleNotif() {
            this.showNotification = !this.showNotification
            this.$emit('notif-toggle', this.showNotification)
        },
        // keyPress:function(event) {
        //     setTimeout(() => {
        //         if(this.isalnum(event.key)) {
        //             this.$emit('search-item',this.searchString)
        //         }
        //     }, 50)
        // },
        isalnum:function(c) {
            return ((((c >= 'a') && (c <= 'z')) || ((c >= 'A') && (c <= 'Z'))) || ((c >= '0') && (c <= '9')))
        },
        gotoprofile:function() {
            this.$router.push({ name: 'profile' })
        },
        signOut() {
             localStorage.removeItem('token');
                    localStorage.removeItem('refreshtoken');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userEmail');
                    this.$router.push('/');
        }
    }
}
</script>

<style scoped>
.header {
box-shadow: 0px 4px 32px rgba(0, 49, 104, 0.05);
height: 78px;
width: 100%!important;
background-color: #FAFAFA;

}

.searchbar {  
width: 95%;
top:5px;
font-family: Open Sans;
font-style: normal;
font-weight: normal;
font-size: 14px;
height:42px;
border-radius: 4px;
}

.v-text-field--outlined >>> fieldset {
  border-color: #E9E9E9 !important;
}

.search-icon {
    height: 30px;
    margin-left:-5px;
    margin-top:-3px;
}
.namediv {
   margin-top: 5%;
   margin-left: 15px;     
}
.name {
    font-family: Open Sans;
font-style: normal;
font-weight: bold;
font-size: 14px;
align-self: center;
color: #202031;
}
.nametitle {
    font-family: Open Sans;
font-style: normal;
font-size: 12px;
color: #6B6B81;

}
.v-btn {
    width:32px;
    height:32px;
    color:red;
}

.img-buttons {
    cursor: pointer;
    vertical-align: middle;
    top: 9.5px;
    margin-left: 10px;
}
.myaccount {   
display: flex;
flex-direction: row;
justify-content: flex-start;
top: 80px;
font-size: 8px;
position: absolute;
width: 250px;
}
.button-sect {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: -10px;
    margin-left: -30px;
  }

  .button {
    width: 100px;
    padding: 0px 25px;
    margin-right: 10px;
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
</style>
