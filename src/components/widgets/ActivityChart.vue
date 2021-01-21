<template>
  <div>
    <v-chip-group>
      <v-chip
        label
        outlined
        v-bind:key="index"
        :ref="'chip_' + user.type + user.id"
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
    <div v-if="activityChartSeries.length > 0">
      <apexchart
        ref="activitychart"
        type="line"
        height="295"
        :options="activityOptions"
        :series="activityChartSeries"
      ></apexchart>
    </div>
    <div v-else>
      <apexchart
        type="line"
        height="295"
        :series="series"
        :options="activityOptions"
      ></apexchart>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      //reqPayload: {},
      chartData: [],
      startDate: "6/01/2020",
      endDate: "12/27/2020",
      // selectedEntities:[],
      series: [],
      activityChartSeries: [],
      activityOptions: {
        chart: {
          height: 295,
          type: "line",
          stacked: false,
          toolbar: {
            tools: {
              download: false,
              selection: false,
              pan: false,
              reset: false,
            },
          },
        },

        stroke: {
          width: 7,
          curve: "smooth",
        },

        colors: [],
        grid: {
          show: false,
        },
        markers: {
          size: 0,
          colors: ["#FFA41B"],
          strokeColors: "#fff",
          strokeWidth: 2,
          hover: {
            size: 3,
          },
        },
        noData: {
          text: "Loading...",
        },
        yaxis: {
          labels: {
            style: {
              color: "#828288",
              fontSize: "10px",
              fontFamily: "Open Sans",
            },
          },
          title: {
            text: "Score",
          },
        },
        xaxis: {
          //  categories: ['1','2','3','4','5','6','7','8','9','10'],
          //tickAmount: 10,
          //type:'datetime',
          tickAmount: 1,
          //categories:[this.startDate,this.endDate],
          labels: {
            show: false,
            rotate: 0,
            style: {
              color: "#828288",
              fontSize: "10px",
              fontFamily: "Open Sans",
            },
          },
        },
        legend: {
          show: false,
        },
      },
    };
  },

  props: ["selectedEntities", "dateRange", "timeMode", "selectedApps", "mode"],
  // computed: {
  //   selectedEntities: function() {
  //     return this.$store.state.selectedEntities.map(x => Object.assign({},x));
  //    //return this.$store.state.selectedEntities;
  //   },
  // },
  created() {
    this.$watch(
      (vm) => [vm.dateRange, vm.timeMode, vm.selectedApps, vm.mode],
      async (val) => {
        await this.getActivityChartData();
        //this.getDates();
      },
      {
        // immediate: true, // run immediately
        deep: true, // detects changes inside objects. not needed here, but maybe in other cases
      }
    );
    // the second watch is specific to users and team since we dont need deep for them so that toggle
    // will work without reloading chart from api
    this.$watch(
      (vm) => [vm.selectedEntities],
      (val) => {
        this.getActivityChartData();
        setTimeout(() => {
          this.selectedEntities.forEach((element) => {
            this.updateBorder(element);
          });
        }, 100);
      },
      {
        //immediate: true, // run immediately
        deep: false, // detects changes inside objects. not needed here, but maybe in other cases
      }
    );
  },

  methods: {
    // getDates(){
    //   if(this.timeMode==5){
    //     this.startDate=moment(this.dateRange.startDate).format('MM/DD/YYYY');
    //     this.endDate=moment(this.dateRange.endDate).format('MM/DD/YYYY');
    //   }
    //   else if(this.timeMode==0){
    //     this.startDate=moment().subtract(1,'days').format('MM/DD/YYYY');
    //     this.endDate=moment().format('MM/DD/YYYY');
    //   }
    //   else if(this.timeMode==1){
    //     this.startDate=moment().subtract(5,'days').format('MM/DD/YYYY');
    //     this.endDate=moment().format('MM/DD/YYYY');
    //   }
    //   else if(this.timeMode==2){
    //     this.startDate=moment().subtract(1,'months').format('MM/DD/YYYY');
    //     this.endDate=moment().format('MM/DD/YYYY');
    //   }
    //   else if(this.timeMode==3){
    //     this.startDate=moment().subtract(6,'months').format('MM/DD/YYYY');
    //     this.endDate=moment().format('MM/DD/YYYY');
    //   }
    //   else if(this.timeMode==4){
    //     this.startDate=moment().subtract(1,'days').format('MM/DD/YYYY');
    //     this.endDate=moment().format('MM/DD/YYYY');
    //   }
    //   // console.log('start date:',this.startDate)
    //   // console.log('end date:',this.endDate)
    // },

    getRequestPayload() {
      var teamIDs = this.selectedEntities
        .filter((x) => x.type === "team" && x.isSelected)
        .map((y) => y.id);
      var userIDs = this.selectedEntities
        .filter((x) => x.type === "user" && x.isSelected)
        .map((y) => y.id);
      var mode = this.mode;
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
    updateBorder(user, refreshChart) {
      var control = this.$refs["chip_" + user.type + user.id][0].$el;
      if (user.isSelected) {
        control.style.borderColor = user.color;
        control.style.setProperty("color", user.color, "important");
      } else {
        control.style.borderColor = "grey";
        control.style.setProperty("color", "black", "important");
      }
      if (refreshChart) {
        var res = this.$refs.activitychart.toggleSeries(
          this.selectedEntities.filter(
            (x) => x.id === user.id && x.type === user.type
          )[0].name
        );
      }
    },
    async getActivityChartData() {
      var payload = this.getRequestPayload();
      this.activityChartSeries = [];
      if (!payload.userIDs.length && !payload.teamIDs.length) {
        //this.insightNumber = 0;
        return;
      }
      try {
        var res = await this.$apiService.post(
          "/users/activityAggregated",
          payload
        );
        if (res) {
          // var response = res.data.result;
          this.chartData = res.data.result;
          let categories = [];
          var colors = [];
          var description = [];
          this.activityChartSeries = [];

          this.chartData.forEach((data) => {
            var entity = this.selectedEntities.filter(
              (x) => x.id === data.id && x.type === data.type
            )[0];
            colors = [...colors, entity.color];
            var data1 = [];
            data.values.forEach((data) => {
              var obj = {
                x: moment(data.endtime).format("MM/DD/YYYY"),
                y: parseInt(data.value),
              };
              data1.push(obj);
            });
            this.activityChartSeries.push({
              name: entity.name,
              data: /*data.values.map(x =>parseInt(x.value))*/ data1,
            });
            description.push(data.values.map((x) => x.app));
            // categories.push(
            //   ...data.values.map((x) =>
            //     moment
            //       (x.endtime, "YYYY-MM-DDTHH:mm:ss")
            //       .format("HH:mm")
            //   )
            // );
          });
          //  categories = (categories.sort((a, b) => String(a).substring(0,2) - String(b).substring(0,2)))
          this.activityOptions = {
            ...this.activityOptions,
            ...{
              xaxis: {
                ...this.activityOptions.xaxis,
                //type: "datetime",
                //categories: [this.startDate,this.endDate],
                // tickAmount: 10,
              },
              tooltip: {
                y: {
                  title:{ formatter:(seriesName)=> seriesName},
                  formatter: (val, opt) => {
                    //          const desc =
                    // description[opt.seriesIndex][
                    //   opt.dataPointIndex
                    // ]
                    try {
                      var values = this.chartData[opt.seriesIndex].values[
                        opt.dataPointIndex
                      ];
                      const value = values.value;
                      return values.app + ": " + value;
                    } catch (error) {
                      // console.log(opt.seriesIndex,opt.dataPointIndex);
                    }
                    return "";
                  },
                },
                x: {
                  show:false,
                  formatter: (val, opt) => {
                    try {
                      return moment(
                        this.chartData[opt.seriesIndex].values[
                          opt.dataPointIndex
                        ].endtime,
                        "YYYY-MM-DDTHH:mm:ss"
                      ).format("MM-DD-YYYY hh:mm A");
                      // var name=this.selectedEntities.filter((x)=>x.id==this.chartData[opt.seriesIndex].id).map((y)=>y.name)
                      // return name
                    } catch (error) {}

                    //  const value = opt.series[opt.seriesIndex][opt.dataPointIndex]

                    return "";
                  },
                },
              },
              colors: colors,
            },
          };
        }
      } catch (error) {
        // alert(error)
        console.log(error);
      }
    },
  },
};
</script>
