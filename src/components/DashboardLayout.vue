<template>
	<div class="pagelayout">
		<div class="pagemargin">
			<v-col cols="12" style="margin-left:5px">
				<v-row>
					<v-flex lg3 xs11>
						<v-autocomplete
							v-model="selectedApps"
							:items="apps"
							item-value="applicationid"
							item-text="app_name"
							filled
							solo
							dense
							label="Choose App"
							multiple
							@change="checkMaximumSelection()"
							:single-line="true"
						>
							<template v-slot:selection="{ index }">
								<span v-if="index < 1" class="appSelect">{{ selectedAppNames }}</span>
							</template>
						</v-autocomplete>
					</v-flex>
					<v-flex lg4 xs12>
						<div class="filter">
							<v-chip-group mandatory class="white--text" v-model="timeMode">
								<v-chip
									style="background-color:white;"
									class="filteritem"
									label
									v-for="(filter, index) in filterValues"
									:key="index"
									:value="filter.value"
									><span class="filterText">{{ filter.name }}</span></v-chip
								>
							</v-chip-group>
						</div>
					</v-flex>
					<v-flex lg3 v-if="timeMode === 5" style="height:42px;font-size:12px">
						<date-range-picker ref="picker" v-model="dateRange" :timePicker="true">
							<template v-slot:input="picker">
								{{ picker.startDate | formatDate }} -
								{{ picker.endDate | formatDate }}
							</template>
						</date-range-picker>
					</v-flex>
				</v-row>
			</v-col>
			<v-col cols="12" style="margin-top:-20px">
				<v-row>
					<v-flex lg7 xs12>
						<div :class="{ panelrightmargin: $vuetify.breakpoint.mobile }">
							<!-- <v-expansion-panels accordion v-model="panelValue" @click.native.stop.prevent ="panelValue = 0" class="panelborder elevation-0">
								<v-expansion-panel> -->
									<v-card class="panelborder elevation-0">
									<v-card-title hide-actions class="paneltitle" 
										>Total

										<v-menu max-width="150px">
											<template v-slot:activator="{ on, attrs }" style="margin-left:100px;">
												<v-btn x-small text class="menutexttotal"  color="tranparent" v-bind="attrs" v-on="on">
													{{ selectedActivityTextforTotal }}
													<img src="@/assets/icons/dropdown.png" style="cursor:pointer;" />
												</v-btn>
											</template>
											<v-list v-if="selectedEntities.length">
												<v-list-item v-for="(item, index) in activities" :key="index" @click="updateTotalActivityValue(item)">
													<v-list-item-title :style="'color:' + item.color">{{ item.title }}</v-list-item-title>
												</v-list-item>
											</v-list>
										</v-menu>
									</v-card-title>
									<v-card-text >
										<hr />
										<VueSlickCarousel :style="{ maxHeight: activityPanelHeight + 'px' }" @afterChange="resetHeight" :arrows="true" :dots="true" :swipe="false" :swipeToSlide="false" :touchMove="false" :draggable="false" style="margin-bottom:10px">
											<div>
												<ActivityChart
													:selectedEntities="selectedEntitiesforActivity"
													:timeMode="timeMode"
													:dateRange="dateRange"
													:selectedApps="selectedApps"
													:mode="selectedActivityforTotal"													
												/>
											</div>
											<div>
												<ActivityTable
													:selectedEntities="selectedEntitiesforActivity"
													:dateRange="dateRange"
													:selectedApps="selectedApps"
													:timeMode="timeMode"
													:mode="selectedActivityforTotal"													
												/>
											</div>
										</VueSlickCarousel>
										<!-- <v-skeleton-loader
      class="mx-auto"
      :boilerplate="false"
      type="card"
    ></v-skeleton-loader> -->
									</v-card-text>
									</v-card>
								<!-- </v-expansion-panel>
							</v-expansion-panels> -->
						</div>
					</v-flex>

					<v-flex lg5 xs12>
						<div class="panelrightmargin">
							<!-- <v-expansion-panels accordion v-model="panelValue" @click.native.stop="panelValue = 0" class="panelborder elevation-0" :class="{ panelleftmargin: $vuetify.breakpoint.lgAndUp }">
								<v-expansion-panel> -->
									<v-card class="panelborder elevation-0" :class="{ panelleftmargin: $vuetify.breakpoint.lgAndUp }">
										<v-card-title class="paneltitle cardtitle" style="min-height:62px;text-align:left"
										>{{ insightTitle }}
										<div style="right:0;position:absolute;height:50px">
										<v-menu nudge-bottom="25" >
											<template v-slot:activator="{ on, attrs }">
												<v-btn x-small right text color="transparent" v-bind="attrs" v-on="on">
													<img src="@/assets/icons/dropdown.png" style="cursor:pointer;" />
												</v-btn>
											</template>
											<v-list v-if="selectedEntities.length">
												<v-list-item
													v-for="(item, index) in selectedEntitiesforInsight"
													:key="index"
													@click="updateIndividualInsightChart(item)"
												>
													<v-list-item-title>{{ item.name }}</v-list-item-title>
													<v-list-item-icon>
														<v-icon v-if="item.isSelected" :color="item.color" small right>mdi-eye</v-icon>
														<v-icon v-else x-small right>mdi-eye-off</v-icon>
													</v-list-item-icon>
												</v-list-item>
											</v-list>
										</v-menu>
										</div>
										</v-card-title>
									<v-card-text style="min-height:350px">
										<hr />
										<v-btn-toggle v-model="selectedGraphMode" class="togglebtn" dense active-class="activetogglebtn">
											<v-btn x-small>
												Daily
											</v-btn>
											<v-btn x-small class="mr-3">
												Weekly
											</v-btn>
										</v-btn-toggle>
										<IndividualInsightChart
											style="margin-top:10px"
											@updateTitle="updateTitle"
											ref="insightChart"
											:selectedEntities="selectedEntitiesforInsight"
											:dateRange="dateRange"
											:timeMode="timeMode"
											:selectedApps="selectedApps"
											:graphMode="selectedGraphMode"
										/>
									</v-card-text>
