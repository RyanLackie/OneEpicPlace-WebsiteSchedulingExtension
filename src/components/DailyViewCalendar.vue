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
        <div class="calendar">

            <!-- Rooms -->
            <div class="roomCol">
                <div class="roomContainer" v-for="room in rooms" :key="'room'+room.id" :id="'room'+room.id" :style='styleDeskItem(room)'>
                    <div class="room">
                        <div class="text">{{room.name}}</div>
                    </div>
                </div>
            </div>

            <!-- Inner Scrollable Section -->
            <div class="innerSection" id='innerSection' @scroll="handelInnerSectionScroll()">
                
                <!-- Hours -->
                <div class="topRow">
                    <div class="hourContainer" v-for="hour in hours" :key="'hour'+hour.id" :id="'hour'+hour.id">
                        <div class="hour">
                            <div class="text">{{hour.time}}</div>
                        </div>
                    </div>
                </div>
                <div class="calendarRow"></div> <!-- used to hold the spot for the hours row -->

                <!-- Time Slots -->
                <div class="calendarRow" v-for="room in rooms.slice(1, rooms.length)" :key="'room'+room.id" :id="'room'+room.id" :style='styleDeskItem(room)'>
                    <!-- Booking Blocks -->
                    <div class="booking" v-for="booking in bookings" :key="'booking'+booking.id" :id="'booking'+booking.id" :style='styleBooking(room.id, booking)'>
                        <div v-if="room.type == 'room'" class="title">{{booking.title}}</div>
                        <div v-if="room.type == 'room'" class="name">{{booking.firstName + " " + booking.lastName}}</div>
                        <div v-if="room.type == 'desk'" class="centerText">{{booking.firstName + " " + booking.lastName}}</div>
                    </div>
                    <!-- Time Slots -->
                    <div class="timeChunk" v-for="hour in hours" :key="'timeChunk'+hour.id" :id="'timeChunk'+hour.id">
                        <div
                            class="timeSlot" v-for="index in 12" :key="'timeSlot'+room.id+':'+(hour.id*12+index)" 
                            :id="'timeSlot'+room.id+':'+(hour.id*12+index)" :style='styleTimeSlot((hour.id*12+index))'
                            @click="timeSlotClicked('timeSlot'+room.id+':'+(hour.id*12+index))">
                        </div>
                    </div>
                </div>

            </div>

        </div>

        <BookingModal ref="BookingModal"></BookingModal>
        
    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "css/DailyViewCalendar.css";
</style>

