<template>
  <div >
    <!-- <v-carousel cycle hide-delimiter-background :show-arrows=false vertical vertical-delimiters="true">
        <v-carousel-item
          v-for="(i) in 2"
          :key="i"
          
          reverse-transition="fade-transition"
          transition="fade-transition"
        > -->
    <VueSlickCarousel :arrows="true" :dots="true" v-if="insightNumber > 0" @afterChange="reloadTitle" style="margin-bottom:10px">
      <div v-for="i in insightNumber" :key="i">
        <apexchart
          type="line"
          height="333"
          width="100%"
          :options="insightOptions[i-1]"
          :series="insightChartSeries[i-1]"
        ></apexchart>
      </div>
    </VueSlickCarousel>
    <apexchart
      v-if="insightNumber < 1"
      type="line"
      height="333"
      :options="insightOptionsCommon"
      :series="series"
    ></apexchart>
    <!-- </v-carousel-item>
      </v-carousel> -->
  </div>
</template>

<script>
import moment from "moment";
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
// optional style for arrows & dots
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
export default {
  mounted() {
    this.series.push({name:" ", data:[]});
  },
  components: {
    VueSlickCarousel,
  },
  data() {
    return {
      reqPayload: {},
      chartData: {},
      series: [],
      insightNumber: 0,
      insightChartSeries: [],
      insightOptions: [],
      insightOptionsCommon: {
        chart: {
          height: 333,
          type: "line",
          toolbar: {
            show: false,
          },
        },
        stroke: {
          width: 7,
          curve: "smooth",
        },
        grid: {
          show: false,
        },
       // colors: ["#FFB84E", "#3BB08D", "#4CB3D2"],

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
          min: 0,
          max: 100,
          //   title: {
          //     text: response['insight'+insightCount]['yaxisTitle'+insightCount],
          //   },
          labels: {
            style: {
              color: "#828288",
              fontSize: "10px",
              fontFamily: "Open Sans",
            },
          },
        },
        xaxis: {
           tickAmount:6,
          type:"category",
          labels: {
            rotate:0,
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
props: ['selectedEntities','dateRange','timeMode','selectedApps','graphMode'],
 mounted() {
    this.$watch(vm => [vm.selectedEntities, vm.dateRange,vm.timeMode,vm.selectedApps,vm.graphMode],async(val) => {
      
     await this.getInsightChartData();      
    }, {
    //  immediate: true, // run immediately
      deep: true // detects changes inside objects. not needed here, but maybe in other cases
    }) 
  },
//  watch: {
//     selectedEntities: function() {
     
//     },
//     dateValue: function() {
//      this.reqPayload = {...this.reqPayload,timeMode:this.dateValue};
      
//     },
//     dateRange:function(){
//       this.reqPayload = {
//         ...this.reqPayload,
//         enddate: moment(this.dateRange.endDate).format('YYYY-MM-DD'),
//           startdate: moment(this.dateRange.startDate).format('YYYY-MM-DD'),
//       }
//     },
//     chosenApp:function() {
//      this.getInsightChartData();   
//     },
//     mode:function() {
//       this.getInsightChartData();   
//     },
//      reqPayload:function() { 
//       this.getInsightChartData();       
//      }
        
//   },
  methods: {
    getRequestPayload() {
 var teamIDs = this.selectedEntities.filter(x => x.type === "team" && x.isSelected).map(y => y.id);
      var userIDs = this.selectedEntities.filter(x => x.type === "user" && x.isSelected).map(y => y.id);
      // var insightType = '';
      // if (userIDs.length && teamIDs.length) {
      //   insightType='user+team';
      // } else if (userIDs.length ) {
      //   insightType = 'user';
      // } else if (teamIDs.length) {
      //   insightType = 'team';
      // }
        this.reqPayload = {
         // insightType:insightType,
          graphMode: this.graphMode,
          timeMode:this.timeMode === 3 ? 4 : this.timeMode === 4 ? 5 : this.timeMode === 5 ? 3: this.timeMode,
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
    reloadTitle(newSlideIndex) {
     // this.$nextTick(() => {
         this.$emit(
                  "updateTitle",
                  this.chartData["insight"+newSlideIndex].verbalInsight
                );
     // }, 50);
      
    },
    async getInsightChartData() {
    var payload = this.getRequestPayload();
    this.insightChartSeries = [];
    this.insightOptions =[];
    this.insightNumber = 0;
    this.chartData = [];
     this.$emit(
                  "updateTitle",
                  ''
                );
    if (!payload.userIDs.length && !payload.teamIDs.length) {
     // this.insightNumber = 0;
      return;
    }
      try {
       // this.insightNumber = 0;        
        var res = await this.$apiService.post("/analytics/linegraphs", payload);
        if (res.status === 200) {
          try {
             this.insightChartSeries = [];
    this.insightOptions =[];
    this.insightNumber = 0;
    this.chartData = [];
            this.chartData = res.data;

            this.insightNumber = this.chartData.numInsights;

         //   this.$nextTick(() => {
              for (
                var insightCount = 0;
                insightCount < this.chartData.numInsights;
                insightCount++
              ) {
                var categories = [];
                if (this.chartData["insight" + insightCount].verbalInsight !== "" && insightCount === 0) {
                this.$emit(
                  "updateTitle",
                  this.chartData["insight" + insightCount].verbalInsight
                );
                }
                for (
                  var seriesCount = 0;
                  seriesCount <
                  this.chartData["insight" + insightCount].numSeries;
                  seriesCount++
                ) {
                  this.insightChartSeries.push([]);
                  this.insightChartSeries[insightCount].push({
                    name: " ",
                    data: this.chartData["insight" + insightCount].values[
                      "series" + seriesCount
                    ].map((y) => parseFloat(y.value).toFixed(2)),
                  });
                  categories.push(
                    ...this.chartData["insight" + insightCount].values[
                      "series" + seriesCount
                    ].map((x) => x.time
                    // (insightCount ===0 )? moment.parseZone(x.time, "HH").format("hh:mm A")
                    // : (insightCount ===2 )? moment.parseZone(x.time, "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD") : x.time
                    )
                  );
                }
                let colors=[];
                  
                  for (var user of payload.userIDs) {             
                  colors.push(this.selectedEntities.filter(x => x.id === user && x.type === "user")[0].color);
                  }
                
                for (var team of payload.teamIDs) {                
                  colors.push(this.selectedEntities.filter(x => x.id === team && x.type === "team")[0].color);
                }
                if (colors.length < 2) {
                  //colors.push('#E1E1E1');
                  var color=colors[0];
                  colors[0]='#E1E1E1'
                  colors.push(color)
                  //console.log('after:',colors)
                }
              //  this.insightOptions.push([]);
                this.insightOptions.push( {
                  ...this.insightOptionsCommon,
                  ...{
                    xaxis: {
                      ...this.insightOptionsCommon.xaxis,
                      type: "category",
                      categories: categories,
                      // tickAmount: 6,
                     
                    },
                    colors:colors,
                    yaxis: [{
                      ...this.insightOptionsCommon.yaxis,
                      title: {
                        text: this.chartData["insight" + insightCount][
                          "yaxisTitle0"
                        ],
                      },
                    },
                    // {
                    //   ...this.insightOptionsCommon.yaxis,
                    //   opposite: true,
                    //   title: {
                    //     text: this.chartData["insight" + insightCount][
                    //       "yaxisTitle" + insightCount
                    //     ],
                    //   },
                    // }
                    ],
                  },
                });
                if(this.chartData["insight" + insightCount].numAxes > 1) {
                  // this.insightOptions[insightCount] = {...this.insightOptions[insightCount],
                  // yaxis=[{...this.insightOptions[insightCount].yaxis},]}
                  this.insightOptions[insightCount].yaxis.push({
                    ...this.insightOptionsCommon.yaxis,
                      opposite: true,
                      title: {
                        text: this.chartData["insight" + insightCount][
                          "yaxisTitle1" 
                        ],
                      },
                  })
                }
              }
              
          //  });
          } catch (error) {
           // alert(error);
          }
        }
      } catch (error) {
       // alert(error);
      }
    
    },
  },
};
</script>

