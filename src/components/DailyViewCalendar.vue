<template>
    <div class="DailyViewCalendar"> 
        <div class="calendar" id='calendar'>
            <!-- Time Slots -->
            <!-- Rename to hours -->
            <div class="timeSlot" v-for="timeSlot in this.timeSlots" :key="'timeSlot'+timeSlot.id" :id="'timeSlot'+timeSlot.id">
                <div class="text">{{timeSlot.time}}</div>
            </div>

            <!-- Rooms -->
            <div class="room" v-for="room in this.rooms" :key="'room'+room.id" :id="'room'+room.id" :style="{backgroundColor: room.style}">
                <div class="text">{{room.name}}</div>
            </div>

            <!-- Time Windows -->
            <div v-for="row in this.rooms.length" :key="'timeWindowRow'+row">
                <!-- 192 is this.timeSlots.length * 12 (this can not be accessed by a div inside a div) -->
                <div class="timeWindow" v-for="index in 192"
                :key="'timeWindow'+index" :id="'timeWindow'+row+':'+index" 
                @click="timeWindowClicked('timeWindow'+row+':'+index)"
                ></div>
            </div>

            <!-- Bookings -->
            <div class="booking" v-for="booking in this.bookings" :key="'booking'+booking.id" :id="'booking'+booking.id" 
            @mouseover="bookingHover('booking'+booking.id)" data-booked='0'>
                <div class="titleText" id="bookingText">{{booking.title}}</div>
                <div class="byText" id="bookingText">{{"By: " + booking.firstName + " " + booking.lastName}}</div>
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

    import BookingModal from '@/components/BookingModal.vue'

    export default {
        components: {
            BookingModal
        },

        data() {
            return {
                //date for calender
                date: new Date(),

                //timeSlots include: id, location[x,y], time
                timeSlots: [
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
                    {id: 15, time: '10PM'}
                ],
                timeSlotSquareWidth: 0,
                timeSlotSquareHeight: 60,

                //rooms include: id, name
                rooms: [
                    {id: 0, name: '', style: 'black'},
                    {id: 1, name: 'DaVinci Room', style: 'silver'},
                    {id: 2, name: 'Green Room', style: 'gray'},
                    {id: 3, name: 'Sunshine Room', style: 'silver'},
                    {id: 4, name: 'Zen Room', style: 'gray'},
                    {id: 5, name: 'Studio', style: 'silver'},
                    {id: 6, name: 'EPIC Room', style: 'gray'},
                    {id: 7, name: 'Carriage House', style: 'silver'},
                    {id: 8, name: 'Buissness Hub', style: 'gray'},
                    {id: 9, name: 'Loft', style: 'silver'},
                    {id: 10, name: 'Porch', style: 'gray'},
                    {id: 11, name: 'Lawn', style: 'silver'},
                    {id: 12, name: 'Hot Desks', style: 'gray'},
                ],
                roomSquareWidth: 0,
                roomSquareHeight: 60,

                //Booking info
                bookings: [],
                timeWindowWidth: 0,
                timeWindowHeight: 60,

                //Var name of the setInterval updater
                checkInterval: null,
                renderInterval: null
            }
        },

        methods: {
            initCalendar() {
                //Size the calendar for the device
                this.resizeCalendar();
                //Check the schedule for booked rooms and render them
                this.checkBookings();
            },
            resizeCalendar() {
                //Set the dimmentions of all objects
                this.initSize();
                //Render time slot squares in their locations
                this.placeTimeSlots();
                //Render room squares in their locations
                this.placeRooms();
                //Place the windows of time
                this.placeTimeWindows();
            },

            initSize() {
                this.roomSquareWidth = document.getElementById('calendar').offsetWidth * 0.13;
                this.timeSlotSquareWidth = (document.getElementById('calendar').offsetWidth - this.roomSquareWidth) / this.timeSlots.length;
                this.timeWindowWidth = this.timeSlotSquareWidth / 12;
            },

            placeTimeSlots() {
                for (var index = 0; index < this.timeSlots.length; index++) {
                    document.getElementById('timeSlot'+index).style.left = this.roomSquareWidth + this.timeSlotSquareWidth * index + 'px';
                    document.getElementById('timeSlot'+index).style.width = this.timeSlotSquareWidth + 'px';
                    document.getElementById('timeSlot'+index).style.height = this.timeSlotSquareHeight + 'px';
                }
            },

            placeRooms() {
                for (var index = 0; index < this.rooms.length; index++) {
                    document.getElementById('room'+index).style.top = this.roomSquareHeight * index + 'px';
                    document.getElementById('room'+index).style.width = this.roomSquareWidth + 'px';
                    document.getElementById('room'+index).style.height = this.roomSquareHeight + 'px';
                }
            },

            placeTimeWindows() {
                for (var row = 1; row < this.rooms.length; row++) {
                    for (var index = 1; index <= this.timeSlots.length*12; index++) {
                        //1 squares per 5 min, 12 squares per 1 hour, 12 windows * 13 hours = 156
                        var timeWindowsPerHour = 12;    //12 for 5 miniute sized windows
                        
                        document.getElementById('timeWindow'+row+':'+index).style.top = 
                        this.timeSlotSquareHeight + this.roomSquareHeight * (row-1) + 'px';

                        document.getElementById('timeWindow'+row+':'+index).style.left = 
                        this.roomSquareWidth + (this.timeSlotSquareWidth / timeWindowsPerHour) * (index-1) + 'px';

                        document.getElementById('timeWindow'+row+':'+index).style.width = 
                        this.timeWindowWidth + 'px';

                        document.getElementById('timeWindow'+row+':'+index).style.height = 
                        this.roomSquareHeight + 'px';

                        if (index%3 == 0)
                            document.getElementById('timeWindow'+row+':'+index).style.borderRight = '1px black solid';
                    }
                }
            },

            checkBookings() {
                var checkDate = this.date.getMonth()+1+'/'+ this.date.getDate()+'/'+ this.date.getFullYear();
                api.getBookings(checkDate).then(bookingResult => {
                    this.bookings = bookingResult;
                    this.renderBookings();
                })
            },
            renderBookings() {
                //fill data-booked
                for (var bookingIndex = 0; bookingIndex < this.bookings.length; bookingIndex++) {
                    var row = this.bookings[bookingIndex].locationID;

                    var startTime = this.bookings[bookingIndex].startTime;
                    var startTimeHour = parseInt(startTime.split(':')[0], 10);
                    var startTimeMin = parseInt(startTime.split(':')[1], 10);
                    var startTimeWindow = ((startTimeHour - 7) * 12) + (startTimeMin / 5) + 1;  //7 refers to the earliest window of time availible

                    var endTime = this.bookings[bookingIndex].endTime;
                    var endTimeHour = parseInt(endTime.split(':')[0], 10);
                    var endTimeMin = parseInt(endTime.split(':')[1], 10);
                    var endTimeWindow = ((endTimeHour - 7) * 12) + (endTimeMin / 5);    //7 refers to the earliest window of time availible

                    if (document.getElementById('booking'+this.bookings[bookingIndex].id) != null) {
                        var top = document.getElementById('timeWindow'+row+':'+startTimeWindow).style.top;
                        var left = document.getElementById('timeWindow'+row+':'+startTimeWindow).style.left;
                        var numberOfTimeSlots = endTimeWindow - startTimeWindow + 1;
                        
                        document.getElementById('booking'+this.bookings[bookingIndex].id).style.top = parseInt(top) + 'px';
                        document.getElementById('booking'+this.bookings[bookingIndex].id).style.left = parseInt(left) + 'px';
                        document.getElementById('booking'+this.bookings[bookingIndex].id).style.width = 
                        this.timeWindowWidth * numberOfTimeSlots + 'px';
                        document.getElementById('booking'+this.bookings[bookingIndex].id).style.height = this.timeWindowHeight + 'px';

                        document.getElementById('booking'+this.bookings[bookingIndex].id).style.backgroundColor = this.bookings[bookingIndex].bookingColor;

                        document.getElementById('booking'+this.bookings[bookingIndex].id).setAttribute('data-booked', JSON.stringify(this.bookings[bookingIndex]));
                    }
                }
            },

            timeWindowClicked(id) {
                //parse id
                var input = id.slice(10);
                input = input.split(':');
                this.$refs.BookingModal.openModal(this.date, input, this.rooms[input[0]].name);
            },

            bookingHover(id) {
                console.log(JSON.parse(document.getElementById(id).getAttribute('data-booked')));
            }
        },
        
        mounted() {
            //Create Calendar
            this.initCalendar();
            window.addEventListener('resize', this.resizeCalendar);
            //Booking loop
            this.checkInterval = setInterval(this.checkBookings, 5000);
            this.renderInterval = setInterval(this.renderBookings, 1000);
        },
        destroyed() {
            //Stop checking and rendering for bookings
            clearInterval(this.checkInterval);
            clearInterval(this.renderInterval);
        }
    }

</script>