</v-card>
						</div>
					</v-flex>
				</v-row>
			</v-col>
			<v-col cols="12" style="">
				<v-row>
					<v-flex lg5>
						<FeedChart :dateRange="dateRange" :timeMode="timeMode" />
						<!-- <v-col cols="12">
							<v-row>
								<v-flex lg12 xs12>
									<div :class="{ panelrightmargin: $vuetify.breakpoint.mobile }">
										<v-expansion-panels accordion :value="0" class="panelborder">
											<v-expansion-panel class="documentpanel">
												<v-expansion-panel-header class="paneltitle" expand-icon=""
													>Project Insights
													<v-menu :fixed="true" left>
														<template v-slot:activator="{ on, attrs }">
															<v-btn x-small text color="transparent" v-bind="attrs" v-on="on">
																<img
																	src="@/assets/icons/dropdown.png"
																	style="cursor:pointer;position:absolute;right:0px"
																/>
															</v-btn>
														</template>
														<v-list v-if="selectedEntities.length">
															<v-list-item
																v-for="(item, index) in selectedEntitiesforDocument"
																:key="index"
																@click="updateDocumentChart(item)"
															>
																<v-list-item-title>{{ item.name }}</v-list-item-title>
																<v-list-item-icon>
																	<v-icon v-if="item.isSelected" :color="item.color" small right>mdi-eye</v-icon>
																	<v-icon v-else x-small right>mdi-eye-off</v-icon>
																</v-list-item-icon>
															</v-list-item>
														</v-list>
													</v-menu>
												</v-expansion-panel-header>
												<v-expansion-panel-content>
													<hr />
													<DocInsightChart
														ref="documentChart"
														:selectedEntities="selectedEntitiesforDocument"
														:dateRange="dateRange"
														:timeMode="timeMode"
														:selectedApps="selectedApps"
													/>
												</v-expansion-panel-content>
											</v-expansion-panel>
										</v-expansion-panels>
									</div>
								</v-flex>
							</v-row>
						</v-col> -->
						<v-col cols="12" style="margin-top:-1px">
							<v-row>
								<v-flex lg12>
									<div :class="{ panelrightmargin: $vuetify.breakpoint.mobile }">
										<!-- <v-expansion-panels accordion v-model="panelValue" @click.native.stop="panelValue = 0" class="panelborder elevation-0">
											<v-expansion-panel style="height:260px"> 
												<v-expansion-panel-header class="paneltitle" expand-icon=""-->
													<v-card class="panelborder elevation-0" style="height:265px">
														<v-card-title hide-actions class="paneltitle cardtitle" style="min-height:62px;margin-right:10px;white-space:pre-wrap"
													>{{ comparisonChartTitle }}
													<div style="right:0;position:absolute;height:50px">
													<v-menu >
														<template v-slot:activator="{ on, attrs }">
															<v-btn x-small text color="transparent" v-bind="attrs" v-on="on">
																<img
																	src="@/assets/icons/dropdown.png"
																	style="cursor:pointer;margin-top:25px"
																/>
															</v-btn>
														</template>
														<v-list v-if="selectedEntities.length">
															<v-list-item
																v-for="(item, index) in selectedEntitiesforComparison"
																:key="index"
																@click="updateComparisonChart(item);"
															>
																<v-list-item-title>{{ item.name }}</v-list-item-title>
																<v-list-item-icon>
																	<v-icon v-if="item.isSelected" :color="item.color" small right>mdi-eye</v-icon>
																	<v-icon v-else x-small right>mdi-eye-off</v-icon>
																</v-list-item-icon>
															</v-list-item>
														</v-list>
													</v-menu>
													</div>
												</v-card-title>
