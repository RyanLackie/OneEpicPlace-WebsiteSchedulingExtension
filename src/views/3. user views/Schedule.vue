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
        <BookingModal ref="BookingModal"></BookingModal>
        <BookedModal ref="BookedModal"></BookedModal>
        <BookedDayModal ref="BookedDayModal"></BookedDayModal>

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
    import BookingModal from './components/modals/BookingModal.vue';
    import BookedModal from './components/modals/BookedModal.vue';
    import BookedDayModal from './components/modals/BookedDayModal.vue';
    

    export default {
        components: {
            //Calendars
            DailyViewCalendar,
            WeeklyViewCalendar,
            MonthlyViewCalendar,

            //Modals
            BookingModal,
            BookedModal,
            BookedDayModal
        },

        data() {
            return {
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

            closeModals() {
                this.$refs.BookingModal.closeModal();
                this.$refs.BookedModal.closeModal();
                this.$refs.BookedDayModal.closeModal();
            },

            styleUnderline(viewSelected) {
                if (this.viewSelected == viewSelected)
                    return 'width: 100%;';
                return 'width: 0px;';
            }
        },

        mounted() {
            api.getCalendarData().then(fetchedCalendarData => {
                this.locations = fetchedCalendarData[0];
                this.resources = fetchedCalendarData[1];
                this.load = true;
            });
        }
    }

</script>
