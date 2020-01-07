<template>
    <div class="MonthlyViewCalendar"> 

        <!-- Container for date selector -->
        <div class="container" style='margin-bottom: 10px'>
            <div class="row justify-content-center">
                <div class="col-2">
                    <button class="btn backBtn" type="button" @click="decMonth()"></button>
                </div>
                <div class="col-4" @click="$parent.$refs.DateSelector.openModal()">
                    <span class="dateSelectorDate">{{getMonthName(firstDay) + ' ' + firstDay.getFullYear()}}</span>
                </div>
                <div class="col-2">
                    <button class="btn forwardBtn" type="button" @click="incMonth()"></button>
                </div>
            </div>
        </div>

        <!-- Calendar -->
        <div class="calendar" id='calendar'>

            <!-- Inner Scrollable Section -->
            <div class="innerSection" id='innerSection' @scroll='handleInnerSectionScroll()'>

                <!-- Days -->
                <div class="topRow" id='topRow'>
                    <div class="dayContainer" v-for="index in 7" :key="'day'+index">
                        <div class="day">
                            <div class="dayOfTheWeek">{{getDayOfTheWeek(index)}}</div>
                        </div>
                    </div>
                </div>

                <!-- Calendar Rows -->
                <div class="firstRowPlaceHolder"></div>
                <div class="calendarRow" v-for="week in 6" :key="'week'+week">
                    <!-- Calendar Blocks -->
                    <div class="block" v-for="day in 7" :key="'block'+week+':'+day" :style='styleCurrentDay(week, day)'>
                        <!-- Display -->
                        <div class="date" :style="styleDate(week, day)">{{days[(7*(week-1) + day) - 1].getDate()}}</div>
                        <div class="searchBar">
                            <div class="searchIcon" :style='styleBookingCount(week, day)' @click='viewBookings(week, day)'></div>
                            <div class="searchText" :style='styleBookingCount(week, day)' @click='viewBookings(week, day)'>
                                {{getBookingCount(week, day) + ' total'}}
                            </div>
                        </div>
                        <button class="addBtn" @click="addBookingClicked(week, day)"></button>

                        <!-- Bookings -->
                        <div class="booking" v-for="booking in sortBookingsFor(week, day)" :key="'booking'+booking.id" @click='viewBookings(week, day)'>
                            <div class="timeBox" :style='"background-color:"+$parent.getLocation(booking.locationID).color'>
                                <div class="time">{{fillBookingStartTime(booking)}}</div>
                            </div>
                            <div v-if="booking.noiseLevel != 0" class="icon" :style='styleIcon(booking)'></div>
                            <div class="textBox" :style='styleBookingText(booking)'>
                                <div class="text">{{booking.username}}</div>
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
    @import "./css/MonthlyViewCalendar.css";
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                //days for the calendar
                firstDay: null,
                days: [],

                //locations include: id, name, type
                locations: this.$parent.locations,

                //List of returned bookings
                bookings: [],
                //Interval to check the server for bookings
                checkBookingsTimeout: null,
                bookingDelays: 0,
            }
        },

        methods: {
            /* Date Functions */
            getMonth() {
                //Get first day of the month for date selector
                let day = this.$parent.date;
                this.firstDay = new Date(day.setDate(1));

                //Reset days
                this.days = [];
                
                //Get days before, during, and after the month
                var startOfTheMonth = new Date(day.setDate(1));
                var startOfTheMonth_day = startOfTheMonth.getDay();
                var startOfDays = new Date(day.setDate(startOfTheMonth.getDate() - startOfTheMonth_day));
                for (var index = 0; index < 42; index++) {
                    var temp = new Date(day);
                    temp = new Date(temp.setDate(startOfDays.getDate() + index));
                    temp.setHours(0, 0, 0, 0);
                    this.days[this.days.length] = temp;
                }
                this.checkBookings();
            },
            decMonth: function() {
                this.$parent.date = new Date(this.days[0].setDate(this.days[0].getDate() - 1));
                this.getMonth();
            },
            incMonth: function() {
                this.$parent.date = new Date(this.days[this.days.length-1].setDate(this.days[this.days.length-1].getDate() + 1));
                this.getMonth();
            },

            getDayOfTheWeek(index) {
                switch(index) {
                    case 1: return 'Sunday';
                    case 2: return 'Monday';
                    case 3: return 'Tuesday';
                    case 4: return 'Wednesday';
                    case 5: return 'Thursday';
                    case 6: return 'Friday';
                    case 7: return 'Saturday';
                }
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
            styleCurrentDay(week, day) {
                var date = this.days[(7*(week-1) + day) - 1];
                let yesterdayDate = new Date();
                yesterdayDate.setDate((new Date().getDate() - 1));
                if (date.getTime() < yesterdayDate.getTime()) {
                    return 'background-color: Gainsboro;';
                }
                else {
                    return 'background-color: white;';
                }
            },
            sortBookingsFor(week, day) {
                var date = this.days[(7*(week-1) + day) - 1];
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
            styleIcon(booking) {
                var volumeOn = require('../../../../assets/volumeOn-black.png');
                var volumeOff = require('../../../../assets/volumeOff-black.png');
                if (booking.noiseLevel > 0)
                    return 'background-image: url('+volumeOn+');';
                else if (booking.noiseLevel < 0)
                    return 'background-image: url('+volumeOff+');';
            },
            styleBookingText(booking) {
                if (booking.noiseLevel != 0)
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
                    return 'color: LightGray;';
            },

            /* Data Update */
            checkBookingsLoop() {
                var THIS = this;
                this.checkBookingsTimeout = setTimeout(function() {
                    THIS.bookingsDelay = 5000;
                    var startDate = THIS.days[0].toJSON().slice(0, 10);
                    var endDate = THIS.days[THIS.days.length-1].toJSON().slice(0, 10);
                    var refDate = THIS.days[0];
                    api.getBookingsDate(startDate, endDate).then(bookingsResult => {
                        if (refDate != THIS.days[0])
                            return;
                        THIS.bookings = bookingsResult;
                        THIS.checkBookingsLoop();
                    });
                }, this.bookingsDelay)
            },
            checkBookings() {
                this.bookings = [];
                clearTimeout(this.checkBookingsTimeout);
                this.bookingsDelay = 0;
                this.checkBookingsLoop();
            },

            /* User Actions */
            handlePageScroll() {
                //Top Row Sticky Movment
                var originalTop = document.getElementById('calendar').getBoundingClientRect().top + window.scrollY;
                if (window.scrollY >= originalTop)
                    document.getElementById('topRow').style.top = window.scrollY - originalTop + 'px';
                else
                    document.getElementById('topRow').style.top = '0px';
            },
            handleInnerSectionScroll() {
                //Make sure calender y cant be changed
                document.getElementById('innerSection').scrollTop = 0;
            },

            addBookingClicked(week, day) {
                this.$parent.closeModals();
                this.$parent.$refs.BookingModal.openModal(this.days[(7*(week-1) + day) - 1], this.locations[0], '12:00', '12:00');
            },

            viewBookings(week, day) {
                var date = this.days[(7*(week-1) + day) - 1];
                var matchedBookings = [];
                //sort though all bookings and open a modal with the bookings for the right day sorted by time
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
                this.$parent.closeModals();
                this.$parent.$refs.BookedDayModal.openModal(matchedBookings);
            }
        },
        
        beforeMount() {
            this.getMonth();
        },
        mounted() {
            //Start check booking loop
            this.checkBookingsLoop();
            //Start page scroll listener
            window.addEventListener('scroll', this.handlePageScroll);
        },
        beforeDestroy() {
            //End check booking loop
            clearTimeout(this.checkBookingsTimeout);
            //End page scroll listener
            window.removeEventListener('scroll', this.handlePageScroll);
        }
    }
</script>
    