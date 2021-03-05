<template>
  <v-card style="margin-top: 0px; border-right: none">
    <div>
      <v-col cols="12">
        <v-row style="margin-top: -5px">
          <v-flex lg4 xs8 >
            <span class="emptitle">Employees</span>
          </v-flex>
          <v-flex lg6 xs9 class="d-flex">
            <v-select
              :items="mode"
              item-text="title"
              item-value="id"
              v-model="selectedMode"
              dense
              solo
              placeholder="Choose Mode"
              class="employeedd elevation-0"
            ></v-select>
          </v-flex>
        </v-row>
      </v-col>
      <v-card class="d-flex align-self-center newteam" text tile dense>
        <v-autocomplete
          dense
          solo
          flat
          multiple
          return-object
          class="elevation-0"
          height="30px"
          v-model="selectedItems"
          :items="entities"
          item-value="Name"
          item-text="Name"
          label="Search for .."
          @change="checkMaximumAllowed()"
        >
          <template v-slot:selection="{ index }">
            <span v-if="index < 1" class="appSelect">{{
              selectedTeamNames
            }}</span>
          </template>
        </v-autocomplete>
      </v-card>
      <v-card
        class="d-flex align-self-center newteam"
        style="margin-top: 15px;width:130px"
        text
        tile
      >
        <v-dialog v-model="dialog" persistent max-width="500">
          <template v-slot:activator="{ on, attrs }">
           
            <v-btn
              color="#144584"
              class="white--text"
              width="180px"
              height="40px"
              style="font-size: 12px;text-align:center"
              v-bind="attrs"
              v-on="on"
              :retain-focus-on-click="true"
            >
             
              Teams
              <v-icon right
              
                >mdi-plus-circle
              </v-icon>
            </v-btn>
             <v-dialog v-model="showInvite" max-width="500">
            <template v-slot:activator="{ on, attrs }">
              <!-- <v-avatar size="20" color="red"> -->
                <v-btn v-bind="attrs" v-on="on" color="transparent" text >
              <v-icon size="32"  right  color="#144584" style="margin-left:-15px"
              >mdi-account-multiple-plus</v-icon>
                </v-btn>
              <!-- </v-avatar> -->
            </template>
            <v-card>
              <v-card-title>Invite People</v-card-title>
              <v-card-text class="ma-0 pa-0" style="background-color:#FAFAFA">
                <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    style="padding-bottom:0;margin-bottom:0"
                  >
              <v-textarea
              outlined              
              rows="5"
              label="Enter the comma separated invitees email"
              v-model="inviteesEmail"              
            ></v-textarea>
                  </v-col>
                   <v-col
                    style="padding-top:0;margin-top:0"
                    cols="12"
                    sm="12"
                    md="12"
                  >
             <v-select
             dense outlined label="Role" placeholder="Select Role"
              :items="inviteRoles" item-text="value" item-value="id" v-model="inviteRole" />
                  </v-col>
              </v-card-text>
              <v-card-actions>
              <v-spacer></v-spacer>
          
          <v-btn
            color="blue darken-1"
            text
            @click="showInvite = false"
          >
            Cancel
          </v-btn>
           <v-btn
            color="blue darken-1"
            text
           @click="sendInvite"
          >
            Invite
          </v-btn>
              </v-card-actions>
            </v-card>
             </v-dialog>
          </template>
          <v-card>
            <v-card-title>Teams</v-card-title>
            <v-tabs v-model="choice">
              <v-tab class="font-weight-bold" :key="1">Create Team</v-tab>
              <v-tab class="font-weight-bold" :key="2">Add new member</v-tab>
            </v-tabs>
            <v-tabs-items v-model="choice" ref="chosentab">
              <v-tab-item :key="1">
                <v-card flat class="pa-2">
                  <v-card-text>
                    <v-text-field
                      label="Name"
                      dense
                      v-model="newTeamName"
                    ></v-text-field>
                    <v-autocomplete
                      multiple
                      return-object
                      v-model="selectedUsersAddtoTeam"
                      :key="String(selectedUsersAddtoTeam)"
                      :items="allUsers"
                      item-text="Name"
                      placeholder="Select Users.."></v-autocomplete>
                  </v-card-text>
                  <!-- <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialog=false">Cancel</v-btn>
                    <v-btn text @click="createTeam" color="indigo">Save</v-btn>
                  </v-card-actions> -->
                </v-card>
              </v-tab-item>
              <v-tab-item :key="2" class="pa-8">
                <v-select
                  dense
                  :items="teams"
                  item-value="TeamID"
                  item-text="Name"
                  v-model="toaddteam"
                  outlined
                  placeholder="Select Team"
                  @change="selectExistingUsers"
                >
                </v-select>
                <v-autocomplete
                  multiple
                  return-object
                  v-model="selectedUsersAddtoTeam"
                  :key="String(selectedUsersAddtoTeam)"
                  :items="allUsers"
                  item-text="Name"
                  placeholder="Select users"
                ></v-autocomplete>
                <!-- <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog=false">Cancel</v-btn>
                  <v-btn text @click="createTeam" color="indigo">Save</v-btn>
                </v-card-actions> -->
              </v-tab-item>
            </v-tabs-items>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="dialog = false">Cancel</v-btn>
              <v-btn text @click="createTeam(choice)" color="indigo">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
      <div class="selectiondiv" :style="{ minHeight: windowHeight + 'px' }">
        <div class="ma-2">
          <v-expansion-panels>
            <v-expansion-panel
              v-for="team in selectedTeams"
              :style="{
                border: '1px solid ' + team.color,
                borderRadius: 4 + 'px',                
              }"
              :key="team.TeamID +'_'+ `${team.color &&team.color.indexOf('#') > -1 ? team.color.split('#')[1] : team.color}`"
              class="panelborder"
            >
              <v-expansion-panel-header class="pa-0" >
                <template v-slot:actions>
                  <v-icon
                    class="icon"
                    @click="toggleTeam(team)"
                    :color="team.color !== 'white' && team.color"
                    :ref="'team_' + team.TeamID"
                    >mdi-plus-circle</v-icon
                  >
                </template>
                <span
                @click="removeTeam(team)"
                  class="header"                                            
                 :style="team.color !== 'white' && 'color:'+team.color "
                  >
                  {{ team.Name }}              
                   <v-avatar size="30" right style="float:right;margin-top:-10px" :style="team.color == 'white' ? 'border-color: #bebebe' : 'border-color:'+team.color" class="userlist-mark-green "><span style="font-weight:bold">{{parseInt(team.value)}}</span></v-avatar>
                </span>
               
                 
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <TeamItem :ref="'teamitem_' + team.TeamID" v-on:teamselect="selectforTeam" :allUsers="allUsers" :team="team" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
        <h5 v-if="!selectedUsers.length">No matches</h5>
        <v-list
          dense
          nav
          class="sidebar overflow-y-auto"
          v-if="selectedUsers.length"
        >
          <v-list-item
            v-for="user in selectedUsers"
            :key="user.title+'_'+ `${user.color &&user.color.indexOf('#') > -1 ? user.color.split('#')[1] : user.color}`"
            link
            @click="removeUser(user)"
            :style="{
              border: '1px solid ' + user.color,
              borderRadius: 4 + 'px',
            }"
            ref="userlist"
          >
            <UserItem :user="user" />
          </v-list-item>
        </v-list>
      </div>
    </div>
  </v-card>
