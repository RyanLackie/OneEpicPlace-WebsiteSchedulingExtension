<template>
    <div class="Schedule">

        <!-- Calendar Navbar -->
        <div class="viewSelector">
            <a class="viewText">Daily View</a>
            <a class="viewTextCenter">Weekly View</a>
            <a class="viewText">Monthly View</a>
        </div>

        <!-- Container for date selector -->
        <div class="dateSelector">
            <button id="dateSelectorPreviousBtn" class="btn backBtn" type="button" @click="decDate()"></button>
            <input id="dateSelectorDate" class="date" :value="date.getMonth()+1+'/'+date.getDate()+'/'+date.getFullYear()" disabled>
            <button id="dateSelectorCalendar" class="btn calendarBtn" type="button"></button>
            <button id="dateSelectorPreviousBtn" class="btn forwardBtn" type="button" @click="incDate()"></button>
        </div>

        <!-- Daily View Calendar -->
        <DailyViewCalendar ref="DailyViewCalendar"></DailyViewCalendar>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "css/Schedule.css";
</style>

<script>
    import * as api from '@/services/api_access';

    import DailyViewCalendar from '@/components/DailyViewCalendar.vue'

    export default {
        components: {
            DailyViewCalendar
        },

        data() {
            return {
                //date for calender
                date: new Date(),
            }
        },

        methods: {
            decDate: function() {
                this.date = new Date(this.date.setDate(this.date.getDate() - 1));
                this.checkBookings();
            },
            incDate: function() {
                this.date = new Date(this.date.setDate(this.date.getDate() + 1));
                this.checkBookings();
            }
        },
        
        mounted() {
            
        },
        destroyed() {
            
        }
    }

</script>
