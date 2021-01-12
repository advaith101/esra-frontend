<template>
  <v-card flat tile>
    <!-- <v-carousel cycle hide-delimiter-background :show-arrows=false vertical vertical-delimiters="true">
        <v-carousel-item
          v-for="(i) in 2"
          :key="i"
          
          reverse-transition="fade-transition"
          transition="fade-transition"
        > -->
    <VueSlickCarousel :arrows="true" ref="carousel" :dots="true" @afterChange="reloadTitle" v-if="comparisonBarNumber > 0">
      <div v-for="i in comparisonBarNumber" :key="i">
        <apexchart
          type="bar"
          height="140"
          :options="comparisonBarOptions[i-1]"
          :series="comparisonBarChartSeries[i-1]"
        ></apexchart>
      </div>
    </VueSlickCarousel>
    <apexchart
      v-if="comparisonBarNumber < 1"
      type="bar"
      height="140"
      :options="comparisonBarOptionsCommon"
      :series="series"
    ></apexchart>
    <!-- </v-carousel-item>
      </v-carousel> -->
  </v-card>
</template>

<script>
import moment from "moment";
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
// optional style for arrows & dots
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
export default {
  mounted() {
    this.series.push({name:"", data:[]});
  },
  components: {
    VueSlickCarousel,
  },
  data() {
    return {
      reqPayload: {},
      chartData: {},
      series: [],
      comparisonBarNumber: 0,
      comparisonBarChartSeries: [],
      comparisonBarOptions: [],
      comparisonBarOptionsCommon: {
        chart: {
          height: 140,
          type: "bar",
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
              bar: {
                barHeight: '70%',
                distributed: true,
                horizontal: true,
                endingShape: 'rounded',
                dataLabels: {
                  position: 'bottom'
                },
              }
            },
       dataLabels: {
              enabled: true,
              textAnchor: 'start',
              style: {
                 color: "#FFFFFF",
              fontSize: "10px",
              fontFamily: "Open Sans",
              },
              // formatter: function (val, opt) {
              //   return opt.w.globals.labels[opt.dataPointIndex] 
              // },
              offsetX: 0,
              dropShadow: {
                enabled: true
              }
            },
        grid: {
          show: false,
        },
       // colors: [ "#3BB08D","#4CB3D2"],        
        noData: {
          text: "Loading...",
        },
        yaxis: {
          // min: 10,
          // max: 40,
          //   title: {
          //     text: response['comparisonBar'+comparisonBarCount]['yaxisTitle'+comparisonBarCount],
          //   },
          labels: {
                show: false
              }
        },
        xaxis: {
          // tickAmount:6,
          type:"category",
          labels: {
                show: false
              },
              axisBorder: {
          show: false,
              }
        },
        legend: {
          show: false,
        },
      },
    };
  },
props: ['selectedEntities','dateRange','timeMode','selectedApps'],
 mounted() {
    this.$watch(vm => [vm.selectedEntities, vm.dateRange,vm.timeMode,vm.selectedApps], val => {
      
    this.getcomparisonBarChartData();      
    }, {
      immediate: true, // run immediately
      deep: true 
    }) 
  },
  methods: {
    getRequestPayload() {
 var teamIDs = this.selectedEntities.filter(x => x.type === "team" && x.isSelected).map(y => y.id);
      var userIDs = this.selectedEntities.filter(x => x.type === "user" && x.isSelected).map(y => y.id);
      var insightType = '';
      if (userIDs.length && teamIDs.length) {
        insightType='user+team';
      } else if (userIDs.length ) {
        insightType = 'user';
      } else if (teamIDs.length) {
        insightType = 'team';
      }
        this.reqPayload = {
          insightType:insightType,         
          timeMode:this.timeMode,
          appIDs:this.selectedApps,
          teamIDs: teamIDs,
          userIDs: userIDs,
          currTime: moment(this.dateRange.endDate).format('YYYY-MM-DD HH:mm:ss'),
          pastTime: moment(this.dateRange.startDate).format('YYYY-MM-DD HH:mm:ss'),
      }
      return this.reqPayload;
    },
    getChartTitle() {
      return this.chartTitle;
    },
    resetCarousel(){
      var self = this;
      self.$refs.carousel.goTo(1);
    },
    reloadTitle(newSlideIndex) {
       this.$emit(
                  "updateComparisonBarChartTitle",
                  this.chartData["insight"+newSlideIndex].verbalInsight
                );
    },
    async getcomparisonBarChartData() {
     var payload = this.getRequestPayload();
     this.comparisonBarChartSeries=[];
this.comparisonBarOptions = [];
    this.comparisonBarNumber = 0;
    this.$emit( "updateComparisonBarChartTitle", "");
    if (!payload.userIDs.length && !payload.teamIDs.length) {
     // this.insightNumber = 0;
      return;
    }
      try {
        var res = await this.$apiService.post("/analytics/bargraphs",payload);
        if (res) {
          try {
            this.chartData = res.data;
            this.comparisonBarNumber =  this.chartData.numInsights;
          // this.resetCarousel();            
 this.comparisonBarChartSeries=[];
this.comparisonBarOptions = [];
 
         //   this.$nextTick(() => {
              for (
                var comparisonBarCount = 0;
                comparisonBarCount < this.comparisonBarNumber;
                comparisonBarCount++
              ) {
                var categories = [];
                var data = [];
               // this.comparisonBarChartSeries.push();
                this.comparisonBarChartSeries.push([]);
              //  this.comparisonBarChartSeries[comparisonBarCount] = {series:{data:[]}};
                if (this.chartData["insight" + comparisonBarCount].verbalInsight !== "") {
                this.$emit(
                  "updateComparisonBarChartTitle",
                  this.chartData["insight0"].verbalInsight
                );
                }
                for (
                  var seriesCount = 0;
                  seriesCount <
                  2;
                  seriesCount++
                ) {//debugger;
                
                  data.push(
                   // name: "",
                    // data: this.chartData["insight" + comparisonBarCount][
                    //   "bar" + seriesCount
                    // ].map((y) => parseFloat(y.value).toFixed(2)),
                    parseFloat(this.chartData["insight" + comparisonBarCount]
                    [ "bar" + seriesCount].value).toFixed(2)
                  );
                 // this.comparisonBarChartSeries[comparisonBarCount].series.data=[400, 430]
                  categories.push(
                    this.chartData["insight" + comparisonBarCount][
                      "bar" + seriesCount].name
                   
                  );
                 // console.log(categories);
                }
                
                this.comparisonBarChartSeries[comparisonBarCount].push({data:data,name:""});
                var colors =[];
                payload.userIDs.forEach(userID => {
               colors =  [... colors,this.selectedEntities.filter(x => x.id === userID && x.type === "user")[0].color];
                });
                payload.teamIDs.forEach(teamID => {
               colors =  [... colors,this.selectedEntities.filter(x => x.id === teamID && x.type === "team")[0].color];
                });
              //  this.comparisonBarOptions.push([]);
                this.comparisonBarOptions.push( {
                  ...this.comparisonBarOptionsCommon,
                  ...{
                    xaxis: {
                      ...this.comparisonBarOptionsCommon.xaxis,
                      type: "category",
                      categories: categories,
                      // tickAmount: 6,
                    //   title: {
                    //     text: this.chartData["comparisonBar" + comparisonBarCount]
                    //       .xaxisTitle,
                    //   },
                    },
                    colors: colors,
                    yaxis: [{
                      ...this.comparisonBarOptionsCommon.yaxis,
                    //   title: {
                    //     text: this.chartData["comparisonBar" + comparisonBarCount][
                    //       "yaxisTitle0"
                    //     ],
                    //   },
                    },                    
                    // {
                    //   ...this.comparisonBarOptionsCommon.yaxis,
                    //   opposite: true,
                    //   title: {
                    //     text: this.chartData["comparisonBar" + comparisonBarCount][
                    //       "yaxisTitle" + comparisonBarCount
                    //     ],
                    //   },
                    // }
                    ],
                  },
                });
              //  this.resetCarousel();
                // if(this.chartData["comparisonBar" + comparisonBarCount].numAxes > 1) {
                //   // this.comparisonBarOptions[comparisonBarCount] = {...this.comparisonBarOptions[comparisonBarCount],
                //   // yaxis=[{...this.comparisonBarOptions[comparisonBarCount].yaxis},]}
                //   this.comparisonBarOptions[comparisonBarCount].yaxis.push({
                //     ...this.comparisonBarOptionsCommon.yaxis,
                //       opposite: true,
                //       title: {
                //         text: this.chartData["comparisonBar" + comparisonBarCount][
                //           "yaxisTitle1" 
                //         ],
                //       },
                //   })
                // }
              }
               
              
          //  });
          } catch (error) {
            //  alert(error);
          }
        }
      } catch (error) {
        console.log(error);
       
      }
    },
  },
};
</script>