<v-card-text  >
													<hr />
													<!-- <VueSlickCarousel :arrows="true" :dots="true" :swipe="false" :swipeToSlide="false" :touchMove="false" :draggable="false" style="margin-bottom:10px"> -->
														<!-- <div v-if="this.selectedEntitiesforComparison.filter((x) => x.isSelected).length === 1">
															<DocInsightChart
														ref="documentChart"
														:selectedEntities="selectedEntitiesforComparison"
														:dateRange="dateRange"
														:timeMode="timeMode"
														:selectedApps="selectedApps"
													/>
														</div>
														<div v-else> -->
													<ComparisonBarChart
														@updateComparisonBarChartTitle="updateComparisonBarChartTitle"
														ref="comparisonChart"
														:selectedEntities="selectedEntitiesforComparison"
														:dateRange="dateRange"
														:timeMode="timeMode"
														:selectedApps="selectedApps"
													/>
														<!-- </div> -->
													<!-- </VueSlickCarousel> -->
												</v-card-text>
</v-card>
									</div>
								</v-flex>
							</v-row>
						</v-col>
					</v-flex>

					<v-flex lg7>
						<div class="panelrightmargin">
							<!-- <v-expansion-panels
								accordion
								v-model="panelValue" @click.native.stop="panelValue = 0"
								class="panelborder elevation-0"
								style="height:529px;"
								:class="{ panelleftmargin: $vuetify.breakpoint.lgAndUp }"
							>
								<v-expansion-panel>
									<v-expansion-panel-header class="paneltitle" expand-icon="mdi-menu-down" -->
										<v-card class="panelborder elevation-0"
										style="height:529px;"
								:class="{ panelleftmargin: $vuetify.breakpoint.lgAndUp }">
<v-card-title hide-actions class="paneltitle"
										>App

										<v-menu max-width="150px">
											<template v-slot:activator="{ on, attrs }" style="margin-left:100px">
												<v-btn x-small text class="menutext" color="tranparent" v-bind="attrs" v-on="on">
													{{ selectedActivityTextforRadar }}
													<img src="@/assets/icons/dropdown.png" style="cursor:pointer;" />
												</v-btn>
											</template>
											<v-list v-if="selectedEntities.length">
												<v-list-item v-for="(item, index) in activities" :key="index" @click="updateRadarActivityValue(item)">
													<v-list-item-title :style="'color:' + item.color">{{ item.title }}</v-list-item-title>
												</v-list-item>
											</v-list>
										</v-menu>
									</v-card-title>
