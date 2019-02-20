<template>
    <div class="DailyViewCalendar"> 
        <!-- Container for date selector -->
        <div class="dateSelector">
            <button id="dateSelectorPreviousBtn" class="btn backBtn" type="button" @click="decDate()"></button>
            <input id="dateSelectorDate" class="date" :value="date.getMonth()+1+'/'+date.getDate()+'/'+date.getFullYear()" disabled>
            <button id="dateSelectorCalendar" class="btn calendarBtn" type="button"></button>
            <button id="dateSelectorPreviousBtn" class="btn forwardBtn" type="button" @click="incDate()"></button>
        </div>

        <div class="calendar" id='calendar'>
            <!-- Time Slots -->
            <!-- Rename to hours -->
            <div class="hour" v-for="hour in this.hours" :key="'hour'+hour.id" :id="'hour'+hour.id">
                <div class="text">{{hour.time}}</div>
            </div>

            <!-- Rooms -->
            <div class="room" v-for="room in this.rooms" :key="'room'+room.id" :id="'room'+room.id" :style="{backgroundColor: room.style}">
                <div class="text">{{room.name}}</div>
            </div>

            <!-- Time Windows -->
            <div v-for="row in this.rooms.length" :key="'timeWindowRow'+row">
                <!-- 180 is this.hours.length * 12 (this can not be accessed by a div inside a div) -->
                <div class="timeWindow" v-for="index in 180"
                :key="'timeWindow'+index" :id="'timeWindow'+row+':'+index" 
                @click="timeWindowClicked('timeWindow'+row+':'+index)"
                ></div>
            </div>

            <!-- Bookings -->
            <div class="booking" v-for="booking in this.bookings" :key="'booking'+booking.id" :id="'booking'+booking.id" 
            @mouseover="bookingHover('booking'+booking.id)" data-booked='0'>
                <div v-if="booking.locationType == 'room'" class="titleText">{{booking.title}}</div>
                <div v-if="booking.locationType == 'room'" class="byText">{{"By: " + booking.firstName + " " + booking.lastName}}</div>
                
                <div v-if="booking.locationType == 'desk'" class="deskText">{{booking.firstName + " " + booking.lastName}}</div>
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
                //date for calender
                date: new Date(),

                //hour include: id, location[x,y], time
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
                hourWidth: 0,
                hourHeight: 60,

                //rooms include: id, name, type, style
                rooms: [
                    {id: 0, name: '',                               type: 'room', style: 'black'},
                    {id: 1, name: 'DaVinci Room',                   type: 'room', style: 'silver'},
                    {id: 2, name: 'Green Room',                     type: 'room', style: 'gray'},
                    {id: 3, name: 'Sunshine Room',                  type: 'room', style: 'silver'},
                    {id: 4, name: 'Zen Room',                       type: 'room', style: 'gray'},
                    {id: 5, name: 'Studio',                         type: 'room', style: 'silver'},
                    {id: 6, name: 'EPIC Room',                      type: 'room', style: 'gray'},
                    {id: 7, name: 'Carriage House Treatment Room',  type: 'room', style: 'silver'},
                    {id: 8, name: 'Buissness Hub',                  type: 'room', style: 'gray'},
                    {id: 9, name: 'Loft',                           type: 'room', style: 'silver'},
                    {id: 10, name: 'Porch',                         type: 'room', style: 'gray'},
                    {id: 11, name: 'Lawn',                          type: 'room', style: 'silver'},

                    {id: 12, name: 'Hot Desk', type: 'desk', style: 'gray'},
                    {id: 13, name: 'Hot Desk', type: 'desk', style: 'silver'},
                    {id: 14, name: 'Hot Desk', type: 'desk', style: 'gray'},
                    {id: 15, name: 'Hot Desk', type: 'desk', style: 'silver'},
                    {id: 16, name: 'Hot Desk', type: 'desk', style: 'gray'},
                    {id: 17, name: 'Hot Desk', type: 'desk', style: 'silver'},
                    {id: 18, name: 'Hot Desk', type: 'desk', style: 'gray'},
                    {id: 19, name: 'Hot Desk', type: 'desk', style: 'silver'},
                    {id: 20, name: 'Hot Desk', type: 'desk', style: 'gray'},
                    {id: 21, name: 'Hot Desk', type: 'desk', style: 'silver'},
                    {id: 22, name: 'Hot Desk', type: 'desk', style: 'gray'},
                    {id: 23, name: 'Hot Desk', type: 'desk', style: 'silver'},
                    {id: 24, name: 'Hot Desk', type: 'desk', style: 'gray'},
                    {id: 25, name: 'Hot Desk', type: 'desk', style: 'silver'},
                    {id: 26, name: 'Hot Desk', type: 'desk', style: 'gray'},
                ],
                roomWidth: 0,
                roomHeight: 60,

                //Booking info
                bookings: [],
                timeWindowWidth: 0,
                timeWindowHeight: 60,
                deskTimeWindowHeight: 30,

                //Var name of the setInterval updater
                checkInterval: null,
                renderInterval: null
            }
        },

        methods: {
            decDate: function() {
                this.date = new Date(this.date.setDate(this.date.getDate() - 1));
                this.checkBookings();
            },
            incDate: function() {
                this.date = new Date(this.date.setDate(this.date.getDate() + 1));
                this.checkBookings();
            },

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
                this.placeHours();
                //Render room squares in their locations
                this.placeRooms();
                //Place the windows of time
                this.placeTimeWindows();
                //Place the bookings returned from the database
                this.placeBookings();
            },

            initSize() {
                this.roomWidth = document.getElementById('calendar').offsetWidth * 0.13;
                this.hourWidth = (document.getElementById('calendar').offsetWidth - this.roomWidth) / this.hours.length;
                this.timeWindowWidth = this.hourWidth / 12;
            },

            placeHours() {
                for (var index = 0; index < this.hours.length; index++) {
                    document.getElementById('hour'+index).style.left = this.roomWidth + this.hourWidth * index + 'px';
                    document.getElementById('hour'+index).style.width = this.hourWidth + 'px';
                    document.getElementById('hour'+index).style.height = this.hourHeight + 'px';
                }
            },

            placeRooms() {
                for (var index = 0; index < this.rooms.length; index++) {
                    //Not hot Desk
                    if (this.rooms[index].type == 'room') {
                        document.getElementById('room'+index).style.top = this.roomHeight * index + 'px';
                        document.getElementById('room'+index).style.height = this.roomHeight + 'px';
                    }
                    //Hot Desk
                    else {
                        document.getElementById('room'+index).style.top = this.roomHeight * 6 + this.deskTimeWindowHeight * index + 'px';
                        document.getElementById('room'+index).style.height = this.deskTimeWindowHeight + 'px';
                    }
                    document.getElementById('room'+index).style.width = this.roomWidth + 'px';
                }
            },

            placeTimeWindows() {
                for (var row = 1; row < this.rooms.length; row++) {
                    for (var index = 1; index <= this.hours.length*12; index++) {
                        //1 squares per 5 min, 12 squares per 1 hour, 12 windows * 13 hours = 156
                        //Not hot desk
                        if (this.rooms[row].type == 'room') {                  
                            document.getElementById('timeWindow'+row+':'+index).style.top = 
                            this.hourHeight + this.roomHeight * (row-1) + 'px';
                            document.getElementById('timeWindow'+row+':'+index).style.height = this.roomHeight + 'px';
                        }
                        //Hot desk
                        else {
                            document.getElementById('timeWindow'+row+':'+index).style.top = 
                            this.roomHeight * 6 + this.deskTimeWindowHeight * row + 'px';
                            document.getElementById('timeWindow'+row+':'+index).style.height = this.deskTimeWindowHeight + 'px';
                        }

                        var timeWindowsPerHour = 12;    //12 per hour for 5 miniute sized windows (12*5 = 60)
                        document.getElementById('timeWindow'+row+':'+index).style.left = 
                            this.roomWidth + (this.hourWidth / timeWindowsPerHour) * (index-1) + 'px';
                        document.getElementById('timeWindow'+row+':'+index).style.width = this.timeWindowWidth + 'px';
                        if (index%3 == 0)
                            document.getElementById('timeWindow'+row+':'+index).style.borderRight = '1px black solid';
                    }
                }
            },

            checkBookings() {
                var checkDate = this.date.getMonth()+1+'/'+ this.date.getDate()+'/'+ this.date.getFullYear();
                api.getBookings(checkDate).then(bookingResult => {
                    this.bookings = bookingResult;
                })
            },
            placeBookings() {
                for (var bookingIndex = 0; bookingIndex < this.bookings.length; bookingIndex++) {
                    if (document.getElementById('booking'+this.bookings[bookingIndex].id) != null) {
                        var startTime = this.bookings[bookingIndex].startTime;
                        var startTimeHour = parseInt(startTime.split(':')[0], 10);
                        var startTimeMin = parseInt(startTime.split(':')[1], 10);
                        var startTimeWindow = ((startTimeHour - 7) * 12) + (startTimeMin / 5) + 1;  //7 refers to the earliest window of time availible

                        var endTime = this.bookings[bookingIndex].endTime;
                        var endTimeHour = parseInt(endTime.split(':')[0], 10);
                        var endTimeMin = parseInt(endTime.split(':')[1], 10);
                        var endTimeWindow = ((endTimeHour - 7) * 12) + (endTimeMin / 5);    //7 refers to the earliest window of time availible

                        var top = document.getElementById('timeWindow'+this.bookings[bookingIndex].locationID+':'+startTimeWindow).style.top;
                        var left = document.getElementById('timeWindow'+this.bookings[bookingIndex].locationID+':'+startTimeWindow).style.left;
                        var numberOfTimeWindows = endTimeWindow - startTimeWindow + 1;
                        
                        document.getElementById('booking'+this.bookings[bookingIndex].id).style.top = parseInt(top) + 'px';
                        document.getElementById('booking'+this.bookings[bookingIndex].id).style.left = parseInt(left) + 'px';
                        document.getElementById('booking'+this.bookings[bookingIndex].id).style.width = 
                        this.timeWindowWidth * numberOfTimeWindows + 'px';

                        if (this.bookings[bookingIndex].locationType == 'room')
                            document.getElementById('booking'+this.bookings[bookingIndex].id).style.height = this.timeWindowHeight + 'px';
                        else if (this.bookings[bookingIndex].locationType == 'desk')
                            document.getElementById('booking'+this.bookings[bookingIndex].id).style.height = this.deskTimeWindowHeight + 'px';

                        document.getElementById('booking'+this.bookings[bookingIndex].id).style.backgroundColor = this.bookings[bookingIndex].bookingColor;

                        document.getElementById('booking'+this.bookings[bookingIndex].id).setAttribute('data-booked', JSON.stringify(this.bookings[bookingIndex]));
                    }
                }
            },

            timeWindowClicked(id) {
                //parse id
                var input = id.slice(10);
                input = input.split(':');
                this.$refs.BookingModal.openModal(this.date, input, this.rooms[input[0]].name, this.rooms[input[0]].type);
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
            this.renderInterval = setInterval(this.placeBookings, 1000);
        },
        destroyed() {
            //Stop checking and rendering for bookings
            clearInterval(this.checkInterval);
            clearInterval(this.renderInterval);
        }
    }

</script>
