<template>
    <div class="Schedule">

        <!-- Loading Icon -->
        <div class="loadingAnimation" v-if="!load"></div>

        <!-- Calendar Navbar -->
        <div class="viewSelector">
            <div class='buttonGroup'>
                <div class="text" v-if="load" @click="viewSelected = 0, closeModals()">Daily View
                    <div class="underline" :style="styleUnderline(0)"></div>
                </div>
                <div class="text" v-if="load" @click="viewSelected = 1, closeModals()">Weekly View
                    <div class="underline" :style="styleUnderline(1)"></div>
                </div>
                <div class="text" v-if="load" @click="viewSelected = 2, closeModals()">Monthly View
                    <div class="underline" :style="styleUnderline(2)"></div>
                </div>
            </div>
        </div>

        <!-- Calendars -->
        <DailyViewCalendar ref="DailyViewCalendar" v-if="viewSelected == 0 && load"></DailyViewCalendar>
        <WeeklyViewCalendar ref="WeeklyViewCalendar" v-if="viewSelected == 1 && load"></WeeklyViewCalendar>
        <MonthlyViewCalendar ref="MonthlyViewCalendar" v-if="viewSelected == 2 && load"></MonthlyViewCalendar>

        <!-- Modals -->
        <BookedDayModal ref="BookedDayModal"></BookedDayModal>
        <BookingModal ref="BookingModal"></BookingModal>

        <DateSelector ref="DateSelector"></DateSelector>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./css/Schedule.css";
</style>

<script>
    import * as api from '@/services/api_access';

    //Calendars
    import DailyViewCalendar from './components/calendars/DailyViewCalendar.vue';
    import WeeklyViewCalendar from './components/calendars/WeeklyViewCalendar.vue';
    import MonthlyViewCalendar from './components/calendars/MonthlyViewCalendar.vue';

    //Modals
    import BookedDayModal from './components/modals/BookedDayModal.vue';
    import BookingModal from './components/modals/BookingModal.vue';

    import DateSelector from './components/modals/DateSelector.vue';
    
    export default {
        components: {
            //Calendars
            DailyViewCalendar,
            WeeklyViewCalendar,
            MonthlyViewCalendar,

            //Modals
            BookedDayModal,
            BookingModal,

            DateSelector
        },

        data() {
            return {
                date: new Date(),

                viewSelected: 0,

                locations: [],
                hours: [
                    {id: 0, time: '7AM'},
                    {id: 1, time: '8AM'},
                    {id: 2, time: '9AM'},
                    {id: 3, time: '10AM'},
                    {id: 4, time: '11AM'},
                    {id: 5, time: '12PM'},
                    {id: 6, time: '1PM'},
                    {id: 7, time: '2PM'},
                    {id: 8, time: '3PM'},
                    {id: 9, time: '4PM'},
                    {id: 10, time: '5PM'},
                    {id: 11, time: '6PM'},
                    {id: 12, time: '7PM'},
                    {id: 13, time: '8PM'},
                    {id: 14, time: '9PM'}
                ],
                types: [
                    {id: 0, type: 'One on One'},
                    {id: 1, type: 'Performing Arts'},
                    {id: 2, type: 'Workshop (3-9)'},
                    {id: 3, type: 'Event (10+)'}
                ],
                resources: [],

                users: [],

                load: false
            }
        },

        methods: {
            checkBookings() {
                switch(this.viewSelected) {
                    case 0:
                        this.$refs.DailyViewCalendar.checkBookings();
                        break;
                    case 1:
                        this.$refs.WeeklyViewCalendar.checkBookings();
                        break;
                    case 2:
                        this.$refs.MonthlyViewCalendar.checkBookings();
                        break;
                }
            },

            updateCalender() {
                switch(this.viewSelected) {
                    case 0:
                        this.$refs.DailyViewCalendar.getDate();
                        break;
                    case 1:
                        this.$refs.WeeklyViewCalendar.getWeek();
                        break;
                    case 2:
                        this.$refs.MonthlyViewCalendar.getMonth();
                        break;
                }
            },

            closeModals() {
                this.$refs.BookingModal.closeModal();
                this.$refs.BookedDayModal.closeModal();
                this.$refs.DateSelector.closeModal();
            },

            styleUnderline(viewSelected) {
                if (this.viewSelected == viewSelected)
                    return 'width: 100%;';
                return 'width: 0px;';
            },

            getLocation(locationID) {
                for (var i = 0; i < this.locations.length; i++) {
                    if (this.locations[i].id == locationID)
                        return this.locations[i];
                }
            },
        },

        mounted() {
            api.getCalendarData().then(fetchedCalendarData => {
                this.locations = fetchedCalendarData[0];
                this.resources = fetchedCalendarData[1];
                this.load = true;
            });
            api.admin_GetAllUsers().then(fetchedUsers => {
                var admin = [];
                var tier5Member = [];
                var tier4Member = [];
                var tier3Member = [];
                var tier2Member = [];
                var tier1Member = [];
                var nonMember = [];
                for (var i = 0; i < fetchedUsers.length; i++) {
                    if (fetchedUsers[i].memberLevel == 6)
                        admin.push(fetchedUsers[i]);
                    else if (fetchedUsers[i].memberLevel == 5)
                        tier5Member.push(fetchedUsers[i]);
                    else if (fetchedUsers[i].memberLevel == 4)
                        tier4Member.push(fetchedUsers[i]);
                    else if (fetchedUsers[i].memberLevel == 3)
                        tier3Member.push(fetchedUsers[i]);
                    else if (fetchedUsers[i].memberLevel == 2)
                        tier2Member.push(fetchedUsers[i]);
                    else if (fetchedUsers[i].memberLevel == 1)
                        tier1Member.push(fetchedUsers[i]);
                    else if (fetchedUsers[i].memberLevel == 0)
                        nonMember.push(fetchedUsers[i]);
                }
                this.users = admin.concat(tier5Member).concat(tier4Member).concat(tier3Member).concat(tier2Member).concat(tier1Member).concat(nonMember);
            });
        }
    }

</script>