<v-card-text >
										<hr />
										<VueSlickCarousel :arrows="true" :dots="true" style="margin-bottom:10px;">
											<div>
												<RadarChart
													:selectedEntities="selectedEntitiesforRadar"
													:selectedApps="selectedApps"
													:mode="selectedActivityforRadar"
													:dateRange="dateRange"
													:timeMode="timeMode"
												/>
											</div>
											<div>
												<AppTable
													:selectedEntities="selectedEntitiesforActivity"
													:dateRange="dateRange"
													:selectedApps="selectedApps"
													:timeMode="timeMode"
													:mode="selectedActivityforTotal"
												/>
											</div>
										</VueSlickCarousel>
									</v-card-text>
</v-card>
						</div>
					</v-flex>
				</v-row>
			</v-col>
		</div>
	</div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
// optional style for arrows & dots
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import ActivityChart from "./widgets/ActivityChart";
import ActivityTable from "./widgets/ActivityTable";
import AppTable from "./widgets/AppTable";
import RadarChart from "./widgets/RadarChart";
import IndividualInsightChart from "./widgets/IndividualInsightChart";
import ComparisonBarChart from "./widgets/ComparisonBarChart";
import DocInsightChart from "./widgets/DocInsightChart";
import FeedChart from "./widgets/FeedChart.vue";

