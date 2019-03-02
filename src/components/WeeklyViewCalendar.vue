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

            <!-- Rooms -->
            <div class="roomCol">
                <div class="firstRoomPlaceHolder"></div>
                <div class="roomContainer" v-for="room in rooms" :key="'room'+room.id" :id="'room'+room.id" :style='styleDeskElements(room)'>
                    <div class="room">
                        <div class="text">{{room.name}}</div>
                    </div>
                </div>
            </div>

            <!-- Inner Scrollable Section -->
            <div class="innerSection" id='innerSection' @scroll='handleInnerSectionScroll()'>
                
                <!-- Days -->
                <div class="topRow" id='topRow'>
                    <div class="dayContainer" v-for="(day, index) in week" :key="'day'+index" :id="'day'+index">
                        <div class="day">
                            <div class="date">{{day.getMonth()+1 + ' / ' + day.getDate()}}</div>
                            <div class="dayOfTheWeek">{{getDayOfTheWeek(day)}}</div>
                        </div>
                    </div>
                </div>

                <!-- Calendar Rows -->
                <div class="firstRowPlaceHolder"></div>
                <div class="calendarRow" v-for="room in rooms" :key="'room'+room.id" :id="'room'+room.id" :style='styleDeskElements(room)'>
                    <!-- Calendar Blocks -->
                    <div class="block" v-for="(day, index) in week" :key="'block'+room.id+':'+index" :id="'block'+room.id+':'+index" :style='styleCurrentDay(day)'>
                        <!-- Buttons -->
                        <div class="searchIcon" :style='styleBookingCount(day, room)' @click='viewBookings(day, room)'></div>
                        <div class="searchText" :style='styleBookingCount(day, room)' @click='viewBookings(day, room)'>
                            {{getBookingCount(day, room) + ' total'}}
                        </div>
                        <button class="addBtn" @click="addBookingClicked(day, room)"></button>
                        <!-- Bookings -->
                        <div class="booking" v-for="booking in sortBookingsFor(day, room)" :key="'booking'+booking.id" :id="'booking'+booking.id" @click='viewBookings(day, room)'>
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

        <!-- Modals -->
        <BookingRoomModal ref="BookingRoomModal"></BookingRoomModal>

        <BookingDeskModal ref="BookingDeskModal"></BookingDeskModal>

        <BookedDayModal ref="BookedDayModal"></BookedDayModal>
        
    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "css/WeeklyViewCalendar.css";
</style>

<script>
    import * as api from '@/services/api_access';

    import BookingRoomModal from '@/components/BookingRoomModal.vue';

    import BookingDeskModal from '@/components/BookingDeskModal.vue';

    import BookedDayModal from '@/components/BookedDayModal.vue';

    export default {
        components: {
            BookingRoomModal,

            BookingDeskModal,

            BookedDayModal
        },

        data() {
            return {
                //Week for the calendar
                week: [],

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
            styleDeskElements(room) {
                if (room.type == 'room' && this.rooms[(room.id+1)].type == 'desk')
                    return 'margin-bottom: 20px;';
                if (room.type == 'desk')
                    return 'height: 26px;';
            },
            styleCurrentDay(day) {
                if (new Date().toJSON().slice(0, 10) == day.toJSON().slice(0, 10))
                    return 'background-color: Gainsboro;';
                else
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
                    case 6: return 'Saterday';
                }
            },
            styleBookingCount(date, room) {
                var count = 0;
                for (var i = 0; i < this.bookings.length; i++) {
                    if (date.toJSON().slice(0, 10) == this.bookings[i].date.slice(0, 10) && room.id == this.bookings[i].locationID)
                        count++;
                }
                if (count == 0)
                    return 'visibility: hidden;';
            },
            sortBookingsFor(date, room) {
                var matchedBookings = [];
                //sort though all bookings and return the first 3 that are within the right block and not a desk
                for (var i = 0; i < this.bookings.length; i++) {
                    if (date.toJSON().slice(0, 10) == this.bookings[i].date.slice(0, 10) && room.id == this.bookings[i].locationID && room.type == 'room')
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
            getBookingCount(date, room) {
                var count = 0;
                for (var i = 0; i < this.bookings.length; i++) {
                    if (date.toJSON().slice(0, 10) == this.bookings[i].date.slice(0, 10) && room.id == this.bookings[i].locationID)
                        count++;
                }
                return count;
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

            /* Data Update */
            checkBookingsLoop() {
                var THIS = this;
                this.checkBookingsTimeout = setTimeout(function() {
                    THIS.bookingsDelay = 5000;
                    var startDate = THIS.week[0].toJSON().slice(0, 10);
                    var endDate = THIS.week[THIS.week.length-1].toJSON().slice(0, 10);
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

            addBookingClicked(date, room) {
                if (room.type == 'room')
                    this.$refs.BookingRoomModal.openModal(date, room, '12:00', '12:00');
                else if (room.type == 'desk')
                    this.$refs.BookingDeskModal.openModal(date, room, '12:00', '12:00');
            },

            viewBookings(date, room) {
                var matchedBookings = [];
                //sort though all bookings and return the first 3 that are within the right day
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
                this.$refs.BookedDayModal.openModal(matchedBookings);
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
