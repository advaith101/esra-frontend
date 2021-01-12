<template>
    <v-row class="px-3" style="height:48px">
        <v-list-item-icon>
            <v-badge
                bordered
                color="green"
                dot
                offset-x="10"
                offset-y="10"
                v-show="(user.Status!=0)"
            >
                <v-avatar size="30" class="mt-2" style="top:-7px">
                <v-img src="https://cdn.vuetifyjs.com/images/lists/2.jpg" ></v-img>
                </v-avatar> 
            </v-badge>
            <v-avatar v-show="!(user.Status!=0)" size="30" class="mt-2" style="top:-7px" >
                <v-img src="https://cdn.vuetifyjs.com/images/lists/2.jpg" ></v-img>
            </v-avatar> 
        </v-list-item-icon>
        <v-list-item-content style="margin-left:-20px">
            <div class="userlist-item">
                <v-list-item-title class="text-truncate" style="font-weight: bold;" :style="user.color !== 'white' && 'color:'+user.color" >{{ user.Name }}</v-list-item-title>
                <v-list-item-subtitle class="text-truncate" style="color:#828288;font-size:12px">{{ user.Email }}</v-list-item-subtitle>
            </div>
        </v-list-item-content>
        <v-avatar size="30" :style="user.color == 'white' ? 'border-color: #bebebe' : 'border-color:'+user.color" class="userlist-mark-green mt-2"><span style="font-weight:bold">{{parseInt(user.value)}}</span></v-avatar>
    </v-row>
</template>

<script>
export default {
    props:['user']
    
}
</script>

<style scoped>

.userlist-item {
  text-align: left;  
  max-width: 150px;
}
.userlist-mark-red {
  margin-top:10px;
  border: 1px solid #4a01f5;
  box-sizing: border-box;
}

.userlist-mark-green {
  margin-top:5px;
  border: 1px solid #41db04;
  box-sizing: border-box;
}

</style>