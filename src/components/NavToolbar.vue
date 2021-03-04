<template>
<div class="header pa-0 ma-0">
<!-- <div > -->
  <v-col cols="12" class="pa-0 ma-0">
     
      <v-row style="margin-bottom:5px">
          <v-flex lg8 xs10 sm6 >
              
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
            <!-- <span class="title" @click="$router.push('/home')"
            >Tempo
            <pre class="subTitle"> Esra Systems, LLC </pre></span
          >  -->
           <div  class="title">
           <img  width="150px" :style="$vuetify.breakpoint.xsOnly ? 'margin-top:-4px':'margin-top:-5px'" :src="require('@/assets/logo.png')"/>
          </div>
              
          </v-flex>
          <v-flex lg4 sm6 >
               <v-row >
                   <v-spacer></v-spacer>
                    <!-- <v-img max-height="30" max-width="30" :src="require('@/assets/icons/share.png')" class="img-buttons" />
                    <v-img max-height="30" max-width="30" :src="require('@/assets/icons/print.png')" class="img-buttons" /> -->
                    <!-- <v-badge color="indigo" overlap :content="isNotif" :value="isNotif" offset-x="10" offset-y="17">
                        <v-img max-height="30" max-width="30" :src="require('@/assets/icons/notification.png')" class="img-buttons" @click="toggleNotif" v-show="!isNotif" />
                        <v-img max-height="30" max-width="30" :src="require('@/assets/icons/notification_active.png')" class="img-buttons" @click="toggleNotif" v-show="isNotif" />
                    </v-badge> -->
               
          <!-- </v-flex>
            <v-flex lg1 sm2 v-show="!$vuetify.breakpoint.xsOnly" :style="$vuetify.breakpoint.mdOnly && 'margin-left:40px'" > -->
              <v-flex  class="d-flex flex-row-reverse " style="padding-right:30px"  :style="$vuetify.breakpoint.md && 'margin-left:40px'" >                   
                  <div class="d-flex flex-column namediv " v-if="!$vuetify.breakpoint.xsOnly">
                    <span class="name align-self-center mr-auto">{{ userName }} </span>
                    <span class="nametitle">{{ userRole }}</span>
                </div>
                <v-menu nudge-bottom=55 v-if="!$vuetify.breakpoint.xsOnly">
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                            <v-avatar style="margin-left: auto;top:7px">          
                                <img :src= "`${getUserDetails().profilepic_path}`" />           
                            </v-avatar>
                        </v-btn>
                    </template>
                    <v-card width="250px" height="120px" >                       
                        <v-card-actions>
                            <v-avatar style="margin-right:10px;top:7px">          
                                <img :src= "`${getUserDetails().profilepic_path}`">           
                            </v-avatar>
                           <div class="d-flex flex-column namediv " style="margin-top:5%">
                            <span class="name align-self-center mr-auto">{{ userName}} </span>
                            <span class="nametitle">{{ userEmail}}</span>
                            
                            <v-flex lg12 xs12 class="myaccount">
                                <v-row >
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
                            </v-flex>
                            
                          </div>
                        </v-card-actions>
                    </v-card>
                </v-menu>
                 <v-badge color="indigo" overlap :content="isNotif" :value="isNotif" offset-x="10" offset-y="17">
                        <v-img max-height="30" max-width="30" :src="require('@/assets/icons/notification.png')" class="img-buttons" @click="toggleNotif" v-show="!isNotif" />
                        <v-img max-height="30" max-width="30" :src="require('@/assets/icons/notification_active.png')" class="img-buttons" @click="toggleNotif" v-show="isNotif" />
                    </v-badge>
              </v-flex>
              </v-row>
        </v-flex>
        </v-row>
    </v-col>
    <!-- </div> -->
</div>
</template>

<script>

export default {
    // mounted(){
    //     this.userName = localStorage.getItem("userName")
    // },
    props: ['isNotif'],
    data (){ 
        return {
            showNotification:true,
            searchString: "",
            userName: this.getUserDetails().Name,
       userRole: this.getUserDetails().jobTitle,
       userEmail: this.getUserDetails().Email
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
/* box-shadow: 0px 4px 32px rgba(0, 49, 104, 0.05); */
height: 50px !important;
width: 100%!important;
background-color: #FAFAFA!important;

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

.v-btn {
    width:32px;
    height:32px;
    color:red;
}

.img-buttons {
    cursor: pointer;
    vertical-align: middle;
    top: 9px;
    margin-left: 0px;
    margin-right: 20px
}
.myaccount {   
display: flex;
flex-direction: column;
justify-content: flex-start;
align-content: flex-start;
top: 80px;
font-size: 8px;
position: fixed;
width: 100%;
margin: auto;

}

.title {
  display: flex;
  align-items: center;
  justify-content: center;
  /* top: 30px; */
  /* bottom: 28px; */
  font-family: Righteous;
  font-style: normal;
  font-weight: bolder;
  font-size: 30px;
  /* line-height: 37px; */
  color: #144584;
  margin-left:50px;
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
.logo {
    
  display: flex;
  justify-content: center;
  align-items: center;

}

.namediv {
   margin-top: 2%;
   margin-left: 15px; 
   align-self: flex-start;    
   justify-content: flex-end;
}
.name {
    font-family: Open Sans;
font-style: normal;
font-weight: bold;
font-size: 14px;
align-self: center;
color: #202031;
text-overflow: ellipsis !important;
}
.nametitle {
    font-family: Open Sans;
font-style: normal;
font-size: 12px;
color: #6B6B81;

}
.button-sect {
    display: flex;
    flex-direction: row;
    justify-content: space-around; 
    
     padding-left: -10px;
    margin-left: -40px;
  }

  .button {
    width: 100px;
    padding: 0px 25px;
    margin-right: 10px;
  }
</style>