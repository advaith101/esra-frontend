<template>
    <div>
        <v-container class="container">
            <v-layout column>
                <v-flex class="date-heading" align-self-start>
                    <h6>{{ heading(date) }}</h6>
                </v-flex>
                <div v-bind:key="notification.Name" v-for="notification in notificationList">
                    <v-flex >
                        <v-badge :value="!notification.seen" left dot offset-x="20" offset-y="5" color="green">
                            <v-card :elevation="notification.seen ? 1 : 4" :class="notification.read ? 'notif-read':'notif-not-read'" min-width="410px" >
                                <v-card-title class="text-sm-left notif-font" style="font-weight:bold; font-size:1.1rem;" >{{ notification.Name }}</v-card-title>
                                <v-card-subtitle class="text-left notif-font">{{ notification.description }}</v-card-subtitle>
                            </v-card>
                        </v-badge>
                        <br />
                        <p class="time" style="margin-top:10px">at {{ notification.time }}</p>
                    </v-flex>
                </div>
                
            </v-layout>
        </v-container>
    </div>
</template>

<script>
export default {
    props: ['notificationList', 'date'],
    methods: {
        heading:function(date) {
            var t = new Date()
            var y = new Date()
            y.setDate(t.getDate() - 1)

            var today = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate()
            var yesterday = y.getFullYear() + "-" + (y.getMonth() + 1) + "-" + y.getDate()

            if(date == today) {
                return "Today"
            } else if (date == yesterday) {
                return "Yesterday"
            }
            return date
        }
    },
    data () {
        return {
            dateHeading: ""
        }
    }
}
</script>

<style scoped>

    .time{
        float: left;
    }

    .notif-not-read {
        background-color: #F2F6FC;
    }

    .notif-read {
        background-color: #ffffff;
    }

    .notif-font {
        font-family: Open Sans;
        font-style: normal;
    }

    .v-card {
        font-family: Open Sans;
    }

</style>