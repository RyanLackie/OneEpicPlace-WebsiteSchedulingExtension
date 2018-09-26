<template>
    <v-app dark>
        <div v-if="this.$store.state.isLoggedin == true">
            <v-navigation-drawer clipped v-model="drawer" app>
                <v-list>
                    <v-list-group v-model="item.active" v-for="item in menu" :key="item.title" :prepend-icon="item.action" no-action>
                        <v-list-tile slot="activator">
                            <v-list-tile-content>
                                <v-list-tile-title> {{item.title}} </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile v-for="subItem in item.items" :key="subItem.title" @click="selection = subItem.selector">
                            <v-list-tile-content>
                                <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-icon>{{ subItem.action }}</v-icon>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list-group>
                </v-list>
            </v-navigation-drawer>
            <v-toolbar app fixed clipped-left>
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <v-toolbar-title>EPIC</v-toolbar-title>
            </v-toolbar>
            <v-content>
                <v-container fluid fill-height>
                    <v-layout justify-center>
                        <component :is="selection"></component>
                    </v-layout>
                </v-container>
            </v-content>
        </div>
        <div v-else href="#/login">
            Not logged in, click to redirect
        </div>
    </v-app>
</template>


<script>
import Profile from "./Profile.vue";
import ProfileEdit from "./ProfileEdit.vue";
import FullCalendar from "./FullCalendar.vue";
import CalendarMonthly from "./CalendarMonthly.vue";
import CalendarWeekly from "./CalendarWeekly.vue";
import CalendarDaily from "./CalendarDaily.vue";
import Booking from "./Booking.vue";

export default {
  data: () => ({
    drawer: true,
    selection: "profile-page",
    menu: [
      {
        action: "today",
        title: "Calendar",
        active: true,
        items: [
          {
            title: "Full View",
            selector: "full-calendar"
          },
          {
            title: "Event Booking",
            selector: "booking"
          },
          {
            title: "Monthly View",
            selector: "calendar-monthly"
          },
          {
            title: "Weekly View",
            selector: "calendar-weekly"
          },
          {
            title: "Daily View",
            selector: "calendar-daily"
          }
        ]
      },
      {
        action: "account_circle",
        title: "Profile",
        active: false,
        items: [
          {
            title: "View Profile",
            selector: "profile-page"
          },
          {
            title: "Edit Profile",
            selector: "profile-edit"
          }
        ]
      }
    ]
  }),
  components: {
    "profile-page": Profile,
    "profile-edit": ProfileEdit,
    "full-calendar": FullCalendar,
    "calendar-monthly": CalendarMonthly,
    "calendar-weekly": CalendarWeekly,
    "calendar-daily": CalendarDaily,
    "booking": Booking
  },
  methods: {}
};
</script>

<style>

</style>