</template>
  
<script>
import TeamItem from "./widgets/TeamItem";
import UserItem from "./widgets/UserItem";
import moment from "moment";
export default {
  async created() {
    try {
      this.$store.commit("SET_IS_LOADING", true);
      await this.getUsersandTeams();
      await this.getUsers();
      await this.getTeams();
     // this.$store.commit("resetState");
      if(localStorage.getItem("selectedusers")) {
       const users = JSON.parse(localStorage.getItem("selectedusers"));
       users.forEach(user => {        
         if (user.color !== 'white') {
         this.addorUpdateUser(user);
         }  else {
           this.selectedUsers.push(user);
         }
          this.selectedItems.push(user);
         this.selectedEntities.push(user);     
       });
       this.addSelectedTeamNames();
     }
     this.allUsers = this.selectedUsers.concat(this.users);
     if(localStorage.getItem("selectedteams")) {
       const teams = JSON.parse(localStorage.getItem("selectedteams"));
       teams.forEach(team => {         
         if (team.color !== 'white') {
         this.addorUpdateTeam(team);
         } else {
           this.selectedTeams.push(team);
         }
         this.selectedItems.push(team);
         this.selectedEntities.push(team);
         
       });
       this.addSelectedTeamNames();
     }
    
     
    } catch (error) {}
    this.$store.commit("SET_IS_LOADING", false);
    // this.assignedColors.push([]);
  },

  components: {
    TeamItem,
    UserItem,
  },
  
  props: ["timeMode", "dateRange", "searchString"],
  data() {
    return {
      users: [],
      selectedItems: [],
      mode: [
        { id: "activetime", title: "Active" },
        { id: "idletime", title: "Idle" },
        { id: "output", title: "Contribution" },
        { id: "activity", title: "Engagement" },
        { id: "tempo", title: "Tempo" },
        { id: "composite", title: "Composite" },
      ],
      teams: [],
      selectedUsersAddtoTeam:[],
      dialog: false,
      showInvite:false,
      inviteesEmail: null,
      inviteRoles: [{"id":1,"value":"Manager"},{"id":2,"value":"Employee"}],
      inviteRole:null,
      selectedMode: "activity",
      selectedUsers: [],
      selectedTeams:[],
      allUsers: [],
      entities: null,
      selectedEntities:[],
      choice: 2,
      newTeamName: "",
      toaddteam: null,      
      colors: ["#473198", "#ffb84e", "#D782BA", "#4cb3d2", "#3bb08d"],
      assignedColors: [],     
      selectedTeamNames: "",
      windowHeight: document.documentElement.scrollHeight,
    };
  },
  
  computed: {
    userids:function(){
      return this.selectedUsers.map((item) => { return item.UserID})
    },
  
  },
  watch: {
   
    selectedMode: function () {
      this.$emit("mode-change", this.selectedMode);
      this.getUsers();
      this.getUsersandTeams();
      this.created();
    },

   
  },
  mounted() {
    this.windowHeight = document.body.scrollHeight;
    this.$watch(
      (vm) => [vm.timeMode, vm.dateRange],
      (val) => {
        this.getUsers();
        this.getUsersandTeams();
      }
    );
  },
  methods: {  
    selectforTeam:function(user){
      if(this.userids.includes(user.UserID)){
        //alert('already selected')
      }
      else{
        //this.add(user);
        this.selectedItems.push(user);
        this.checkMaximumAllowed();
      }
    },
    checkMaximumAllowed() {
      if (this.$store.state.selectedEntities.length >=  5) {
        this.selectedItems.splice(this.selectedItems.length - 1, 1);       
        return;
      } else {
       // this.addorUpdateEntity()
      // this.selectedEntities = Object.assign([], this.selectedItems);
      if (this.selectedEntities.length < this.selectedItems.length) {
var addedEntity = this.selectedItems[this.selectedItems.length -1];
      addedEntity.type === "user" ? this.addorUpdateUser(addedEntity) : this.addorUpdateTeam(addedEntity);
      this.selectedEntities = Object.assign([], this.selectedItems);
      } else if (this.selectedEntities.length > this.selectedItems.length) {
        this.selectedEntities.forEach(entity => {
          if (entity.type === "user") {
 var index = this.selectedItems.findIndex(x => x.type === entity.type && x.UserID === entity.UserID );
          if (index < 0) {
            this.addorUpdateUser(entity);
          }
          } else if (entity.type === "team") {
 var index = this.selectedItems.findIndex(x => x.type === entity.type && x.TeamID === entity.TeamID );
          if (index < 0) {
            this.addorUpdateTeam(entity);
          }
          }
         
          
        });
        this.selectedEntities = Object.assign([], this.selectedItems);
      
      }
         localStorage.setItem("selectedteams", JSON.stringify(this.selectedTeams));
        localStorage.setItem("selectedusers", JSON.stringify(this.selectedUsers));
      // console.log(this.selectedEntities)
        this.addSelectedTeamNames();
      }
     // var itemids = this.selectedItems.map((item)=> {return item.UserID})
      // console.log('item',itemids)
      // console.log(this.selectedItems[0])
      // console.log(this.selectedTeams[0])
      // console.log(this.selectedUsersforManager[0])
    },
    addSelectedTeamNames() {
      this.selectedTeamNames = "";
      this.selectedItems.forEach((element, index) => {        
        this.selectedTeamNames += index > 0 ? "," + element.Name : element.Name;       
      });
      
      // this.selectedUsers.forEach(element => {        
      //   var exists = this.selectedItems.filter(x => x.UserID === element.UserID && x.type === "user");        
      //   if (!exists || exists.length === 0) {
      //     this.crudUser(element);
      //   }
      // });
    },
    addorUpdateUser(user){
  if (this.selectedUsers.includes(user)) {
        var index = this.selectedUsers.indexOf(user);
        this.selectedUsers.splice(index, 1);
       // this.users.splice(user.UserID, 0, user);
        //this.selectedUsersforManager.splice(user.UserID,0,user)
        this.selectedUsers.sort((a, b) => {
          return a.UserID - b.UserID;
        });
        this.popAssignedColor(user);
        user.color = "white";        
        this.changeStore(user, "user");
        this.updateUserColorinTeam(user);
      } else if (this.$store.state.selectedEntities.length < 5) {// debugger;
        this.selectedUsers.splice(0, 0, user);
        // this.selectedUsers.forEach((element) => {
        //   var index = this.users.indexOf(element);
        //   var index1 = this.selectedUsersforManager.indexOf(element);
        //   // if (index > -1) {
        //   //   this.users.splice(index, 1);
        //   // }
        //   if (index1 > -1) {
        //     this.selectedUsersforManager.splice(index1, 1);
        //   }
        // });
       // debugger;
       // if (!user.color || user.color === 'white') {         
        this.pushAssignedColor();
        user.color = this.assignedColors[this.assignedColors.length - 1];
       // }
        
      
          this.changeStore(user, "user");
         
        this.updateUserColorinTeam(user);
      }
    },
     addorUpdateTeam(team){
  if (this.selectedTeams.includes(team)) {
       var index = this.selectedTeams.indexOf(team);
        this.selectedTeams.splice(index, 1);
       // this.users.splice(user.UserID, 0, user);
        //this.selectedUsersforManager.splice(user.UserID,0,user)
        this.selectedTeams.sort((a, b) => {
          return a.TeamID - b.TeamID;
        });
        this.popAssignedColor(team);
        team.color = "white";        
        this.changeStore(team, "team");        
      } else if (this.$store.state.selectedEntities.length < 5) {// debugger;
        this.selectedTeams.splice(0, 0, team);
        // this.selectedUsers.forEach((element) => {
        //   var index = this.users.indexOf(element);
        //   var index1 = this.selectedUsersforManager.indexOf(element);
        //   // if (index > -1) {
        //   //   this.users.splice(index, 1);
        //   // }
        //   if (index1 > -1) {
        //     this.selectedUsersforManager.splice(index1, 1);
        //   }
        // });
       // debugger;
     //   if (!team.color || team.color === 'white') {         
        this.pushAssignedColor();
        team.color = this.assignedColors[this.assignedColors.length - 1];
       // }     
      
          this.changeStore(team, "team");         
        
      }
    },
    updateUserColorinTeam(user) {
       
this.selectedTeams.forEach(team => {//debugger;
  var element = this.$refs["teamitem_" + team.TeamID];
  if (element) {
    element[0].updateColor(user);
  }
});
    },
    popAssignedColor(entity) {
      this.colors.push(entity.color);
      var colorIndex = this.assignedColors.findIndex((x) => x === entity.color);
      this.assignedColors.splice(colorIndex, 1);
      // localStorage.setItem("colors", JSON.stringify(this.colors));
      // localStorage.setItem("assignedColors", JSON.stringify(this.assignedColors));
    },
    pushAssignedColor() {
      this.assignedColors.push(this.colors[0]);
      this.colors.splice(0, 1);      
    },
   
    changeStore(value, type) {
      var store = {};
      if (type == "user") {
        store.id = value.UserID;
        store.type = "user";
      } else {
        store.id = value.TeamID;
        store.type = "team";
      }
      store.name = value.Name;
      store.isSelected = true;
      var length = this.$store.state.selectedEntities.length;

      store.color = value.color;
      this.$store.commit("changeSelected", store);
    },
    removeTeam(team) {
      if (team.color !== 'white') {       
        this.popAssignedColor(team);
        team.color = "white";   
         this.changeStore(team, "team"); 
        this.selectedTeams.sort((a, b) => (a.color > b.color) ? 1 : -1)
        localStorage.setItem("selectedteams", JSON.stringify(this.selectedTeams));
        
      } else if(this.$store.state.selectedEntities.length < 5){
         this.pushAssignedColor();
        team.color = this.assignedColors[this.assignedColors.length - 1];
        this.changeStore(team, "team"); 
        this.selectedTeams.sort((a, b) => (a.color > b.color) ? 1 : -1)
        localStorage.setItem("selectedteams", JSON.stringify(this.selectedTeams));
      }    
      
       
        
    },
    removeUser(user) {
      if (user.color !== 'white') {
        this.selectedUsers.sort((a, b) => {
          return a.UserID - b.UserID;
        });
        this.popAssignedColor(user);
        user.color = "white";    
         this.changeStore(user, "user"); 
        this.updateUserColorinTeam(user);
        this.selectedUsers.sort((a, b) => (a.color > b.color) ? 1 : -1)
        localStorage.setItem("selectedusers", JSON.stringify(this.selectedUsers));
      } else if(this.$store.state.selectedEntities.length < 5){
         this.pushAssignedColor();
        user.color = this.assignedColors[this.assignedColors.length - 1];
         this.changeStore(user, "user"); 
        this.updateUserColorinTeam(user);
        this.selectedUsers.sort((a, b) => (a.color > b.color) ? 1 : -1)
        localStorage.setItem("selectedusers", JSON.stringify(this.selectedUsers));
      }    
       
    },
    toggleTeam(Selectedteam) {
      this.selectedTeams.forEach((team /*, index*/) => {
        if (team.TeamID !== Selectedteam.TeamID) {
          var control = this.$refs["team_" + team.TeamID][0].$el;
          control.classList.remove("mdi-minus-circle");
          control.classList.add("mdi-plus-circle");
          // this.iconList[index] = "mdi-plus-circle";
        }
      });
      // this.iconList[toggindex] = this.iconList[toggindex] === "mdi-plus-circle" ? "mdi-minus-circle" : "mdi-plus-circle";
      // console.log(this.iconList);

      var control = this.$refs["team_" + Selectedteam.TeamID][0].$el;

      if (control.classList.contains("mdi-plus-circle")) {
        control.classList.remove("mdi-plus-circle");
        control.classList.add("mdi-minus-circle");
      } else {
        control.classList.remove("mdi-minus-circle");
        control.classList.add("mdi-plus-circle");
      }
    },
    async createTeam(choice) {
      var arr = [];
      this.selectedUsersAddtoTeam.forEach((user) => {
        arr.push(user.UserID);
      });
      var post_data = {};
      if(choice==0) { 
        //console.log('create',arr)
        if (this.newTeamName.length != 0) {
          post_data["teamname"] = this.newTeamName;
          post_data["isNew"] = 1;
        }
        else {
          alert('Please enter a name for the new team!')
        }
      }
      else if(choice==1){ 
        //console.log('add new member(s)',arr)
        post_data["teamID"] = this.toaddteam;
        post_data["isNew"] = 0; 
      }
      post_data["managerID"] = this.getUserDetails().UserID;
      post_data["userIDs"] = arr;
      try {
        var res = await this.$apiService.post(
          "/common/addTeamWithUsers",
          post_data
        );
        if (res.data.status === "ok") {
          this.dialog = false;
        //  this.selectedUsers = [];
         // this.getTeams();
          this.getUsersandTeams();
        }
      } catch (error) {
        console.log(error);
      }
    },   
   
    async getUsers() {
      //  var selected = Object.assign([],this.selectedUsers);
      //  for(let user of this.selectedUsers) {
      //    this.crudUser(user);
      //  }
      try {
        var res = await this.$apiService.post(
          "/users/getAllEmployeesWithScores",
          {
            mode: this.selectedMode,
            timeMode: this.timeMode,
            enddate:
              this.dateRange &&
              moment(this.dateRange.endDate).format("YYYY-MM-DD HH:mm:ss"),
            startdate:
              this.dateRange &&
              moment(this.dateRange.startDate).format("YYYY-MM-DD HH:mm:ss"),
          }
        );
        if (res.data.status == "ok") {
          this.users = res.data.result;
          // this.selectedUsers = [];

          //this.allUsers = this.users;
          //var selectedEntities = this.$store.state.selectedEntities;
          //this.selectedUsers = [];
          // debugger;

          if (this.selectedUsers.length) {
            for (let user of this.selectedUsers) {
              // this.crudUser(user);
              //this.selectedUsers.push(user);
              var existingIndex = this.users.findIndex(
                (x) => x.UserID === user.UserID
              );
              if (existingIndex > -1) {
                user.value = this.users[existingIndex].value;
              }
            }
            //this.filteredUsers = this.allUsers;
          }
          this.allUsers = this.selectedUsers.concat(this.users);
          this.selected = [];
          //  selectedEntities.forEach((entity) => {
          //    if (entity.type === "user") {
          //     // this.selectedUsers.push(entity);
          //     var user = this.allUsers.filter(x => x.UserID === entity.id)[0];
          //       this.crudUser(user,true);
          //     //  this.selectedUsers.push(entity);
          //    }
          //  })
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getUsersandTeams() {
      try {
        var res = await this.$apiService.post("users/getAllEmployeesAndTeams", {
          mode: this.selectedMode,
          timeMode: this.timeMode,
          managerID: this.getUserDetails().UserID,
        });
        if (res.status == 200) {
        //  debugger;
//           if (teamAdded) {
// this.entities.push(res.data.result[res.data.result -1]);
//           } else {
          this.entities = res.data.result;
          this.entities = this.entities.sort((a, b) => a.type.localeCompare(b.type));
          //}
         // console.log(this.entities.length);
        }
      } catch (e) {}
    },
    async getTeams() {
      try {
        var res = await this.$apiService.post(
          "/common/getAllTeamsWithMembers",
          {
            managerID: this.getUserDetails().UserID,
          }
        );
        if (res.status == 200) {
          this.teams = res.data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

  selectExistingUsers(){
    this.selectedUsersAddtoTeam = [];
    var selectedTeam = this.teams.filter(x => x.TeamID === this.toaddteam);
    if (selectedTeam && selectedTeam.length) {
      selectedTeam[0].EmployeeID.forEach(userID => {
        var user = this.allUsers.filter(x => x.UserID === userID)[0];
        user && this.selectedUsersAddtoTeam.push(user);
      });
      var existingUsers = this.selectedUsersAddtoTeam;
      if (existingUsers && existingUsers.length) {    
     this.allUsers = this.allUsers.sort(function(a, b) {
  return existingUsers.indexOf(b) - existingUsers.indexOf(a);
});
      }
        
    }
    
  },    
    async sendInvite() {
 var res = await this.$apiService.post("common/emailInvite", {
          emailIDs: [this.inviteesEmail],
          roleID: this.inviteRole          
        });
        if (res.status === 200) {
          this.showSuccess("Invite(s) sent successfully");
          this.showInvite = false;
        }
    }
  },
};
</script>

<style scoped>
.icon {
  order: 0;
  margin-left: 10px;
}

.header {
  order: 1;
  margin-left: 10px;
  font-size: 14px;
  font-family: "Open Sans";
  background-color: transparent !important;
  margin-top:8px
}

.md-drawer {
  width: 258px;
  max-width: calc(100vw - 135px);
  top: 86px !important;
  background-color: #ffffff;
}

.emptitle {
  position: relative;
  width: 97px;
  height: 25px;
  left: 5px;
  font-family: Open Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 25px;
  color: #202031;
  top: 4px;
}
.employeedd {
  position: relative;
  width: 110px;
  left: 28px;
}
.newteam {
  width: 218px ;
  height: 40px;
  left: 30px !important;
  font-family: Open Sans;
  font-style: normal;
  font-weight: normal;
  line-height: 19px;
  color: #b2b2bf;
  margin-top: -25px;
  text-align: center;
}

.select-bg {
  background-color: red;
}

.normal-bg {
  background-color: inherit;
}

.userlist-item {
  text-align: left;
}

.userlist-mark-red {
  border: 1px solid #4a01f5;
  box-sizing: border-box;
}

.userlist-mark-green {
  border: 1px solid #41db04;
  /* box-sizing: border-box; */
}
.panelborder {
  padding: 0px;
  margin: 0px;
  border-radius: 4px;
  margin-top: 10px;
  
}
.selectiondiv {
  /* height: auto; */
  overflow-y: scroll;
  margin-top: 10px;
  background-color: transparent !important;
}



>>> .v-expansion-panel-content__wrap {
  padding: 0 !important;
}


.userlist-mark-green {
  margin-top:10px;
  border: 1px solid #41db04;
  box-sizing: border-box;
  margin-right:4px;
}

</style>

