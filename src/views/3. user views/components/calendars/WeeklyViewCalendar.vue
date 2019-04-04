<template>
    <div class="WeeklyViewCalendar"> 

        <!-- Container for date selector -->
        <div class="dateSelector">
            <button id="dateSelectorPreviousBtn" class="btn backBtn" type="button" @click="decWeek()"></button>
            <input id="dateSelectorDate" class="date" :value="week[0].getMonth()+1+'/'+week[0].getDate()+'/'+week[0].getFullYear()" disabled>
            <div class="hyphen">-</div>
            <input id="dateSelectorDate" class="date" :value="week[6].getMonth()+1+'/'+week[6].getDate()+'/'+week[6].getFullYear()" disabled>
            <!--button id="dateSelectorCalendar" class="btn calendarBtn" type="button"></button-->
            <button id="dateSelectorPreviousBtn" class="btn forwardBtn" type="button" @click="incWeek()"></button>
        </div>

        <!-- Calendar -->
        <div class="calendar" id='calendar'>

            <!-- Locations -->
            <div class="locationCol">
                <div class="firstLocationPlaceHolder"></div>
                <div class="locationContainer" v-for="location in locations" :key="'location'+location.id" :id="'location'+location.id" :style='styleDeskElements(location)'>
                    <div class="location">
                        <div class="text">{{location.name}}</div>
                    </div>
                </div>
            </div>

            <!-- Inner Scrollable Section -->
            <div class="innerSection" id='innerSection' @scroll='handleInnerSectionScroll()'>
                
                <!-- Days -->
                <div class="topRow" id='topRow'>
                    <div class="dayContainer" v-for="(day, index) in week" :key="'day'+index">
                        <div class="day">
                            <div class="date">{{day.getMonth()+1 + ' / ' + day.getDate()}}</div>
                            <div class="dayOfTheWeek">{{getDayOfTheWeek(day)}}</div>
                        </div>
                    </div>
                </div>

                <!-- Calendar Rows -->
                <div class="firstRowPlaceHolder"></div>
                <div class="calendarRow" v-for="location in locations" :key="'loc'+location.id" :style='styleDeskElements(location)'>
                    <!-- Calendar Blocks -->
                    <div class="block" v-for="(day, index) in week" :key="'block'+location.id+':'+index" :style='styleCurrentDay(day)'>
                        
                        <!-- Buttons -->
                        <div class="searchIcon" :style='styleBookingCount(day, location)' @click='viewBookings(day, location)'></div>
                        <div class="searchText" :style='styleBookingCount(day, location)' @click='viewBookings(day, location)'>
                            {{getBookingCount(day, location) + ' total'}}
                        </div>
                        <button class="addBtn" @click="addBookingClicked(day, location)"></button>
                        
                        <!-- Bookings -->
                        <div class="booking" v-for="booking in sortBookingsFor(day, location)" :key="'booking'+booking.id" @click='viewBookings(day, location)'>
                            <div class="timeBox" :style='"background-color:"+booking.bookingColor'>
                                <div class="time">{{fillBookingStartTime(booking)}}</div>
                            </div>
                            <div v-if='booking.noiseLevel != 0' class="icon" :style='styleIcon(booking)'></div>
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
    @import "./css/WeeklyViewCalendar.css";
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                //Week for the calendar
                week: [],

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
            getWeek(day) {
                this.week[0] = new Date(day.setDate(day.getDate() - (day.getDay())));
                this.week[0].setHours(0, 0, 0, 0);
                var previous = new Date(this.week[0]);
                for (var i = 1; i < 7; i++) {
                    this.week[i] = new Date(previous.setDate(this.week[i-1].getDate() + 1));
                    this.week[i].setHours(0, 0, 0, 0);
                    previous = new Date(this.week[i]);
                }
            },
            decWeek: function() {
                this.getWeek(new Date(this.week[0].setDate(this.week[0].getDate() - 1)));
                this.checkBookings();
            },
            incWeek: function() {
                this.getWeek(new Date(this.week[this.week.length-1].setDate(this.week[this.week.length-1].getDate() + 1)));
                this.checkBookings();
            },

            /* JavaScript Styling */
            styleDeskElements(location) {
                if (location.type == 'room') {
                    for (var i = 0; i < this.locations.length; i++) {
                        if (this.locations[i] == location && i+1 < this.locations.length && this.locations[i+1].type == 'desk')
                            return 'margin-bottom: 20px;';
                    }
                }
                else if (location.type == 'desk')
                    return 'height: 26px;';
            },
            styleCurrentDay(day) {
                if (new Date().toJSON().slice(0, 10) == day.toJSON().slice(0, 10))
                    return 'background-color: Gainsboro;';
                else    //Done to reset yestday on DOM lifecycle refresh
                    return 'background-color: white;';
            },
            getDayOfTheWeek(day) {
                switch(day.getDay()) {
                    case 0: return 'Sunday';
                    case 1: return 'Monday';
                    case 2: return 'Tuesday';
                    case 3: return 'Wednesday';
                    case 4: return 'Thursday';
                    case 5: return 'Friday';
                    case 6: return 'Saturday';
                }
            },
            sortBookingsFor(date, location) {
                var matchedBookings = [];
                //sort though all bookings and return the first 3 that are within the right block and not a desk
                for (var i = 0; i < this.bookings.length; i++) {
                    if (date.toJSON().slice(0, 10) == this.bookings[i].date.slice(0, 10) && location.id == this.bookings[i].locationID && location.type == 'room')
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
            getBookingCount(date, location) {
                var count = 0;
                for (var i = 0; i < this.bookings.length; i++) {
                    if (date.toJSON().slice(0, 10) == this.bookings[i].date.slice(0, 10) && location.id == this.bookings[i].locationID)
                        count++;
                }
                return count;
            },
            styleBookingCount(date, location) {
                var count = 0;
                for (var i = 0; i < this.bookings.length; i++) {
                    if (date.toJSON().slice(0, 10) == this.bookings[i].date.slice(0, 10) && location.id == this.bookings[i].locationID)
                        count++;
                }
                if (count == 0)
                    return 'visibility: hidden;';
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
                    return 'width: calc(98% - 90px);';
            },

            /* Data Update */
            checkBookingsLoop() {
                var THIS = this;
                this.checkBookingsTimeout = setTimeout(function() {
                    THIS.bookingsDelay = 5000;
                    var startDate = THIS.week[0].toJSON().slice(0, 10);
                    var endDate = THIS.week[THIS.week.length-1].toJSON().slice(0, 10);
                    var refDate = THIS.week[0];
                    api.getBookingsDate(startDate, endDate).then(bookingsResult => {
                        if (refDate != THIS.week[0])
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

            addBookingClicked(date, location) {
                this.$parent.closeModals();
                this.$parent.$refs.BookingModal.openModal(date, location, '12:00', '12:00');
            },

            viewBookings(date, location) {
                var matchedBookings = [];
                //sort though all bookings and return the first 3 that are within the right day
                for (var i = 0; i < this.bookings.length; i++) {
                    if (date.toJSON().slice(0, 10) == this.bookings[i].date.slice(0, 10) && location.id == this.bookings[i].locationID)
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
            //console.log('beforeMount');
            this.getWeek(new Date());
        },
        mounted() {
            //console.log('mounted');
            //Start check booking loop
            this.checkBookingsLoop();
            //Start page scroll listener
            window.addEventListener('scroll', this.handlePageScroll);
        },
        beforeDestroy() {
            //console.log('beforeDestroy');
            //End check booking loop
            clearTimeout(this.checkBookingsTimeout);
            //End page scroll listener
            window.removeEventListener('scroll', this.handlePageScroll);
        }
    }
</script>
