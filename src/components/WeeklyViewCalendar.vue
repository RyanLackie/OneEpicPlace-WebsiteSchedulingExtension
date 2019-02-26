<template>
    <div class="WeeklyViewCalendar"> 

        <!-- Container for date selector -->
        <div class="dateSelector">
            <button id="dateSelectorPreviousBtn" class="btn backBtn" type="button" @click="decDate()"></button>
            <input id="dateSelectorDate" class="date" :value="week[0].getMonth()+1+'/'+week[0].getDate()+'/'+week[0].getFullYear()" disabled>
            <div class="hyphen">-</div>
            <input id="dateSelectorDate" class="date" :value="week[6].getMonth()+1+'/'+week[6].getDate()+'/'+week[6].getFullYear()" disabled>
            <!--button id="dateSelectorCalendar" class="btn calendarBtn" type="button"></button-->
            <button id="dateSelectorPreviousBtn" class="btn forwardBtn" type="button" @click="incDate()"></button>
        </div>

        <!-- Calendar -->
        <div class="calendar" id='calendar'>

            <!-- Rooms -->
            <div class="roomCol">
                <div class="roomContainer" v-for="room in rooms" :key="'room'+room.id" :id="'room'+room.id" :style='styleFirstRow(room.id) + styleDeskElements(room)'>
                    <div class="room">
                        <div class="text">{{room.name}}</div>
                    </div>
                </div>
            </div>

            <!-- Inner Scrollable Section -->
            <div class="innerSection" id='innerSection' @scroll='handleInnerSectionScroll()'>
                
                <!-- Hours -->
                <div class="topRow" id='topRow'>
                    <div class="dayContainer" v-for="(day, index) in week" :key="'day'+index" :id="'day'+index">
                        <div class="day">
                            <div class="text">{{day.getMonth()+1 + ' / ' + day.getDate()}}</div>
                        </div>
                    </div>
                </div>
                <div class="calendarRow" :style="styleFirstRow(0)"></div>

                <!-- Calendar Rows -->
                <div class="calendarRow" v-for="room in rooms.slice(1, rooms.length)" :key="'room'+room.id" :id="'room'+room.id" :style='styleDeskElements(room)'>
                    <!-- Calendar Blocks -->
                    <div class="block" v-for="(day, index) in week" :key="'block'+room.id+':'+index" :id="'block'+room.id+':'+index" data-numberBooked='0'>
                        <!-- Buttons -->
                        <button class="searchBtn"></button>
                        <button class="addBtn"></button>
                        <!-- Bookings -->
                        <div class="booking" v-for="booking in bookings" :key="'booking'+booking.id" :id="'booking'+booking.id" 
                        :style='styleBooking(day, room.id, booking)'>
                            <div class="timeBox" :style='styleBookingColor(booking)' @click='bookingClicked(booking)'>
                                <div class="text">{{fillBookingStartTIme(booking)}}</div>
                            </div>
                            <div class="textBox">
                                <div class="text" @click='bookingClicked(booking)'>{{booking.title}}</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

        <!-- Modals -->
        <BookingRoomModal ref="BookingRoomModal"></BookingRoomModal>
        <BookedRoomModal ref="BookedRoomModal"></BookedRoomModal>

        <BookingDeskModal ref="BookingDeskModal"></BookingDeskModal>
        
    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "css/WeeklyViewCalendar.css";
</style>

