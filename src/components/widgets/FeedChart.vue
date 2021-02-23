<template class="row">
	<div class="custom">
		<div class="feed-data">
			<div class="feed-header">
				<div class="header-title">
					Feed
				</div>
				<div>
					<input type="search" class="search-field" placeholder="Search item" @keyup="updateSearchQuery" />
				</div>
			</div>
			<hr />
			<div v-if="showLoader" class="center-align">Loading...</div>
			<div v-if="!showLoader && getFeeds.length === 0" class="center-align">No Data to show</div>
			<ul v-if="!showLoader && getFeeds !== []" style="height: 150px; overflow: auto">
				<li v-for="(feed, index) in getFeeds" :key="index" class="list-style">
					<img :src="getImageIcon(feed.message)" />
					<div>
						<b>{{ feed.creatorName }}</b
						>: {{ feed.message }}
					</div>
					<span>{{ feed.rating }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import moment from "moment";
import Image from "../../assets/icons/trophy.jpeg";
import notificationImage from "../../assets/icons/megaphone.jpeg";
export default {
	props: ["dateRange", "timeMode"],
	data() {
		return {
			feeds: [],
			showLoader: true,
			searchQuery: "",
		};
	},
	computed: {
		getFeeds() {
			if (this.searchQuery.trim().length === 0) {
				return this.feeds;
			} else {
				return this.feeds.filter((feed) =>
					`${feed.creatorName} ${feed.message}`.toLocaleLowerCase().includes(this.searchQuery.toLocaleLowerCase()),
				);
			}
		},
		selectedEntities() {
			return this.$store.state.selectedEntities;
		},
	},
	watch: {
		selectedEntities: {
			handler(newVal, oldVal) {
				this.fetchResponse()
					.then((response) => {
						this.feeds = response.data.result;
						this.showLoader = false;
					})
					.catch((err) => {
						console.log("Error while fetching records");
					});
			},
		},
		dateRange: {
			handler(newVal, oldVal) {
				if (newVal !== oldVal) {
					this.fetchResponse()
						.then((response) => {
							this.feeds = response.data.result;
							this.showLoader = false;
						})
						.catch((err) => {
							console.log("Error while fetching records");
						});
				}
			},
		},
		timeMode: {
			handler(newVal, oldVal) {
				if (newVal !== oldVal) {
					this.fetchResponse()
						.then((response) => {
							this.feeds = response.data.result;
							this.showLoader = false;
						})
						.catch((err) => {
							console.log("Error while fetching records");
						});
				}
			},
		},
	},
	methods: {
		getRequestPayload() {
			var teamIDs = this.selectedEntities.filter((x) => x.type === "team" && x.isSelected).map((y) => y.id);
			var userIDs = this.selectedEntities.filter((x) => x.type === "user" && x.isSelected).map((y) => y.id);
			let reqPayload = {
				timeMode: this.timeMode,
				teamIDs: teamIDs,
				userIDs: userIDs,
				enddate: moment(this.dateRange.endDate).format("YYYY-MM-DD HH:mm:ss"),
				startdate: moment(this.dateRange.startDate).format("YYYY-MM-DD HH:mm:ss"),
				userID: localStorage.getItem("userid"),
			};
			return reqPayload;
		},
		fetchResponse() {
			this.showLoader = true;
			let payload = this.getRequestPayload();
			return this.$apiService.post("/users/getFeed", payload);
		},
		getImageIcon(message) {
			return message.includes("@") ? notificationImage : Image;
		},
		getUserName() {
			return localStorage.getItem("userName");
		},
		updateSearchQuery(event) {
			this.searchQuery = event.target.value;
		},
	},
};
</script>

<style scoped>
.feed-data {
	scrollbar-color: #ffffff;
	height: 250px;
	background-color: #ffffff;
	border-radius: 12px;
	border: 1px solid #e9e9e9;
	border-radius: 12px;
	box-sizing: border-box;
	filter: drop-shadow(0px 4px 32px rgba(0, 49, 104, 0.05));
	padding: 1rem;
}
.overlay {
	position: absolute;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	background-color: rgba(255, 255, 255, 0.8);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 199;
}
.list-style {
	list-style-type: none;
}
.feed-data ul {
	padding: 0;
	margin: 0;
	list-style: none;
}
.feed-data ul li {
	display: flex;
	align-items: center;
	border: 1px solid #ddd;
	border-radius: 1.5rem;
	padding: 0.5rem 1rem;
	justify-content: space-between;
}
.feed-data ul li img {
	height: 30px;
	width: 30px;
}
.feed-data ul li div {
	padding: 0 0.5rem;
}
.feed-data ul li:not(:last-child) {
	margin-bottom: 1rem;
}
.feed-data ul li span {
	width: 30px;
	height: 30px;
	background: #448aff;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	font-size: 18px;
	font-weight: 600;
	color: #ddd;
}
.search-field {
	background: #fff;
	border: 1px solid #ddd;
	border-radius: 16px;
	height: 30px;
	width: 150px;
	padding-left: 10px;
}
.search-field:focus {
	outline: none;
}
.feed-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 5px 10px;
}
.custom {
	margin-top: 6px;
}
.center-align {
	height: inherit;
	width: inherit;
	display: flex;
	justify-content: center;
	align-items: center;
}
.header-title {
	font-weight: bold;
	font-size: 17px;
	color: #202031;
}
</style>