export default {
	name: "DashboardLayout",
	async created() {
		await this.getApps();
		if (localStorage.getItem("selectedApps") !== null && localStorage.getItem("selectedApps") !== undefined) {
			this.selectedApps = JSON.parse(localStorage.getItem("selectedApps"));
			this.addSelectedTeamNames();
		} else {
			//this.selectedApps = this.apps.map((app) => app.applicationid)
			//console.log(this.selectedApps)
		}
	},
	mounted() {
		this.selectedEntities = this.$store.state.selectedEntities;
	},
	props: ["mode"],
	watch: {
		selectedEntities: async function() {
			//  if (this.$store.state.selectedEntities.length) {
			//  this.focusEntitiesforinsight=[];
			//  this.focusEntitiesforinsight.push(this.$store.state.selectedEntities[0]);
			//  if (this.$store.state.selectedEntities.length > 1) {
			//   this.focusEntitiesforinsight.push(this.$store.state.selectedEntities[1]);
			//  }
			// }
			//this.selected = this.$store.state.selectedEntities;
			this.selectedEntities = this.$store.state.selectedEntities;
			this.selectedEntitiesforActivity = this.selectedEntities.map((x) => Object.assign({}, x));
			this.selectedEntitiesforRadar = this.selectedEntities.map((x) => Object.assign({}, x));
			this.loadIndividualInsightData();
			this.loadDocumentInsightData();
			this.loadComparisonChartData();
			//  this.selectedEntitiesforInsight =this.$store.state.selectedEntities;
			this.selectedforComparison = this.$store.state.selectedEntities;
		},
		timeMode() {
			if (this.timeMode !== 5) {
				this.$emit("timeModeChanged", this.timeMode);
			}
		},
		dateRange() {
			this.$emit("dateRangeChanged", this.dateRange);
			this.$emit("timeModeChanged", this.timeMode);
		},
		// tempo:function() {
		//   console.log('Tempo:',this.tempo);
		// },
	},

	components: {
		ActivityChart,
		ActivityTable,
		AppTable,
		RadarChart,
		IndividualInsightChart,
		ComparisonBarChart,
		DocInsightChart,
		DateRangePicker,
		VueSlickCarousel,
		FeedChart,
	},
	data() {
		return {
			activityPanelHeight: 380,
			insightTitle: "",
			comparisonChartTitle: "",
			// selected:[],
			selectedEntities: [],
			selectedEntitiesforActivity: [],
			selectedEntitiesforRadar: [],
			selectedEntitiesforInsight: [],
			selectedEntitiesforDocument: [],
			selectedEntitiesforComparison: [],
			activities: [
				{ id: "output", title: "Contribution", color: "#202031" },
				{ id: "activity", title: "Interaction", color: "#144584" },
				{ id: "activetime", title: "Active Time", color: "#202031" },
				{ id: "idletime", title: "Idle Time", color: "#202031" },
				{ id: "composite", title: "Composite", color: "#202031" },
			],
			selectedActivityforRadar: "activity",
			selectedActivityTextforRadar: "Interaction",
			selectedActivityforTotal: "activity",
			selectedActivityTextforTotal: "Interaction",
			filterValues: [
				{ value: 0, name: "1D" },
				{ value: 1, name: "5D" },
				{ value: 2, name: "1M" },
				{ value: 3, name: "6M" },
				{ value: 4, name: "YTD" },
				{ value: 5, name: "Custom" },
			],
			direction: "ltr",
			format: "mm/dd/yyyy",
			separator: " - ",
			applyLabel: "Apply",
			cancelLabel: "Cancel",
			weekLabel: "W",
			customRangeLabel: "Custom Range",
			timeMode: 3,
			selectedApps: [],
			firstDay: 0,
			dateRange: {
				startDate: "11/18/2020 00:00",
				endDate: "12/18/2020 00:00",
			},
			apps: [],
			selectedAppNames: "",
			selectedGraphMode: 0,
		};
	},

	methods: {
		// changeGraphMode(){
		//   alert(this.selectedGraphMode);
		// },
		updateRadarActivityValue(item) {
			this.selectedActivityforRadar = item.id;
			this.selectedActivityTextforRadar = item.title;
			this.activityforRadar.forEach((element) => {
				element.color = "#202031";
			});
			// this.activityforRadar = {...this.activityforRadar, color:"#202031"};
			item.color = "#144584";
		},
		updateTotalActivityValue(item) {
			this.selectedActivityforTotal = item.id;
			this.selectedActivityTextforTotal = item.title;
			this.activities.forEach((element) => {
				element.color = "#202031";
			});
			// this.activityforRadar = {...this.activityforRadar, color:"#202031"};
			item.color = "#144584";
		},
		async updateIndividualInsightChart(item) {
			var selectedNumber = this.selectedEntitiesforInsight.filter((x) => x.isSelected).length;
			if (item.isSelected) {
				if (selectedNumber !== 1) {
					item.isSelected = false;
				}
				return;
			}
			// selectedNumber = this.selectedEntitiesforInsight.filter(x => x.isSelected);
			if (selectedNumber > 1) {
				this.selectedEntitiesforInsight.some((element) => {
					if (element.isSelected) {
						element.isSelected = false;
						return true;
					}
				});
			}

			item.isSelected = !item.isSelected;
			// this.focusEntitiesforinsight.push(item);
		},
		async updateDocumentChart(item) {
			if (item.isSelected) {
				return;
			}
			// selectedNumber = this.selectedEntitiesforInsight.filter(x => x.isSelected);

			this.selectedEntitiesforDocument.some((element) => {
				if (element.isSelected) {
					element.isSelected = false;
					return true;
				}
			});
			item.isSelected = !item.isSelected;
			
		},
		async updateComparisonChart(item) {//debugger;
			var selectedNumber = this.selectedEntitiesforComparison.filter((x) => x.isSelected).length;			
			
			if (item.isSelected) {
				if (selectedNumber !== 1) {
					item.isSelected = false;
				}				
				return;
			}
			// selectedNumber = this.selectedEntitiesforInsight.filter(x => x.isSelected);
			if (selectedNumber > 1) {
				this.selectedEntitiesforComparison.some((element) => {
					if (element.isSelected) {
						element.isSelected = false;
						return true;
					}
				});
			}

			item.isSelected = !item.isSelected;
			//alert(this.selectedEntitiesforComparison.length)
			//this.selectedEntitiesforDocument = [];
			//this.selectedEntitiesforDocument.push(item);
			
		},
		updateTitle(message) {
			this.insightTitle = message;
		},
		updateComparisonBarChartTitle(message) {
			this.comparisonChartTitle = message;
		},
		dateFormat() {
			return "mm/dd/yyyy";
		},
		async loadIndividualInsightData() {
			if (!this.selectedEntitiesforInsight.length) {
				this.selectedEntitiesforInsight = this.selectedEntities.map((x, index) => {
					//  var existingEntity = this.focusEntitiesforinsight.filter(y => y.id === x.id);
					if (index > 1) {
						return Object.assign({}, x, { isSelected: false });
					}
					return Object.assign({}, x);
				});
			} else {
				this.selectedEntities.map((x, index) => {
					var existingEntity = this.selectedEntitiesforInsight.filter((y) => y.id === x.id && x.type === y.type);
					if (!existingEntity.length) {
						this.selectedEntitiesforInsight.push(Object.assign({}, x, { isSelected: false }));
					}
				});
				this.selectedEntitiesforInsight.map((x, index) => {
					var existingEntity = this.selectedEntities.filter((y) => y.id === x.id && x.type === y.type);
					if (!existingEntity.length) {
						this.selectedEntitiesforInsight.splice(index, 1);
					}
				});
				var selectedNumber = this.selectedEntitiesforInsight.filter((x) => x.isSelected).length;
				if (selectedNumber < 2) {
					for (var nCnt = 0; nCnt < 2; nCnt++) {
						if (this.selectedEntitiesforInsight[nCnt] !== null && this.selectedEntitiesforInsight[nCnt] !== undefined) {
							this.selectedEntitiesforInsight[nCnt].isSelected = true;
						}
					}
				}
			}
		},
		async loadDocumentInsightData() {
			if (!this.selectedEntitiesforDocument.length) {
				this.selectedEntitiesforDocument = this.selectedEntities.map((x, index) => {
					//  var existingEntity = this.focusEntitiesforinsight.filter(y => y.id === x.id);
					if (index > 0) {
						return Object.assign({}, x, { isSelected: false });
					}
					return Object.assign({}, x);
				});
			} else {
				this.selectedEntities.map((x, index) => {
					var existingEntity = this.selectedEntitiesforDocument.filter((y) => y.id === x.id && x.type === y.type);
					if (!existingEntity.length) {
						this.selectedEntitiesforDocument.push(Object.assign({}, x, { isSelected: false }));
					}
				});
				this.selectedEntitiesforDocument.map((x, index) => {
					var existingEntity = this.selectedEntities.filter((y) => y.id === x.id && x.type === y.type);
					if (!existingEntity.length) {
						this.selectedEntitiesforDocument.splice(index, 1);
					}
				});
				var selectedNumber = this.selectedEntitiesforDocument.filter((x) => x.isSelected).length;
				if (selectedNumber < 1) {
					this.selectedEntitiesforDocument[0].isSelected = true;
				}
			}
		},
		async loadComparisonChartData() {
			if (!this.selectedEntitiesforComparison.length) {
				this.selectedEntitiesforComparison = this.selectedEntities.map((x, index) => {
					//  var existingEntity = this.focusEntitiesforinsight.filter(y => y.id === x.id);
					if (index > 1) {
						return Object.assign({}, x, { isSelected: false });
					}
					return Object.assign({}, x);
				});
			} else {
				this.selectedEntities.map((x, index) => {
					var existingEntity = this.selectedEntitiesforComparison.filter((y) => y.id === x.id && x.type === y.type);
					if (!existingEntity.length) {
						this.selectedEntitiesforComparison.push(Object.assign({}, x, { isSelected: false }));
					}
				});
				this.selectedEntitiesforComparison.map((x, index) => {
					var existingEntity = this.selectedEntities.filter((y) => y.id === x.id && x.type === y.type);
					if (!existingEntity.length) {
						this.selectedEntitiesforComparison.splice(index, 1);
					}
				});
				var selectedNumber = this.selectedEntitiesforComparison.filter((x) => x.isSelected).length;
				if (selectedNumber < 2) {
					for (var nCnt = 0; nCnt < 2; nCnt++) {
						if (this.selectedEntitiesforComparison[nCnt] !== null && this.selectedEntitiesforComparison[nCnt] !== undefined) {
							this.selectedEntitiesforComparison[nCnt].isSelected = true;
						}
					}
				}
			}
		},
		async getApps() {
			try {
				var res = await this.$apiService.post("/common/getAllApps", {
					apptype: "Document",
				});
				if (res) {
					this.apps = res.data.data;
				}
			} catch (error) {
				// console.log(error);
			}
			// this.selectedApps = this.apps.map((value) => {return value.applicationid;});
		},
		checkMaximumSelection() {
			if (this.selectedApps.length > 5) {
				this.selectedApps.splice(5, 1);
			}
			localStorage.setItem("selectedApps", JSON.stringify(this.selectedApps));
			this.addSelectedTeamNames();
			return;
		},
		addSelectedTeamNames() {
			this.selectedAppNames = "";
			this.apps.forEach((element, index) => {
				if (this.selectedApps.includes(element.applicationid)) {
					this.selectedAppNames += this.selectedAppNames === "" ? element.app_name : "," + element.app_name;
				}
			});
		},
		resetHeight(index) {
		//	debugger;
if (index === 0) {
	this.activityPanelHeight = 380;
} else {
	this.activityPanelHeight = 700;
}
		}
		
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pagelayout {
	background-color: #fafafa;
	margin-top: 11px;
	overflow: hidden;
	
}
.filter {
	display: flex;
	flex-direction: row;
	align-content: center;
	justify-content: center;
	vertical-align: top;
	margin-top: -8px;
	margin-left: 0px;
}
.filteritem {
	border: 1px solid #e9e9e9;
	box-sizing: border-box;
	border-radius: 4px;
	font-size: 12px;
	height: 40px;
	/* width: 56px;
  height: 45px;
  margin-left:10px; */
	cursor: pointer;
}

/* .filterText {
  font-family: Open Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 45px;
  identical to box height
  Grey 1
  flex: 0 0 120px;
} */

.paneltitle {
	font-weight: bold;
	font-size: 14px;
	color: #202031;
}
hr {
	display: block;
	height: 1px;
	border: 0;
	border-top: 1px solid #233c67;
	margin: 0em 0;
	padding: 0;
	opacity: 0.4;
	/* box-shadow: 0px 4px 32px rgba(0, 49, 104, 0.05); */
}
.documentpanel {
	height: 239px !important;
	margin-top: -12px;
}
>>> .v-chip--active {
	background-color: #144584 !important;
}
.panelborder {
	border: 1px solid #e9e9e9;
	border-radius: 12px;
	margin-top: 5px;
	box-sizing: border-box;
	/* filter: drop-shadow(0px 4px 32px rgba(0, 49, 104, 0.05)); */
}
/* >>>.v-select__slot,.v-select__selections {  
  height: 35px;     
}
>>>.v-select__selection{
flex: 1 0 10% ;
   text-align: left;
    align-items: start;
   max-width:50px!important;
   margin-right:0px!important;
   overflow: hidden;
} */
>>> .reportrange-text {
	font-size: 12px;
}
>>> .form-control {
	height: 42px !important;
	line-height: 25px;
}
.menutext {
	color: #828288;
	left: 0;
	position: absolute;
	margin-left: 35px;
	font-size: 14px;
	margin-top: 3px;
}
.menutexttotal {
	color: #828288;
	left: 0;
	position: fixed;
	margin-left: 65px;
	font-size: 14px;
	margin-top: 0px;
}
.togglebtn {
	right: 0;
	position: absolute;
	margin-top: 10px;
	margin-right: 12px;
	cursor: pointer;
	z-index: 9999;
	border-radius: 4px;
	color: #828288;
}
.activetogglebtn {
	background-color: #4f7cb6 !important;
	color: #ffffff !important;
}
.panelrightmargin {
	margin-right: 15px;
}
.panelleftmargin {
	margin-left: 10px;
}
.pagemargin {
	margin-left: 20px;
}
.cardtitle {
align-items: center;
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    display: flex;
    font-size: 0.9375rem;
    line-height: 1;
    min-height: 64px;
    outline: none;
    padding: 16px 24px;
    position: relative;
    transition: 0.3s min-height cubic-bezier(0.25, 0.8, 0.5, 1);
    width: 100%;
text-align:left;

}

>>>.v-expansion-panel::before {
   box-shadow: none !important;
}
@media (max-width: 768px) {
	.pagelayout {
		background-color: #fafafa;
		margin-top: 11px;
		overflow: hidden;
		margin-left: 5px;
	}
	.panelrightmargin {
		margin-right: 5px;
	}
	.filter {
		display: flex;
		flex-direction: row;
		align-content: flex-start;

		vertical-align: top;
		margin-top: -8px;
		margin-left: 0px;
	}
	.pagemargin {
		margin-left: 10px;
	}
}
</style>
