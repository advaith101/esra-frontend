<template>
  <v-card flat tile light>
    <v-data-table
      :headers="headers"
      :items="values"
      :loading="!values.length > 0"      
    >
      <template v-slot:item.active_time="{ item }">
        <span>{{ item.active_time }}</span
        ><br />
        <span v-if="item.active_time_pct >= 0" style="color: green">
          &#8593; {{ Math.round(item.active_time_pct) }} &#37;</span
        >
        <span v-else style="color: red">
          &#8593; {{ Math.round(item.active_time_pct) }} &#37;</span
        >
      </template>
      <template v-slot:item.idle_time="{ item }">
        <span>{{ item.idle_time }}</span
        ><br />
        <span v-if="item.idle_time_pct >= 0" style="color: green">
          &#8593; {{ Math.round(item.idle_time_pct) }} &#37;</span
        >
        <span v-else style="color: red">
          &#8595; {{ Math.round(item.idle_time_pct) }} &#37;</span
        >
      </template>
      <template v-slot:item.activity="{ item }">
        <span>{{ item.activity }}</span
        ><br />
        <span v-if="item.activity_pct >= 0" style="color: green">
          &#8593; {{ Math.round(item.activity_pct) }} &#37;</span
        >
        <span v-else style="color: red">
          &#8595; {{ Math.round(item.activity_pct) }} &#37;</span
        >
      </template>
      <template v-slot:item.output="{ item }">
        <span>{{ item.output }}</span
        ><br />
        <span v-if="item.output_pct >= 0" style="color: green">
          &#8593; {{ Math.round(item.output_pct) }} &#37;</span
        >
        <span v-else style="color: red">
          &#8595; {{ Math.round(item.output_pct) }} &#37;</span
        >
      </template>
      <template v-slot:item.composite="{ item }">
        <span>{{ parseInt(item.composite) }}</span><br/>
        <span v-if="item.activity_pct >= 0" style="color: green">
          &#8593; {{ Math.round(item.activity_pct) }} &#37;</span
        >
        <span v-else style="color: red">
          &#8595; {{ Math.round(item.activity_pct) }} &#37;</span
        >
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  created() {
    this.$watch(
      (vm) => [vm.dateRange, vm.timeMode, vm.selectedApps, vm.mode],
      async (val) => {
        await this.getData();
      },
      {
        deep: true,
      }
    );
    this.$watch(
      (vm) => [vm.selectedEntities],
      (val) => {
        this.getData();
      },
      {
        deep: false,
      }
    );
    this.getData();
  },
  props: ["selectedEntities", "dateRange", "selectedApps", "timeMode", "mode"],
  data() {
    return {
      headers: [
        { text: "", align: "start", value: "name" },
        { text: "Active Time", value: "active_time" },
        { text: "Idle Time", value: "idle_time" },
        { text: "Activity", value: "activity" },
        { text: "Output", value: "output" },
        { text: "Composite", value: "composite" },
      ],
      values: [],
    };
  },
  methods: {
    getReqBody() {
      var teamIDs = this.selectedEntities
        .filter((x) => x.type === "team" && x.isSelected)
        .map((y) => y.id);
      var userIDs = this.selectedEntities
        .filter((x) => x.type === "user" && x.isSelected)
        .map((y) => y.id);
      var post_data = {
        managerID: this.getUserDetails().UserID,
        teamIDs: teamIDs,
        userIDs: userIDs,
        timeMode: this.timeMode,
        enddate: this.dateRange.endDate,
        startdate: this.dateRange.startDate,
        //applicationIDs:this.selectedApps
      };
      //   var post_data = {
      //     userIDs: [],
      //     teamIDs: [20, 21, 22, 23],
      //     timeMode: 3,
      //     enddate: "2020-11-27",
      //     startdate: "2020-11-01",
      //     applicationIDs: [1, 2, 3, 4, 5],
      //     managerID: 2,
      //   };
      //console.log(teamIDs,userIDs)
      // var post_data = {
      //     teamIDs: [20,21],
      //     userIDs: [1,2,3],
      //     enddate:"2020-11-27",
      //     startdate:"2020-11-01",
      //     //applicationIDs:[1,2,3,4,5]
      // }
      if (this.selectedApps.length) {
        post_data = { ...post_data, applicationIDs: this.selectedApps };
      }
      return post_data;
    },
    async getData() {
      var post_data = this.getReqBody();
      var res = await this.$apiService.post("/users/activityTable", post_data);
      if (res.status === 200) {
        this.values = res.data.result;
      }
    },
  },
};
</script>