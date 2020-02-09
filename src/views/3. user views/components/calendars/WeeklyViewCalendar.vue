<template>
    <div class="WeeklyViewCalendar"> 

        <!-- Container for date selector -->
        <div class="container" style='margin-bottom: 10px'>
            <div class="row justify-content-center">
                <div class="col-2">
                    <button class="btn backBtn" type="button" @click="decWeek()"></button>
                </div>
                <div class="col-4" @click="$parent.$refs.DateSelector.openModal()">
                    <span class="dateSelectorDate">{{week[0].getMonth()+1+'/'+week[0].getDate()+'/'+week[0].getFullYear()}}</span>
                    <span class="hyphen">-</span>
                    <span class="dateSelectorDate">{{week[6].getMonth()+1+'/'+week[6].getDate()+'/'+week[6].getFullYear()}}</span>
                </div>
                <div class="col-2">
                    <button class="btn forwardBtn" type="button" @click="incWeek()"></button>
                </div>
            </div>
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
                        
                        <!-- Bookings -->
                        <div class="booking" v-for="booking in sortBookingsFor(day, location)" :key="'booking'+booking.id" @click='viewBookings(day, location)'>
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="timeBox col-5" :style='"background-color:"+location.color'>
                                        {{fillBookingStartTime(booking)}}
                                    </div>
                                    <div class="col-1" v-if='booking.noiseLevel !== 0'>
                                        <div class="icon" :style='booking.noiseLevel > 0 ? volume : booking.noiseLevel < 0 ? silent : null'></div>
                                    </div>
                                    
                                    <div :class="'textBox col-' + booking.noiseLevel === 0 ? 6 : 5">
                                        <div class="text">{{booking.username}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Buttons -->
                        <div class="searchIcon" :style='styleBookingCount(day, location)' @click='viewBookings(day, location)'></div>
                        <div class="searchText" :style='styleBookingCount(day, location)' @click='viewBookings(day, location)'>
                            {{getBookingCount(day, location) + ' total'}}
                        </div>
                        <button class="addBtn" @click="addBookingClicked(day, location)"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./css/WeeklyViewCalendar.css";
    .calendar {
        .booking {
            padding: 1%;
            cursor: pointer;
            .timeBox {
                padding: 0;
                position: relative;
                text-align: center;
                color: white;
            }
            .icon {
                position: absolute;
                left: 0;
                right: 0;
                margin: auto;
                width: 100%;
                height: 23px;
                text-decoration: none;
                background-size: 60%;
                background-repeat: no-repeat;
                background-position: center;
            }
            .text {
                position: absolute;
                text-align: left;
                width: 100%;
                padding: 0px 5px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
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

                volume: 'background-image: url('+require('../../../../assets/volumeOn-black.png')+');',
                silent: 'background-image: url('+require('../../../../assets/volumeOff-black.png')+');',
            }
        },

        methods: {
            /* Date Functions */
            getWeek() {
                let date = new Date(this.$parent.date);
                this.week[0] = new Date(date.setDate(date.getDate() - (date.getDay())));
                this.week[0].setHours(0, 0, 0, 0);
                var previous = new Date(this.week[0]);
                for (var i = 1; i < 7; i++) {
                    this.week[i] = new Date(previous.setDate(this.week[i-1].getDate() + 1));
                    this.week[i].setHours(0, 0, 0, 0);
                    previous = new Date(this.week[i]);
                }
                this.checkBookings();
            },
            decWeek: function() {
                this.$parent.date = new Date(this.week[0].setDate(this.week[0].getDate() - 1));
                this.getWeek();
            },
            incWeek: function() {
                this.$parent.date = new Date(this.week[this.week.length-1].setDate(this.week[this.week.length-1].getDate() + 1));
                this.getWeek();
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
                let yesterdayDate = new Date();
                yesterdayDate.setDate((new Date().getDate() - 1));
                let selectedDate = new Date(day);
                if (selectedDate.getTime() < yesterdayDate.getTime()) {
                    return 'background-color: Gainsboro;';
                }
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
                this.$parent.$refs.BookingModal.openBookingModal(date, location, '12:00', '12:00');
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
                    return booking1 - booking2;
                });
                this.$parent.closeModals();
                this.$parent.$refs.BookedDayModal.openModal(matchedBookings);
            }
        },
        
        beforeMount() {
            this.getWeek();
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
