<template>
  <div>
    <v-chip-group>
      <v-chip
        label
        :ref="'chip_' + user.type + user.id"
        outlined
        v-bind:key="index"
        v-for="(user, index) in selectedEntities"
        @click="
          user.isSelected = !user.isSelected;
          updateBorder(user, true);
        "
      >
        {{ user.name }}
        <v-icon v-if="user.isSelected" x-small right>mdi-eye</v-icon>
        <v-icon v-else x-small right>mdi-eye-off</v-icon>
      </v-chip>
    </v-chip-group>
    <div v-if="radarChartSeries.length > 0">
      <apexchart
        ref="radarchart"
        type="radar"
        :series="radarChartSeries"
        :options="radarOptions"
        height="250"
      ></apexchart>
    </div>
    <div v-else>
      <apexchart
        type="radar"
        :series="series"
        :options="radarOptions"
        height="250"
      ></apexchart>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  async created() {
    // this.getRadarChartData();
    // this.selectedEntities = Object.assign([{}], this.$store.state.selectedEntities);
    this.series.push({ name: " ", data: [] });
  },
  data() {
    return {
      // reqPayload:{},
      chartData: [],
      radarChartSeries: [],
      series: [],
      //  selectedEntities:[],
      radarOptions: {
        chart: {
          height: 350,
          type: "radar",
          // dropShadow: {
          //   enabled: true,
          //   blur: 1,
          //   left: 1,
          //   top: 1,
          // },
        },
        noData: {
          text: 'No entity selected',
        },
        plotOptions: {
          radar: {
            size: 140,
            polygons: {
              strokeColors: "#e9e9e9",
              // fill: {
              //   colors: ["#FFB84E", "#3BB08D", "#4CB3D2"],
              // },
            },
          },
        },
        legend: { show: false, position: "top", horizontalAlign: "left" },
        colors: ["#FFB84E", "#3BB08D", "#4CB3D2"],
        title: {
          text: "",
        },
        stroke: {
          width: 2,
        },

        markers: {
          size: 1,
          colors: ["#FFA41B"],
          strokeColors: "#fff",
          strokeWidth: 2,
          hover: {
            size: 7,
          },
        },
        yaxis: {
          labels: {
            show: false,
            style: {
              color: "#828288",
              fontSize: "0px",
              fontFamily: "Open Sans",
            },
          },
          title: {
            text: "Score",
          },
        },
        xaxis: {
          labels: {
            style: {
              color: "#828288",
              fontSize: "10px",
              fontFamily: "Open Sans",
            },
          },
        },
      },
    };
  },
  props: ["selectedEntities", "selectedApps", "mode", "dateRange", "timeMode"],
  // computed: {
  //   selectedEntities: function() {
  //     return this.$store.state.selectedEntities.map(x => Object.assign({},x));
  //    //return this.$store.state.selectedEntities;
  //   },
  // },
  async mounted() {
    // this.selectedEntities =Object.assign({}, this.$store.state.selectedEntities);
    this.$watch(
      (vm) => [
        vm.selectedEntities,
        vm.selectedApps,
        vm.dateRange,
        vm.timeMode,
        vm.mode,
      ],
      async (val) => {
        await this.getRadarChartData();
        // setTimeout(() => {
        this.selectedEntities.forEach((element) => {
          this.updateBorder(element);
        });
        // }, 100);
      },
      {
        immediate: true, // run immediately
        deep: true, // detects changes inside objects. not needed here, but maybe in other cases
      }
    );
  },
  methods: {
    updateBorder(user, refreshChart) {
      var control = this.$refs["chip_" + user.type + user.id][0].$el;
      if (user.isSelected) {
        control.style.borderColor = user.color;
        control.style.setProperty("color", user.color, "important");
      } else {
        control.style.borderColor = "grey";
        control.style.setProperty("color", "black", "important");
      }
      // if (refreshChart ) {
      //   try {
      //   this.getRadarChartData();
      //   } catch (error) {
      //     alert(error);

      //   }

      // }
    },
    getRequestPayload() {
      var teamIDs = this.selectedEntities
        .filter((x) => x.type === "team" && x.isSelected)
        .map((y) => y.id);
      var userIDs = this.selectedEntities
        .filter((x) => x.type === "user" && x.isSelected)
        .map((y) => y.id);
      let reqPayload = {
        mode: this.mode.toLowerCase(),
        timeMode: this.timeMode,
        teamIDs: teamIDs,
        userIDs: userIDs,
        enddate: moment(this.dateRange.endDate).format("YYYY-MM-DD HH:mm:ss"),
        startdate: moment(this.dateRange.startDate).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
      };
      if (this.selectedApps.length) {
        reqPayload = { ...reqPayload, applicationIDs: this.selectedApps };
      }
      return reqPayload;
    },
    async getRadarChartData() {
      var payload = this.getRequestPayload();
      this.radarChartSeries = [];
      if (!payload.userIDs.length && !payload.teamIDs.length) {
        //this.insightNumber = 0;
       this.radarOptions = {...this.radarOptions, noData:{text:'No entity selected'}};
        return;
      }
      this.radarOptions = {...this.radarOptions, noData:{text:'Loading...'}};
      try {
        var res = await this.$apiService.post("/users/spiderchart", payload);
        if (res) {
          this.chartData = res.data.result;

          const categories = [];
          var colors = [];
          this.chartData.forEach((data) => {
            var entity = this.selectedEntities.filter(
              (x) => x.id === data.id && x.type === data.type
            )[0];
            colors = [...colors, entity.color];
            this.radarChartSeries.push({
              name: entity.name,
              data: data.values.map((x) => parseInt(x.value)),
            });
            //description.push(data.values.map(x =>x.name));
            categories.push(...data.values.map((x) => x.name));
          });

          // payload.userIDs.forEach((userID) => {
          //   const data = response.filter(
          //     (x) => x.id ===userID && x.type === "user");
          //   colors = [... colors,this.selectedEntities.filter(x => x.id === userID && x.type=== "user")[0].color];
          //   this.radarChartSeries.push({
          //     name: this.selectedEntities.filter(x => x.id === userID && x.type === "user")[0].name,
          //     data: data[0].values.map((y) => parseInt(y.value)),
          //   });

          //   categories.push(
          //     ...data[0].values.map((x) => x.name))
          // });
          // payload.teamIDs.forEach((teamID) => {
          //   const data = response.filter(
          //     (x) => x.id ===teamID && x.type === "team");
          //   colors = [... colors,this.selectedEntities.filter(x => x.id === teamID && x.type=== "team")[0].color];
          //   this.radarChartSeries.push({
          //     name: this.selectedEntities.filter(x => x.id === teamID && x.type === "team")[0].name,
          //     data: data[0].values.map((y) => parseInt(y.value)),
          //   });

          //   categories.push(
          //     ...data[0].values.map((x) => x.name))
          // });

          this.radarOptions = {
            ...this.radarOptions,
            ...{
              xaxis: {
                ...this.radarOptions.xaxis,
                categories: categories,
              },
              colors: colors,
              tooltip: {
                y: {
                  formatter: (val, opt) => {
                    try {
                      var values = this.chartData[opt.seriesIndex].values[
                        opt.dataPointIndex
                      ];
                      const value = values.value;
                      return values.name + ": " + value;
                    } catch (error) {
                      // console.log(opt.seriesIndex,opt.dataPointIndex);
                    }
                    return "";
                  },
                },
                x: {
                  formatter: (val, opt) => {
                    try {
                      return this.chartData[opt.seriesIndex].values[
                        opt.dataPointIndex
                      ].name;
                    } catch (error) {}

                    return "";
                  },
                },
              },
            },
          };
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

