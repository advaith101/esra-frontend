<template>
    <div>
        <v-col class="pa-0">
            <!-- <v-flex>
                <v-row class="justify-space-around align-center px-5"><v-icon color="#4F7CB6">mdi-minus-circle</v-icon><p>{{ team.teamName }}</p></v-row>
            </v-flex> -->
            <v-flex>
                <v-list
                    dense
                    nav
                    class="sidebar"
                    v-if="teamMembers.length"
                >
                    <v-list-item
                    v-for="user in teamMembers"
                    :key="user.UserID"
                    link                                      
                    ref="userlist"  
                    @click="selectMember(user)"      
                    >
                    <UserItem :user="user" />

                    </v-list-item>
                </v-list>
            </v-flex>
            <!-- <v-flex>Add +</v-flex> -->
        </v-col>
    </div>
</template>

<script>

import UserItem from './UserItem';

export default {
    props: ['allUsers', 'team'],
    components: {
        UserItem,
    },
    created () {
        this.teamMembers = this.allUsers.filter((user) => {
            return this.team.EmployeeID.includes(user.UserID)
        })
    },
    data () {
        return {
            teamMembers: []
        }
    },
    methods:{
        selectMember(user){
            //console.log('user in team selected:',user.Name)
            this.$emit('teamselect',user);
        }
    }
}
</script>

<style scoped>
.userlist-item {
  text-align: left;  
}

.userlist-mark-red {
  border: 1px solid #4a01f5;
  box-sizing: border-box;
}

.userlist-mark-green {
  border: 1px solid #41db04;
  box-sizing: border-box;
}

</style>