<script>
    import * as api from '@/services/api_access';

    import BookingModal from '@/components/BookingModal.vue';

    export default {
        components: {
            BookingModal
        },

        data() {
            return {
                //Date for calender
                date: new Date(),

                //rooms include: id, name, type, style
                rooms: [
                    {id: 0, name: '',                               type: 'room', style: ''},
                    {id: 1, name: 'DaVinci Room',                   type: 'room', style: ''},
                    {id: 2, name: 'Green Room',                     type: 'room', style: ''},
                    {id: 3, name: 'Sunshine Room',                  type: 'room', style: ''},
                    {id: 4, name: 'Zen Room',                       type: 'room', style: ''},
                    {id: 5, name: 'Studio',                         type: 'room', style: ''},
                    {id: 6, name: 'EPIC Room',                      type: 'room', style: ''},
                    {id: 7, name: 'Carriage House Treatment Room',  type: 'room', style: ''},
                    {id: 8, name: 'Buissness Hub',                  type: 'room', style: ''},
                    {id: 9, name: 'Loft',                           type: 'room', style: ''},
                    {id: 10, name: 'Porch',                         type: 'room', style: ''},
                    {id: 11, name: 'Lawn',                          type: 'room', style: ''},

                    {id: 12, name: 'Hot Desk', type: 'desk', style: ''},
                    {id: 13, name: 'Hot Desk', type: 'desk', style: ''},
                    {id: 14, name: 'Hot Desk', type: 'desk', style: ''},
                    {id: 15, name: 'Hot Desk', type: 'desk', style: ''},
                    {id: 16, name: 'Hot Desk', type: 'desk', style: ''},
                    {id: 17, name: 'Hot Desk', type: 'desk', style: ''},
                    {id: 18, name: 'Hot Desk', type: 'desk', style: ''},
                    {id: 19, name: 'Hot Desk', type: 'desk', style: ''},
                    {id: 20, name: 'Hot Desk', type: 'desk', style: ''},
                    {id: 21, name: 'Hot Desk', type: 'desk', style: ''},
                    {id: 22, name: 'Hot Desk', type: 'desk', style: ''},
                    {id: 23, name: 'Hot Desk', type: 'desk', style: ''},
                    {id: 24, name: 'Hot Desk', type: 'desk', style: ''},
                    {id: 25, name: 'Hot Desk', type: 'desk', style: ''},
                    {id: 26, name: 'Hot Desk', type: 'desk', style: ''},
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
                    {id: 14, time: '9PM'},
                ],

                //List of returned bookings
                bookings: [],

                //Interval to check the server for bookings
                checkInterval: null,

                //Listener for scrolling the inner section
                scrollListener: null
            }
        },

        methods: {
            /* Date Function */
            decDate: function() {
                this.date = new Date(this.date.setDate(this.date.getDate() - 1));
                this.bookings = [];
                this.checkBookings();
            },
            incDate: function() {
                this.date = new Date(this.date.setDate(this.date.getDate() + 1));
                this.bookings = [];
                this.checkBookings();
            },

            /* JavaScript Styling */
            styleTimeSlot(timeSlot) {
                if (timeSlot%3 == 0)
                    return 'border-right: 1px black solid;'
            },
            styleDeskItem(room) {
                if (room.type == 'room' && this.rooms[(room.id+1)].type == 'desk')
                    return 'height: 60px; margin-bottom: 10px;'
                else if (room.type == 'desk')
                    return 'height: 30px;'
            },
            styleBooking(roomID, booking) {
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
                    Left is tricky because getting the bounds is not relative to inside the row
                    getting the left value of the first slot and subtractiing it from the used slot
                    solves this problem
                    */
                    var left = document.getElementById('timeSlot'+roomID+':'+startTimeSlot).getBoundingClientRect().left - document.getElementById('timeSlot'+roomID+':'+1).getBoundingClientRect().left;
                    var width = (endTimeSlot - startTimeSlot) * document.getElementById('timeSlot'+roomID+':'+startTimeSlot).getBoundingClientRect().width;

                    var height = 60;
                    if (this.rooms[roomID].type == 'desk')
                        height = 30;

                    return 'left:'+left+'px; width:'+width+'px; height:'+height+'px; background-color:'+booking.bookingColor+';'
                }
                return 'left: 0px; width: 0px; height: 0px; display: none'
            },

            /* Data Update */
            startCheckBookingLoop() {
                this.checkBookings();
                this.checkInterval = setInterval(this.checkBookings, 5000);
            },
            checkBookings() {
                var checkDate = this.date.getMonth()+1+'/'+ this.date.getDate()+'/'+ this.date.getFullYear();
                api.getBookings(checkDate).then(bookingResult => {
                    this.bookings = bookingResult;
                });
            },

            /* User Actions */
            timeSlotClicked(id) {
                //parse id
                var input = id.slice(8);
                input = input.split(':');
                this.$refs.BookingModal.openModal(this.date, input, this.rooms[input[0]].name, this.rooms[input[0]].type);
            },
            handelInnerSectionScroll() {
                document.getElementById('innerSection').scrollTop = 0;
            }
        },

        mounted() {
            this.startCheckBookingLoop();
        },
        beforeDestroy() {
            clearInterval(this.checkInterval);
        }
    }
</script>
