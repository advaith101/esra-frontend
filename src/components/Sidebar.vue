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
              v-bind:key="team.TeamID"
              class="panelborder"
            >
              <v-expansion-panel-header>
                <template v-slot:actions>
                  <v-icon
                    class="icon"
                    @click="toggleTeam(team.TeamID)"
                    :color="team.color"
                    :ref="'team_' + team.TeamID"
                    >mdi-plus-circle</v-icon
                  >
                </template>
                <span
                  class="header"
                  @click.stop="removeTeam(team.TeamID)"
                  :style="{ color: team.color }"
                  >{{ team.Name }}
                </span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <TeamItem :ref="'teamitem_' + team.TeamID" v-on:teamselect="selectforTeam" :allUsers="allUsers" :team="team" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
        <h5 v-if="!filteredUsers.length">No matches</h5>
        <v-list
          dense
          nav
          class="sidebar overflow-y-auto"
          v-if="filteredUsers.length"
        >
          <v-list-item
            v-for="user in filteredUsers"
            :key="user.title"
            link
            @click="crudUser(user)"
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
      this.allUsers = this.selectedUsers.concat(this.users);
      var entitiesInStore = false;
      if (this.$store.state.selectedEntities.length) {
        entitiesInStore = true;
      }
      if (localStorage.getItem("colors")) {
      this.colors = JSON.parse(localStorage.getItem("colors"));
       this.assignedColors =  JSON.parse(localStorage.getItem("assignedColors"));
      }
      if(
        localStorage.getItem("selectedItems") !== null &&
        localStorage.getItem("selectedItems") !== undefined
      ){
        this.selectedItems= JSON.parse(localStorage.getItem("selectedItems"))
      }
      
      if (
        localStorage.getItem("selectedEntities") !== null &&
        localStorage.getItem("selectedEntities") !== undefined
      ) {
        // this.$store.commit("resetState");
        // this.$store.state.selectedEntities = Object.assign([],[]);
        var selectedEntities = JSON.parse(
          localStorage.getItem("selectedEntities")
        );
        if (!entitiesInStore) {
          localStorage.removeItem("selectedEntities");
        }
       // debugger;
        
        selectedEntities.forEach((entity) => {
          if (entity.type === "user") {
            // this.selectedUsers.push(entity);
            var user = this.allUsers.filter((x) => x.UserID === entity.id)[0];
             user.color = entity.color;
           // this.assignedColors.push(user.color);
           // debugger;
           // var index = this.colors.findIndex(x => x === user.color);
      // this.colors.splice(index, 1);
            this.crudUser(user, entitiesInStore);
            var index
            this.selectedUsersforManager.forEach((x,i)=>{
              if(x.UserID===entity.UserID){
                index = i
              }
            })
            this.selectedUsersforManager.splice(index,1)
            //  this.selectedUsers.push(entity);
          // } else {
          //   var team = this.teams.filter((x) => x.TeamID === entity.id)[0];
          //   this.allowTeamAddition = false;
          //   this.selectedTeams.push(team);
          //   this.bufferTeams.push(team);
          //   this.pushAssignedColor();
          //   team.color = this.assignedColors[this.assignedColors.length - 1];
          //   if (!entitiesInStore) {
          //     this.changeStore(team, "team");
          //   }
          }
        });
      }
      this.addSelectedTeamNames();
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
      allUsers: [],
      entities: null,
      choice: 2,
      newTeamName: "",
      toaddteam: null,
      bufferTeam: null,
      bufferTeams: [],
      expToggleIndex: "",
      exptogg: false,
      colors: ["#473198", "#ffb84e", "#D782BA", "#4cb3d2", "#3bb08d"],
      assignedColors: [],
      allowTeamAddition: true,
      selectedTeamNames: "",
      windowHeight: document.documentElement.scrollHeight,
    };
  },
  computed: {
    userids:function(){
      return this.selectedUsers.map((item) => { return item.UserID})
    },
    selectedTeams:function(){
      return this.selectedItems.filter((user)=>{ return user.type ==='team' })
    },
    selectedUsersforManager:function(){
       return this.selectedItems.filter((user)=>{return ((user.type=='user') && !(this.userids.includes(user.UserID)))})

    },
    filteredUsers: function () {
      return this.selectedUsers.concat(this.selectedUsersforManager); /*.filter((item) => /*{
        return user.Name.toUpperCase().match(this.searchString.toUpperCase());
      }*/
    },
  },
  watch: {
    selectedUsers:function(){
     // console.log('entities:',this.userids)
    },
    // selectedTeams:function(){
    //  // console.log(this.selectedTeams)
    // },
    selectedItems:function(){
      //debugger;
      localStorage.setItem("selectedItems",JSON.stringify(this.selectedItems));
    },
    filteredUsers: function () {
      this.filteredUsers.forEach((element, i) => {
        if (!this.selectedUsers.includes(element)) {
          // this.$refs.userlist[i].$el.style.border = '2px solid '+ this.$store.state.selectedEntities.filter(x => x.type === "user" && x.id === element.UserID)[0].color;
          element.color = "white";
        }
        // else{
        //   // this.$refs.userlist[i].$el.style.backgroundColor = 'white';
        //   this.$refs.userlist[i].$el.style.border = '2px solid white';
        // }
      });
    },
    selectedMode: function () {
      this.$emit("mode-change", this.selectedMode);
      this.getUsers();
      this.getUsersandTeams();
      this.created();
    },

    selectedTeams: function (value) {
      if (!this.allowTeamAddition) {
        this.allowTeamAddition = true;
        return;
      }

      if (value === null || !value.length) {
        for (var i = 0; i < this.bufferTeams.length; i++) {
          //  if(this.bufferTeams[i].TeamID != value[i].TeamID) {
          this.popAssignedColor(this.bufferTeams[i]);
          this.bufferTeams[i].color = "";
          this.changeStore(this.bufferTeams[i], "team");
          //  this.bufferTeams.splice(i, 1)
          // }
        }
        this.bufferTeams = [];
        // return;
      } else if (this.bufferTeams.length > value.length) {
        for (var i = 0; i < this.bufferTeams.length; i++) {
          var existingIndex = value.findIndex(
            (x) => x.TeamID === this.bufferTeams[i].TeamID
          );
          if (existingIndex < 0) {
            this.popAssignedColor(this.bufferTeams[i]);
            this.bufferTeams[i].color = "";
            this.changeStore(this.bufferTeams[i], "team");
            this.bufferTeams.splice(i, 1);
            break;
          }
        }
      } else {
        var existingIndex = this.bufferTeams.findIndex(
          (x) => x.TeamID === value[value.length - 1].TeamID
        );
        if (existingIndex < 0) {
          this.bufferTeams.push(value[value.length - 1]);
          if (!value[value.length - 1].color) { 
          this.pushAssignedColor();
          value[value.length - 1].color = this.assignedColors[
            this.assignedColors.length - 1
          ];
         // debugger;
         //  const item = this.selectedItems.filter(x => x.type === "team" && x.TeamID === value[value.length - 1].TeamID);
          // item.color = value[value.length - 1].color;
          }
          // var self = this.$refs;
          // setTimeout(() => {
          //    self.teamPanel[0].$el.style.border = '2px solid '+ value[value.length -1].color;
          // }, 100);
        } else {
          this.popAssignedColor(this.bufferTeams[existingIndex]);
          this.bufferTeams[existingIndex].colors = "";
          this.bufferTeams.splice(existingIndex, 1);
        }
        this.changeStore(value[value.length - 1], "team");
      }
      localStorage.setItem("selectedItems",JSON.stringify(this.selectedItems));
      // this.selectedItems.filter(x => x.type === "team").forEach(element => {
      //   const item = this.selectedTeams.filter(x => x.type === "team" && x.TeamID === element.TeamID);
      //   if (item && item.length) {debugger;
      //   element.color = item.color;
      //   } else {
      //     element.color = null;
      //   }

      // });
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
        this.crudUser(user);
      }
    },
    checkMaximumAllowed() {
      if (this.selectedTeams.length + this.selectedUsers.length > 5) {
        this.selectedTeams.splice(this.selectedTeams.length - 1, 1);
        this.allowTeamAddition = false;
        return;
      } else {
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
      
      this.selectedUsers.forEach(element => {        
        var exists = this.selectedItems.filter(x => x.UserID === element.UserID && x.type === "user");        
        if (!exists || exists.length === 0) {
          this.crudUser(element);
        }
      });
    },
    popAssignedColor(entity) {
      this.colors.push(entity.color);
      var colorIndex = this.assignedColors.findIndex((x) => x === entity.color);
      this.assignedColors.splice(colorIndex, 1);
      localStorage.setItem("colors", JSON.stringify(this.colors));
      localStorage.setItem("assignedColors", JSON.stringify(this.assignedColors));
    },
    pushAssignedColor() {
      this.assignedColors.push(this.colors[0]);
      this.colors.splice(0, 1);
      
      localStorage.setItem("colors", JSON.stringify(this.colors));
      localStorage.setItem("assignedColors", JSON.stringify(this.assignedColors));
    },
    removeTeam(teamID) {
      var index = this.selectedItems.findIndex((x) => x.TeamID === teamID);
      this.selectedItems.splice(index, 1);
      this.addSelectedTeamNames();
    },
    toggleTeam(toggindex) {
      this.selectedTeams.forEach((team /*, index*/) => {
        if (team.TeamID !== toggindex) {
          var control = this.$refs["team_" + team.TeamID][0].$el;
          control.classList.remove("mdi-minus-circle");
          control.classList.add("mdi-plus-circle");
          // this.iconList[index] = "mdi-plus-circle";
        }
      });
      // this.iconList[toggindex] = this.iconList[toggindex] === "mdi-plus-circle" ? "mdi-minus-circle" : "mdi-plus-circle";
      // console.log(this.iconList);

      var control = this.$refs["team_" + toggindex][0].$el;

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
    remove(item) {
      const index = this.selectedTeams.indexOf(item);
      if (index >= 0) this.selectedTeams.splice(index, 1);
      this.bufferTeam = item;
    },
    reorderUser(user) {
      let usersList = this.users;
      usersList.forEach(function (item, i) {
        if (item.email === user.email) {
          usersList.splice(i, 1);
          usersList.unshift(item);
        }
      });
      this.users = usersList;
      this.$refs.userlist[0].$el.style.backgroundColor = "red"; //rgb(242, 246, 252)
    },

    async getCompany() {
      try {
        var res = await this.$apiService.post("/common/GetCompanies");
        if (res.status == 200) {
          this.company = res.data.data;
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

    isSelected(user) {
     // console.log(this.selectedUser.includes(user));
      return true;
    },
    updateUserColorinTeam(user) {
this.selectedTeams.forEach(team => {//debugger;
  var element = this.$refs["teamitem_" + team.TeamID];
  if (element) {
    element[0].updateColor(user);
  }
});
    },

    crudUser(user, entitiesInStore) {
      //  alert((this.selectedTeams.length + this.selectedUsers.length));
      //  alert((this.$store.state.selectedEntities.length));
      //  if (this.$store.state.selectedEntities >= 5) {
      //    this.selectedUsers.splice(this.selectedUsers.length-1,1);
      //    return;
      //  }
      if (this.selectedUsers.includes(user)) {
        var index = this.selectedUsers.indexOf(user);
        this.selectedUsers.splice(index, 1);
        this.users.splice(user.UserID, 0, user);
        //this.selectedUsersforManager.splice(user.UserID,0,user)
        this.users.sort((a, b) => {
          return a.UserID - b.UserID;
        });
        this.popAssignedColor(user);
        user.color = "white";
        this.allUsers = this.selectedUsers.concat(this.users);
        this.changeStore(user, "user");
        this.updateUserColorinTeam(user);
      } else if (this.$store.state.selectedEntities.length < 5) {
        this.selectedUsers.splice(0, 0, user);
        this.selectedUsers.forEach((element) => {
          var index = this.users.indexOf(element);
          var index1 = this.selectedUsersforManager.indexOf(element);
          if (index > -1) {
            this.users.splice(index, 1);
          }
          if (index1 > -1) {
            this.selectedUsersforManager.splice(index1, 1);
          }
        });
       // debugger;
        if (!user.color || user.color === 'white') {         
        this.pushAssignedColor();
        user.color = this.assignedColors[this.assignedColors.length - 1];
        }
        this.allUsers = this.selectedUsers.concat(this.users);
        if (!entitiesInStore) {
          this.changeStore(user, "user");
         }
        //  else { 
        //   var store ={id: user.UserID, color:user.color};
        //   this.$store.commit("changeColor", store);
        // }
        this.updateUserColorinTeam(user);
      }
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
  margin-left: -10px;
}

.header {
  order: 1;
  margin-left: 10px;
  font-size: 14px;
  font-family: "Open Sans";
}

.md-drawer {
  width: 258px;
  max-width: calc(100vw - 135px);
  top: 86px !important;
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
  box-sizing: border-box;
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
}

.userlist-mark-green {
  margin-top:5px;
  border: 1px solid #41db04;
  box-sizing: border-box;
}

>>> .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>

