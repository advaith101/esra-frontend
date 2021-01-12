<template>
  <div style="height:350px">
    <!-- <v-carousel cycle hide-delimiter-background :show-arrows=false vertical vertical-delimiters="true">
        <v-carousel-item
          v-for="(i) in 2"
          :key="i"
          
          reverse-transition="fade-transition"
          transition="fade-transition"
        > -->
    <!-- <VueSlickCarousel :arrows="true" ref="carousel" :dots="true"  v-if="docInsightNumber > 0"> -->
      <div v-if="docInsightNumber > 0">
        <apexchart
          type="bar"
          height="150"
          :options="docInsightOptions"
          :series="docInsightChartSeries[0]"
        ></apexchart>
      </div>
    <!-- </VueSlickCarousel> -->
    <apexchart
      v-if="docInsightNumber < 1"
      type="bar"
      height="150"
      :options="docInsightOptionsCommon"
      :series="series"
    ></apexchart>
    <!-- </v-carousel-item>
      </v-carousel> -->
  </div>
</template>

<script>
import moment from "moment";

export default {
 mounted() {
    this.series.push({name:" ", data:[]});
  },
  data() {
    return {
      reqPayload: {},
      chartData: {},
      series: [],
      docInsightNumber: 0,
      docInsightChartSeries: [],
      docInsightOptions: {},
      userColors:{
        '#473198':['#cec5ec','#8c78d3','#473198'],
        '#ffb84e':['#ffebcc','#ffb84e','#cc7a00'],
        '#4cb3d2':['#addceb','#4cb3d2','#24768f'],
        '#3bb08d':['#b3e6d6','#3bb08d','#2d866b'],
        '#D782BA':['#f3d8ea','#D782BA','#882b69']
      },
      docInsightOptionsCommon: {
        chart: {
          height: 150,
          type: "bar",
          stacked:true,
          
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
              bar: {
                barHeight: '70%',
                distributed: false,
                horizontal: true,
                endingShape: 'flat',
                 columnWidth: '100%',
                 rangeBarOverlap: true,
          rangeBarGroupRows: false,
                // dataLabels: {
                //   position: 'bottom',
                //    hideOverflowingLabels:true,
                // },
              }
            },
            
      
        grid: {
          show: false,
        },
       // colors: [ '#5F4B66','#A7ADC6','#8797AF'],        
        noData: {
          text: "Loading...",
        },
        yaxis: {
          // min: 10,
          // max: 40,
          //   title: {
          //     text: response['docInsight'+docInsightCount]['yaxisTitle'+docInsightCount],
          //   },
          labels: {
                show: true,
                 style: {
              color: "#828288",
              fontSize: "10px",
              fontFamily: "Open Sans",
            },
              }
        },
           dataLabels: { 
                      enabled: false,
              textAnchor: 'start',
               hideOverflowingLabels:true,
              style: {               
               
              color: "#FFFFFF",
              fontSize: "10px",
              fontFamily: "Open Sans",
            
              },            
              offsetX: -5,
              dropShadow: {
                enabled: true
              }
            },
        xaxis: {
           //tickAmount:6,
          type:"category",          
          labels: {
                show: false,
                 style: {
              color: "#828288",
              fontSize: "8px",
              fontFamily: "Open Sans",
            },
              },
              axisBorder: {
          show: false,
              }
        },
        legend: {
          show: true,
        },
      },
    };
  },
props: ['selectedEntities','dateRange','timeMode','selectedApps','mode'],
 mounted() {
    this.$watch(vm => [vm.selectedEntities, vm.dateRange,vm.timeMode,vm.selectedApps,vm.mode], val => {
      
     this.getDocInsightChartData();      
    }, {
      immediate: true, // run immediately
      deep: true 
    }) 
  },
  methods: {
     getRequestPayload() {
       var insightType = '';
      var compType='';
 var teamIDs = this.selectedEntities.filter(x => x.type === "team" && !x.isSelected).map(y => y.id);
      var userIDs = this.selectedEntities.filter(x => x.type === "user" && !x.isSelected).map(y => y.id);
      var focusEntity = this.selectedEntities.filter(x => x.isSelected)[0];
      
      if (focusEntity) {
insightType = focusEntity.type;
      }
      
      if (userIDs.length && teamIDs.length) {
        compType='user+team';
      } else if (userIDs.length ) {
        compType = 'user';
      } else if (teamIDs.length) {
        compType = 'team';
      }
        this.reqPayload = {
          insightType: insightType,
          focusEntity: focusEntity !== undefined ? [focusEntity.id] : [],
          compType:compType,
          // graphMode: this.mode,
          // timeMode:this.timeMode,
          appIDs:this.selectedApps,
          teamIDs: teamIDs,
          userIDs: userIDs,
          currTime: moment(this.dateRange.endDate).format('YYYY-MM-DD HH:mm:ss'),
          pastTime: moment(this.dateRange.startDate).format('YYYY-MM-DD HH:mm:ss'),
      }
      
      return this.reqPayload;
    },
    async getDocInsightChartData() {
     var payload = this.getRequestPayload();
      this.docInsightChartSeries = [];
            this.docInsightOptions = {};
    this.docInsightNumber = 0;
    if (!payload.userIDs.length && !payload.teamIDs.length && !payload.focusEntity.length) {
     // this.insightNumber = 0;
      return;
    }
      try {
        var res = await this.$apiService.post("/analytics/docInsights", payload);
        if (res) {
          try {
            this.chartData = res.data;
            this.docInsightNumber =  this.chartData.numInsights;
           
         //   this.$nextTick(() => {
              for (
                var docInsightCount = 0;
                docInsightCount < this.docInsightNumber;
                docInsightCount++
              ) {
                var categories = [];
                var data = [];
                var highestPlotValue =[];
               // this.docInsightChartSeries.push();
                this.docInsightChartSeries.push([]);
              //  this.docInsightChartSeries[docInsightCount] = {series:{data:[]}};
               
                for (
                  var seriesCount = 0;
                  seriesCount <
                  3;
                  seriesCount++
                ) {
                var barData = this.chartData["insight" + docInsightCount][
                      "bar" + seriesCount];
                if (seriesCount === 0) {
                data.push({name:'Time',data:[parseFloat(barData.scaledTime).toFixed(2)]}); 
                      data.push({name:'Interaction',data:[parseFloat(barData.scaledActivity).toFixed(2)]});
                      data.push({name:'Contribution',data:[parseFloat(barData.scaledSize).toFixed(2)]});
                } else {
data[0].data = [...data[0].data,parseFloat(barData.scaledTime).toFixed(2)];
                      data[1].data = [...data[1].data,parseFloat(barData.scaledActivity).toFixed(2)];
                      data[2].data = [...data[2].data,parseFloat(barData.scaledSize).toFixed(2)];
                }
                
                var filteredKeys = [barData].map(({ scaledTime,scaledActivity,scaledSize }) => ({ scaledTime,scaledActivity,scaledSize }));
var keysSorted = Object.keys(filteredKeys[0]).sort((a, b) => filteredKeys[0][b] - filteredKeys[0][a]);
highestPlotValue.push(parseFloat(barData[keysSorted[0]]).toFixed(2));

                  
            //   name: this.chartData["insight" + docInsightCount][
            //           "bar" + seriesCount].name,
          //  data =   [this.chartData["insight" + docInsightCount][
          //             "bar" + seriesCount]].map(x => ([...x.scaledTime,...x.scaledActivity,...x.scaledSize]));
          //  data = [this.chartData["insight" + docInsightCount][
          //             "bar" + seriesCount]].reduce((acc, { scaledTime,scaledActivity,scaledSize }) => [ ...acc, scaledTime,scaledActivity,scaledSize], []);
                 // this.docInsightChartSeries[docInsightCount].series.data=[400, 430]
                  categories.push(
                    this.chartData["insight" + docInsightCount][
                      "bar" + seriesCount].name
                   
                  );
                  
                
                }
                
                 this.docInsightChartSeries[docInsightCount] = data;
                
              //  this.docInsightOptions.push([]);
                this.docInsightOptions =( {
                  ...this.docInsightOptionsCommon,
                  ...{
                    xaxis: {
                      ...this.docInsightOptionsCommon.xaxis,
                      type: "category",
                      categories: categories,
                     
                    },
                    tooltip:{
                       y: { formatter: (val,opt) => { 
                            if (parseFloat(highestPlotValue[opt.dataPointIndex]) === val) {
                              var self = this;
                              return  val + ' ' + 'Time: ' +self.chartData["insight0"]["bar" + opt.dataPointIndex].rawTime;
                            }
                            return val;
                            }
                          }
                    },
                   colors:this.userColors[this.selectedEntities.filter(x => x.isSelected)[0].color],
//                     dataLabels: {
//                       ...this.docInsightOptionsCommon.dataLabels,
//                         formatter: (val, opt) => {
//      if (parseFloat(highestPlotValue[opt.dataPointIndex]) === val) {
//      var self = this;
//      return  'Time: ' +self.chartData["insight0"]["bar" + opt.dataPointIndex].rawTime;
//      }
//      return '';
// } ,
//                     }
                    
                 
            }
                  
              //     },
                 });
               
               }
               
              
          //  });
          } catch (error) {
              alert(error);
          }
        }
      } catch (error) {
        console.log(error);
      // alert(error)
      }
    },
  },
};
</script>

