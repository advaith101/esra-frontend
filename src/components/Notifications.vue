<template>
    <div class="notification-panel">
        <v-container class="container pa-0" >
          <v-layout column>
            <v-flex lg12 v-bind:key="date" v-for="date in dates" >
              <NotificationItem :date="date" :notificationList="extractNotifications(date)" />
            </v-flex>
          </v-layout>
        </v-container>
    </div>
</template>

<script>
import moment from "moment";
import NotificationItem from './widgets/NotificationItem';

export default {
    components: {
      NotificationItem,
    },
    data() {
      return {}
    },
    props: ['notifications'],
    computed: {
      dates:function() {
        var allDates = []
        this.notifications.forEach((notification) => {
          if(!allDates.includes(notification.date)) {
            allDates.push(notification.date)
          }
        })

        return allDates
      }
    },
    methods: {
      extractNotifications:function(date) {
        return this.notifications.filter((element) => {
          return element.date.match(date)
        })
      }
    }
}
</script>


