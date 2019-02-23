<template>
    <div class="DailyViewCalendar"> 

        <!-- Container for date selector -->
        <div class="dateSelector">
            <button id="dateSelectorPreviousBtn" class="btn backBtn" type="button" @click="decDate()"></button>
            <input id="dateSelectorDate" class="date" :value="date.getMonth()+1+'/'+date.getDate()+'/'+date.getFullYear()" disabled>
            <button id="dateSelectorCalendar" class="btn calendarBtn" type="button"></button>
            <button id="dateSelectorPreviousBtn" class="btn forwardBtn" type="button" @click="incDate()"></button>
        </div>

        <!-- Calendar -->
        <div class="calendar" id='calendar'>

            <!-- Rooms -->
            <div class="roomCol">
                <div class="roomContainer" v-for="room in rooms" :key="'room'+room.id" :id="'room'+room.id" :style='styleDeskItem(room)'>
                    <div class="room">
                        <div class="text">{{room.name}}</div>
                    </div>
                </div>
            </div>

            <!-- Inner Scrollable Section -->
            <div class="innerSection" id='innerSection' @scroll='handleInnerSectionScroll()'>
                
                <!-- Hours -->
                <div class="topRow" id='topRow'>
                    <div class="hourContainer" v-for="hour in hours" :key="'hour'+hour.id" :id="'hour'+hour.id">
                        <div class="hour">
                            <div class="text">{{hour.time}}</div>
                        </div>
                    </div>
                </div>
                <div class="calendarRow"></div>

                <!-- Time Slots -->
                <div class="calendarRow" v-for="room in rooms.slice(1, rooms.length)" :key="'room'+room.id" :id="'room'+room.id" :style='styleDeskItem(room)'>
                    <!-- Booking Blocks -->
                    <div class="booking" v-for="booking in bookings" :key="'booking'+booking.id" :id="'booking'+booking.id" :style='styleBooking(room.id, booking)' @click='bookingClicked(booking)'>
                        <div v-if="room.type == 'room'" class="title">{{booking.title}}</div>
                        <div v-if="room.type == 'room'" class="name">{{booking.firstName + " " + booking.lastName}}</div>
                        <div v-if="room.type == 'desk'" class="centerText">{{booking.firstName + " " + booking.lastName}}</div>
                    </div>
                    <!-- Time Slots -->
                    <div class="timeChunk" v-for="hour in hours" :key="'timeChunk'+hour.id" :id="'timeChunk'+hour.id">
                        <div
                            class="timeSlot" v-for="index in 12" :key="'timeSlot'+room.id+':'+(hour.id*12+index)" 
                            :id="'timeSlot'+room.id+':'+(hour.id*12+index)" :style='styleTimeSlot((hour.id*12+index))'
                            @click="timeSlotClicked('timeSlot'+room.id+':'+(hour.id*12+index))"
                            @mouseenter="timeSlotHover('timeSlot'+room.id+':'+(hour.id*12+index), true)"
                            @mouseleave="timeSlotHover('timeSlot'+room.id+':'+(hour.id*12+index), false)">
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
    @import "css/DailyViewCalendar.css";
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
                //Date for calender
                date: new Date(),

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

                //hour include: id, time
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

                //List of returned bookings
                bookings: [],

                //Interval to check the server for bookings
                checkBookingsTimeout: null,
                bookingDelays: 0,

                //A timeout function that runs every min
                timeHighlighterTimeout: null,
                timeHighlighterDelay: 0,

                //Time slot hover highlighting
                previousTimeSlotColor: ''
            }
        },

        methods: {
            /* Date Function */
            decDate: function() {
                this.date = new Date(this.date.setDate(this.date.getDate() - 1));
                this.bookings = [];
                clearTimeout(this.checkBookingsTimeout);
                this.bookingsDelay = 0;
                this.checkBookingsLoop();
            },
            incDate: function() {
                this.date = new Date(this.date.setDate(this.date.getDate() + 1));
                this.bookings = [];
                clearTimeout(this.checkBookingsTimeout);
                this.bookingsDelay = 0;
                this.checkBookingsLoop();
            },

            /* JavaScript Styling */
            styleTimeSlot(timeSlot) {
                var style = '';

                style = style + 'background-color: white;';

                if (timeSlot%3 == 0)
                    style = style + 'border-right: 1px black solid;';

                return style;
            },
            styleTimeHighlighterLoop() {
                var THIS = this;
                this.timeHighlighterTimeout = setTimeout(function() {
                    THIS.timeHighlighterDelay = (60 - new Date().getSeconds()) * 1000;

                    var currentHour = parseInt(new Date().getHours());
                    var currentMin = parseInt(new Date().getMinutes());
                    for (var row = 1; row < THIS.rooms.length; row++) {
                        for (var timeSlot = 1; timeSlot <= THIS.hours.length*12; timeSlot++) {
                            var timeSlotHour = parseInt((timeSlot-1)/12, 10) + parseInt(THIS.hours[0].time.substring(0, THIS.hours[0].time.length - 2));
                            var timeSlotMin = (timeSlot-1) % 12 * 5;
                            
                            if (timeSlotHour == currentHour) {
                                if (currentMin >= 0 && currentMin < 15 && timeSlotMin >= 0 && timeSlotMin < 15)
                                    document.getElementById('timeSlot'+row+':'+timeSlot).style.backgroundColor = 'Gainsboro';
                                else if (currentMin >= 15 && currentMin < 30 && timeSlotMin >= 15 && timeSlotMin < 30)
                                    document.getElementById('timeSlot'+row+':'+timeSlot).style.backgroundColor = 'Gainsboro';
                                else if (currentMin >= 30 && currentMin < 45 && timeSlotMin >= 30 && timeSlotMin < 45)
                                    document.getElementById('timeSlot'+row+':'+timeSlot).style.backgroundColor = 'Gainsboro';
                                else if (currentMin >= 45 && currentMin < 60 && timeSlotMin >= 45 && timeSlotMin < 60)
                                    document.getElementById('timeSlot'+row+':'+timeSlot).style.backgroundColor = 'Gainsboro';
                                else
                                    document.getElementById('timeSlot'+row+':'+timeSlot).style.backgroundColor = 'white';
                            }
                        }
                    }

                    THIS.styleTimeHighlighterLoop();
                }, this.timeHighlighterDelay)
            },
            styleDeskItem(room) {
                var style = '';
                if (room.type == 'room' && this.rooms[(room.id+1)].type == 'desk')
                    style = style + 'margin-bottom: 20px;';
                else if (room.type == 'desk')
                    style = style + 'height: 30px;';
                
                return style;
            },
            styleBooking(roomID, booking) {
                var style = '';

                if (booking.locationID == roomID) {
                    var startTime = booking.startTime;
                    var startTimeHour = parseInt(startTime.split(':')[0], 10);
                    var startTimeMin = parseInt(startTime.split(':')[1], 10);
                    var startTimeSlot = ((startTimeHour - this.hours[0].time.substring(0, this.hours[0].time.length - 2)) * 12) + (startTimeMin / 5) + 1;
                    
                    var endTime = booking.endTime;
                    var endTimeHour = parseInt(endTime.split(':')[0], 10);
                    var endTimeMin = parseInt(endTime.split(':')[1], 10);
                    var endTimeSlot = ((endTimeHour - this.hours[0].time.substring(0, this.hours[0].time.length - 2)) * 12) + (endTimeMin / 5) + 1;

                    /*  
                    Left is tricky because getting the bounds is not relative to inside the row getting the left value of the 
                    first slot and subtractiing it from the used slot solves this problem
                    */
                    var left = document.getElementById('timeSlot'+roomID+':'+startTimeSlot).getBoundingClientRect().left - document.getElementById('timeSlot'+roomID+':'+1).getBoundingClientRect().left;
                    var width = (endTimeSlot - startTimeSlot) * document.getElementById('timeSlot'+roomID+':'+startTimeSlot).getBoundingClientRect().width;
                    var height = 60;
                    if (this.rooms[roomID].type == 'desk')
                        height = 30;

                    style = style + 'left:'+left+'px; width:'+width+'px; height:'+height+'px; background-color:'+booking.bookingColor+';';
                }
                else
                    style = style + 'left: 0px; width: 0px; height: 0px; display: none;';

                return style;
            },

            /* Data Update */
            checkBookingsLoop() {
                var THIS = this;
                this.checkBookingsTimeout = setTimeout(function() {
                    THIS.bookingsDelay = 5000;
                    var checkDate = THIS.date.getMonth()+1+'/'+ THIS.date.getDate()+'/'+ THIS.date.getFullYear();
                    api.getBookings(checkDate).then(bookingsResult => {
                        THIS.bookings = bookingsResult;
                        THIS.checkBookingsLoop();
                    });
                }, this.bookingsDelay)
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
            
            timeSlotHover(id, mouseOverTimeSlot) {
                if (mouseOverTimeSlot) {
                    this.previousTimeSlotColor = document.getElementById(id).style.backgroundColor;
                    document.getElementById(id).style.backgroundColor = 'silver';
                }
                else
                    document.getElementById(id).style.backgroundColor = this.previousTimeSlotColor;
            },
            timeSlotClicked(id) {
                //parse id
                var input = id.slice(8);
                input = input.split(':');

                if (this.rooms[input[0]].type == 'room')
                    this.$refs.BookingRoomModal.openModal(this.date, input, this.rooms[input[0]].name, this.rooms[input[0]].type);
                else if (this.rooms[input[0]].type == 'desk')
                    this.$refs.BookingDeskModal.openModal(this.date, input, this.rooms[input[0]].name, this.rooms[input[0]].type);
            },

            bookingClicked(booking) {
                this.$refs.BookedRoomModal.openModal(booking);
            }
        },

        mounted() {
            //console.log('mounted');
            //Start check booking loop
            this.checkBookingsLoop();
            //Start time highlighter loop
            this.styleTimeHighlighterLoop();
            //Start page scroll listener
            window.addEventListener('scroll', this.handlePageScroll);
        },
        beforeDestroy() {
            //console.log('beforeDestroy');
            //End check booking loop
            clearTimeout(this.checkBookingsTimeout);
            //End time highlighter loop
            clearTimeout(this.timeHighlighterTimeout);
            //Start page scroll listener
            window.removeEventListener('scroll', this.handlePageScroll);
        }
    }
</script>
