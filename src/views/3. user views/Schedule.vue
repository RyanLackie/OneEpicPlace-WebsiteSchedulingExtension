<template>
    <div class="Schedule">

        <!-- Calendar Navbar -->
        <div class="viewSelector">
            <a class="viewText" href="JavaScript:void(0)" @click="changeView(0)">Daily View</a>
            <a class="viewText" href="JavaScript:void(0)" @click="changeView(1)">Weekly View</a>
            <a class="viewText" href="JavaScript:void(0)" @click="changeView(2)">Monthly View</a>
        </div>

        <!-- Daily View Calendar -->
        <DailyViewCalendar ref="DailyViewCalendar" v-if="viewSelected == 0"></DailyViewCalendar>

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
                viewSelected: 0
            }
        },

        methods: {
            changeView(input) {
                this.viewSelected = input;
            }
        }
    }

</script>