<script>
    import * as api from '@/services/api_access';

    import BookingRoomModal from '@/components/BookingRoomModal.vue';
    import BookedRoomModal from '@/components/BookedRoomModal.vue';

    import BookingDeskModal from '@/components/BookingDeskModal.vue';

    export default {
        components: {
            BookingRoomModal,
            BookedRoomModal,

            BookingDeskModal
        },

        data() {
            return {
                //Week for the calendar
                week: [],

                //rooms include: id, name, type
                rooms: [
                    {id: 0, name: '',                               type: 'room'},
                    {id: 1, name: 'DaVinci Room',                   type: 'room'},
                    {id: 2, name: 'Green Room',                     type: 'room'},
                    {id: 3, name: 'Sunshine Room',                  type: 'room'},
                    {id: 4, name: 'Zen Room',                       type: 'room'},
                    {id: 5, name: 'Studio',                         type: 'room'},
                    {id: 6, name: 'EPIC Room',                      type: 'room'},
                    {id: 7, name: 'Carriage House Treatment Room',  type: 'room'},
                    {id: 8, name: 'Buissness Hub',                  type: 'room'},
                    {id: 9, name: 'Loft',                           type: 'room'},
                    {id: 10, name: 'Porch',                         type: 'room'},
                    {id: 11, name: 'Lawn',                          type: 'room'},

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
                    {id: 22, name: 'Hot Desk',                      type: 'desk'},
                    {id: 23, name: 'Hot Desk',                      type: 'desk'},
                    {id: 24, name: 'Hot Desk',                      type: 'desk'},
                    {id: 25, name: 'Hot Desk',                      type: 'desk'},
                    {id: 26, name: 'Hot Desk',                      type: 'desk'}
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
                
                this.week[1] = new Date(day.setDate(this.week[0].getDate() + 1));
                this.week[1].setHours(0, 0, 0, 0);

                this.week[2] = new Date(day.setDate(this.week[1].getDate() + 1));
                this.week[2].setHours(0, 0, 0, 0);

                this.week[3] = new Date(day.setDate(this.week[2].getDate() + 1));
                this.week[3].setHours(0, 0, 0, 0);

                this.week[4] = new Date(day.setDate(this.week[3].getDate() + 1));
                this.week[4].setHours(0, 0, 0, 0);

                this.week[5] = new Date(day.setDate(this.week[4].getDate() + 1));
                this.week[5].setHours(0, 0, 0, 0);

                this.week[6] = new Date(day.setDate(this.week[5].getDate() + 1));
                this.week[6].setHours(0, 0, 0, 0);
            },
            decDate: function() {
                this.getWeek(new Date(this.week[0].setDate(this.week[0].getDate() - 1)));
                this.checkBookings();
            },
            incDate: function() {
                this.getWeek(new Date(this.week[6].setDate(this.week[6].getDate() + 1)));
                this.checkBookings();
            },

            /* JavaScript Styling */
            styleFirstRow(roomID) {
                var style = '';

                if (roomID == 0)
                    style = style + 'height: 60px;';

                return style;
            },
            styleDeskElements(room) {
                var style = '';

                if (room.type == 'room' && this.rooms[(room.id+1)].type == 'desk')
                    style = style + 'margin-bottom: 20px;';
                if (room.type == 'desk')
                    style = style + 'height: 30px;';
                
                return style;
            },
            styleBooking(date, roomID, booking) {
                var style = '';

                if (date.toJSON().slice(0, 10) == booking.date.slice(0, 10) && roomID == booking.locationID)
                    style = style + '';
                else
                    style = style + 'left: 0px; width: 0px; height: 0px; display: none;';

                return style;
            },
            styleBookingColor(booking) {
                return 'background-color:'+booking.bookingColor+';'
            },
            fillBookingStartTIme(booking) {
                if (booking.startTime.split(':')[0] < 12)
                    return booking.startTime + ' am';
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
                    var endDate = THIS.week[6].toJSON().slice(0, 10);
                    api.getBookingsRange(startDate, endDate).then(bookingsResult => {
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
            handleInnerSectionScroll() {
                //Make sure calender y cant be changed
                document.getElementById('innerSection').scrollTop = 0;
            },

            bookingClicked(booking) {
                this.$refs.BookedRoomModal.openModal(booking);
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
        },
        beforeDestroy() {
            //console.log('beforeDestroy');
            clearTimeout(this.checkBookingsTimeout);
        }
    }
</script>
