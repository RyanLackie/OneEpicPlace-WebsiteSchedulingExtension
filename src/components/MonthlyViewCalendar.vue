<template>
    <div class="MonthlyViewCalendar"> 

        <!-- Container for date selector -->
        <div class="dateSelector">
            <button id="dateSelectorPreviousBtn" class="btn backBtn" type="button" @click="decMonth()"></button>
            <input id="dateSelectorDate" class="date" :value="getMonthName(firstDay) + ' ' + firstDay.getFullYear()" disabled>
            <button id="dateSelectorCalendar" class="btn calendarBtn" type="button"></button>
            <button id="dateSelectorPreviousBtn" class="btn forwardBtn" type="button" @click="incMonth()"></button>
        </div>

        <!-- Calendar -->
        <div class="calendar" id='calendar'>

            <!-- Inner Scrollable Section -->
            <div class="innerSection" id='innerSection'>

                <!-- Days -->
                <div class="topRow" id='topRow'>
                    <div class="dayContainer" v-for="(day, index) in week" :key="'day'+index" :id="'day'+index">
                        <div class="day">
                            <div class="dayOfTheWeek">{{day}}</div>
                        </div>
                    </div>
                </div>

                <!-- Calendar Rows -->
                <div class="firstRowPlaceHolder"></div>
                <div class="calendarRow" v-for="week in 6" :key="'week'+week" :id="'week'+week">
                    <!-- Calendar Blocks -->
                    <div class="block" v-for="day in 7" :key="'block'+week+':'+day" :id="'block'+week+':'+day">
                        <!-- Display -->
                        <div class="date" :style="styleDate(week, day)">{{days[(7*(week-1) + day) - 1].getDate()}}</div>
                        <div class="searchBar">
                            <div class="searchIcon" :style='styleBookingCount(week, day)'></div>
                            <div class="searchText" :style='styleBookingCount(week, day)'>
                                {{getBookingCount(week, day) + ' total'}}
                            </div>
                        </div>
                        <button class="addBtn" @click="addBookingClicked(week, day)"></button>

                        <!-- Bookings -->
                        <div class="booking" v-for="booking in sortBookingsFor(week, day)" :key="'booking'+booking.id" :id="'booking'+booking.id">
                            <div class="timeBox" :style='"background-color:"+booking.bookingColor'>
                                <div class="time">{{fillBookingStartTime(booking)}}</div>
                            </div>
                            <div class="warningIcon" :style='styleWarningIcon(booking)'></div>
                            <div class="textBox" :style='styleBookingText(booking)'>
                                <div class="text">{{booking.title}}</div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    
    </div>
        
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "css/MonthlyViewCalendar.css";
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        components: {
            
        },

        data() {
            return {
                //days for the calendar
                firstDay: null,
                days: [],

                week: [
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saterday'
                ],

                //rooms include: id, name, type
                rooms: [
                    {id: 0, name: 'DaVinci Room',                   type: 'room'},
                    {id: 1, name: 'Green Room',                     type: 'room'},
                    {id: 2, name: 'Sunshine Room',                  type: 'room'},
                    {id: 3, name: 'Zen Room',                       type: 'room'},
                    {id: 4, name: 'Studio',                         type: 'room'},
                    {id: 5, name: 'EPIC Room',                      type: 'room'},
                    {id: 6, name: 'Carriage House Treatment Room',  type: 'room'},
                    {id: 7, name: 'Buissness Hub',                  type: 'room'},
                    {id: 8, name: 'Loft',                           type: 'room'},
                    {id: 9, name: 'Porch',                          type: 'room'},
                    {id: 10, name: 'Lawn',                          type: 'room'},

                    {id: 11, name: 'Hot Desk',                      type: 'desk'},
                    {id: 12, name: 'Hot Desk',                      type: 'desk'},
                    {id: 13, name: 'Hot Desk',                      type: 'desk'},
                    {id: 14, name: 'Hot Desk',                      type: 'desk'},
                    {id: 15, name: 'Hot Desk',                      type: 'desk'},
                    {id: 16, name: 'Hot Desk',                      type: 'desk'},
                    {id: 17, name: 'Hot Desk',                      type: 'desk'},
                    {id: 18, name: 'Hot Desk',                      type: 'desk'},
                    {id: 19, name: 'Hot Desk',                      type: 'desk'},
                    {id: 20, name: 'Hot Desk',                      type: 'desk'},
                    {id: 21, name: 'Hot Desk',                      type: 'desk'},
                    {id: 22, name: 'Hot Desk',                      type: 'desk'}
                ],

                //List of returned bookings
                bookings: [],
                //Interval to check the server for bookings
                checkBookingsTimeout: null,
                bookingDelays: 0,
            }
        },

        methods: {
            /* Date Functions */
            getMonth(day) {
                //Get first day of the month for date selector
                this.firstDay = new Date(day.setDate(1));

                //Reset days
                this.days = [];
                
                //Get days before, during, and after the month
                var preMonth = [];
                var startOfTheMonth = new Date(day.setDate(1));
                var startOfTheMonth_day = startOfTheMonth.getDay();
                var startOfDays = new Date(day.setDate(startOfTheMonth.getDate() - startOfTheMonth_day));
                for (var index = 0; index < 42; index++) {
                    var temp = new Date(day);
                    temp = new Date(temp.setDate(startOfDays.getDate() + index));
                    temp.setHours(0, 0, 0, 0);
                    this.days[this.days.length] = temp;
                }
                /*
                for (var i = 0; i < this.days.length; i++) {
                    console.log(i + ' / ' + this.days[i]);
                }
                */
            },
            decMonth: function() {
                this.getMonth(new Date(this.days[0].setDate(this.days[0].getDate() - 1)));
                this.checkBookings();
            },
            incMonth: function() {
                this.getMonth(new Date(this.days[this.days.length-1].setDate(this.days[this.days.length-1].getDate() + 1)));
                this.checkBookings();
            },

            getMonthName(day) {
                switch(day.getMonth()) {
                    case 0: return 'January';
                    case 1: return 'February';
                    case 2: return 'March';
                    case 3: return 'April';
                    case 4: return 'May';
                    case 5: return 'June';
                    case 6: return 'July';
                    case 7: return 'August';
                    case 8: return 'September';
                    case 9: return 'October';
                    case 10: return 'November';
                    case 11: return 'December';
                }
            },

            /* JavaScript Styling */
            sortBookingsFor(week, day) {
                var date = this.days[(7*(week-1) + day) - 1]
                var matchedBookings = [];
                //sort though all bookings and return the first 3 that are within the right block and not a desk
                for (var i = 0; i < this.bookings.length; i++) {
                    if (date.toJSON().slice(0, 10) == this.bookings[i].date.slice(0, 10))
                        matchedBookings[matchedBookings.length] = this.bookings[i];
                }
                matchedBookings.sort(function(booking1, booking2) {
                    booking1 = booking1.startTime.split(':')[0] + booking1.startTime.split(':')[1];
                    booking2 = booking2.startTime.split(':')[0] + booking2.startTime.split(':')[1];
                    //console.log(booking1 + '  ' + booking2);
                    return booking1 - booking2;
                });
                if (matchedBookings.length > 3) 
                    matchedBookings = [matchedBookings[0], matchedBookings[1], matchedBookings[2]];
                return matchedBookings;
            },
            fillBookingStartTime(booking) {
                if (booking.startTime.split(':')[0] < 12)
                    return parseInt(booking.startTime.split(':')[0]) + ':' + booking.startTime.split(':')[1] + ' am';
                else if (booking.startTime.split(':')[0] == 12)
                    return booking.startTime + ' pm';
                else
                    return booking.startTime.split(':')[0] - 12 + ':' + booking.startTime.split(':')[1] + ' pm';
            },
            styleWarningIcon(booking) {
                if (booking.noiseLevel > 0)
                    return 'display: inline;';
            },
            styleBookingText(booking) {
                if (booking.noiseLevel > 0)
                    return 'width: 56%;';
            },
            getBookingCount(week, day) {
                var date = this.days[(7*(week-1) + day) - 1];
                var count = 0;
                for (var i = 0; i < this.bookings.length; i++) {
                    if (date.toJSON().slice(0, 10) == this.bookings[i].date.slice(0, 10))
                        count++;
                }
                return count;
            },
            styleBookingCount(week, day) {
                var date = this.days[(7*(week-1) + day) - 1];
                var count = 0;
                for (var i = 0; i < this.bookings.length; i++) {
                    if (date.toJSON().slice(0, 10) == this.bookings[i].date.slice(0, 10))
                        count++;
                }
                if (count == 0)
                    return 'visibility: hidden;';
            },
            styleDate(week, day) {
                var date = this.days[(7*(week-1) + day) - 1];
                if (date.getMonth() != this.firstDay.getMonth())
                    return 'color:LightGray;';
            },

            /* Data Update */
            checkBookingsLoop() {
                var THIS = this;
                this.checkBookingsTimeout = setTimeout(function() {
                    THIS.bookingsDelay = 5000;
                    var startDate = THIS.days[0].toJSON().slice(0, 10);
                    var endDate = THIS.days[THIS.days.length-1].toJSON().slice(0, 10);
                    api.getBookingsRange(startDate, endDate).then(bookingsResult => {
                        THIS.bookings = bookingsResult;
                        THIS.checkBookingsLoop();
                    });
                }, this.bookingsDelay)
            },
            checkBookings() {
                this.bookings = [];
                clearTimeout(this.checkBookingsTimeout);
                this.bookingsDelay = 500;
                this.checkBookingsLoop();
            },
        },
        
        beforeMount() {
            //console.log('beforeMount');
            this.getMonth(new Date());
        },
        mounted() {
            //console.log('mounted');
            //Start check booking loop
            this.checkBookingsLoop();
            //Start page scroll listener
            //window.addEventListener('scroll', this.handlePageScroll);
        },
        beforeDestroy() {
            //console.log('beforeDestroy');
            //End check booking loop
            clearTimeout(this.checkBookingsTimeout);
            //End page scroll listener
            //window.removeEventListener('scroll', this.handlePageScroll);
        }
    }
</script>
    