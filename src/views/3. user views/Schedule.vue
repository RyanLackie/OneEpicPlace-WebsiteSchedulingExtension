<template>
    <div class="Schedule">

        <!-- Calendar Navbar -->
        <div class="viewSelector">
            <a class="viewText">Daily View</a>
            <a class="viewTextCenter">Weekly View</a>
            <a class="viewText">Monthly View</a>
        </div>

        <!-- Container for date selector -->
        <div class="dateSelector">
            <button id="dateSelectorPreviousBtn" class="btn backBtn" type="button" @click="decDate()"></button>
            <input id="dateSelectorDate" class="date" :value="date.getMonth()+1+'/'+date.getDate()+'/'+date.getFullYear()" disabled>
            <button id="dateSelectorCalendar" class="btn calendarBtn" type="button"></button>
            <button id="dateSelectorPreviousBtn" class="btn forwardBtn" type="button" @click="incDate()"></button>
        </div>

        <!-- Calendar -->
        <div class="calendar" id='calendar'>
            <!-- Time Slots -->
            <div class="timeSlot" v-for="timeSlot in this.timeSlots" :key="'timeSlot'+timeSlot.id" :id="'timeSlot'+timeSlot.id">
                <div class="text">{{timeSlot.time}}</div>
            </div>

            <!-- Rooms -->
            <div class="room" v-for="room in this.rooms" :key="'room'+room.id" :id="'room'+room.id">
                <div class="text">{{room.name}}</div>
            </div>

            <!-- Time Windows -->
            <div v-for="row in this.rooms.length" :key="'timeWindowRow'+row">
                <div class="timeWindow" v-for="index in 156" 
                :key="'timeWindow'+index" :id="'timeWindow'+row+':'+index" 
                @click="timeWindowClicked('timeWindow'+row+':'+index)"
                @mouseover="timeWindowHover('timeWindow'+row+':'+index)"
                @mouseout="timeWindowUnhover('timeWindow'+row+':'+index)"
                data-booked="0"></div>
            </div>
        </div>

        <BookingModal ref="BookingModal"></BookingModal>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "css/Schedule.css";
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
                    {id: 0, time: '9AM'},
                    {id: 1, time: '10AM'},
                    {id: 2, time: '11AM'},
                    {id: 3, time: '12PM'},
                    {id: 4, time: '1PM'},
                    {id: 5, time: '2PM'},
                    {id: 6, time: '3PM'},
                    {id: 7, time: '4PM'},
                    {id: 8, time: '5PM'},
                    {id: 9, time: '6PM'},
                    {id: 10, time: '7PM'},
                    {id: 11, time: '8PM'},
                    {id: 12, time: '9PM'}
                ],
                timeSlotSquareWidth: 0,
                timeSlotSquareHeight: 60,

                //rooms include: id, name
                rooms: [
                    {id: 0, name: 'Nothing'},
                    {id: 1, name: 'DaVinci Room'},
                    {id: 2, name: 'Green Room'},
                    {id: 3, name: 'Sunshine Room'},
                    {id: 4, name: 'Zen Room'},
                    {id: 5, name: 'Studio'},
                    {id: 6, name: 'Loft'},
                    {id: 7, name: 'Porch'},
                    {id: 8, name: 'Lawn'},
                ],
                roomSquareWidth: 0,
                roomSquareHeight: 60,

                bookings: [],

                //Var name of the setInterval updater
                interval: null
            }
        },

        methods: {
            initCalendar() {
                //Check the schedule for booked rooms
                this.resizeCalendar();
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

                    var roomName = this.rooms[index].name;
                    if (roomName == 'Nothing')
                        document.getElementById('room'+index).classList.add('Nothing');
                    else if (roomName == 'DaVinci Room')
                        document.getElementById('room'+index).classList.add('DaVinci');
                    else if (roomName == 'Green Room')
                        document.getElementById('room'+index).classList.add('Green');
                    else if (roomName == 'Sunshine Room')
                        document.getElementById('room'+index).classList.add('Sunshine');
                    else if (roomName == 'Zen Room')
                        document.getElementById('room'+index).classList.add('Zen');
                    else if (roomName == 'Studio')
                        document.getElementById('room'+index).classList.add('Studio');
                    else if (roomName == 'Loft')
                        document.getElementById('room'+index).classList.add('Loft');
                    else if (roomName == 'Porch')
                        document.getElementById('room'+index).classList.add('Porch');
                    else if (roomName == 'Lawn')
                        document.getElementById('room'+index).classList.add('Lawn');
                }
            },

            placeTimeWindows() {
                for (var row = 1; row < this.rooms.length; row++) {
                    for (var index = 1; index <= 156; index++) {
                        //1 squares per 5 min, 12 squares per 1 hour, 156 squares per 13 hours
                        var timeWindowsPerHour = 156 / 13;  //156 windows of time to cover 13 hours
                        
                        document.getElementById('timeWindow'+row+':'+index).style.top = 
                        this.timeSlotSquareHeight + this.roomSquareHeight * (row-1) + 'px';

                        document.getElementById('timeWindow'+row+':'+index).style.left = 
                        this.roomSquareWidth + (this.timeSlotSquareWidth / timeWindowsPerHour) * (index-1) + 'px';

                        document.getElementById('timeWindow'+row+':'+index).style.width = 
                        this.timeSlotSquareWidth / timeWindowsPerHour + 'px';

                        document.getElementById('timeWindow'+row+':'+index).style.height = 
                        this.roomSquareHeight + 'px';
                    }
                }
            },

            checkBookings() {
                api.getBookings().then(bookingResult => {
                    this.bookings = bookingResult;
                    //Add data values to the time windows that are currently booked
                    this.addTimeWindowBookings();
                })
            },
            addTimeWindowBookings() {
                for (var resetRowIndex = 1; resetRowIndex <= this.rooms.length; resetRowIndex++) {
                    for (var resetColIndex = 1; resetColIndex <= 156; resetColIndex++) {
                        document.getElementById('timeWindow'+resetRowIndex+':'+resetColIndex).setAttribute('data-booked', '0');
                    }
                }
                
                for (var bookingIndex = 0; bookingIndex < this.bookings.length; bookingIndex++) {
                    var locationID = this.bookings[bookingIndex].locationID;

                    var startTime = this.bookings[bookingIndex].startTime;
                    var startTimeHour = parseInt(startTime.split(':')[0], 10);
                    var startTimeMin = parseInt(startTime.split(':')[1], 10);
                    var startTimeWindow = ((startTimeHour - 9) * 12) + (startTimeMin / 5) + 1;

                    var endTime = this.bookings[bookingIndex].endTime;
                    var endTimeHour = parseInt(endTime.split(':')[0], 10);
                    var endTimeMin = parseInt(endTime.split(':')[1], 10);
                    var endTimeWindow = ((endTimeHour - 9) * 12) + (endTimeMin / 5);
                   
                    for (var timeWindowIndex = startTimeWindow; timeWindowIndex <= endTimeWindow; timeWindowIndex++) {
                        document.getElementById('timeWindow'+locationID+':'+timeWindowIndex).setAttribute('data-booked', '1');
                        if (timeWindowIndex == endTimeWindow)
                            document.getElementById('timeWindow'+locationID+':'+timeWindowIndex).setAttribute('data-booked', '2');
                    }
                }

                //Add styles to the time windows based on booking info
                this.addTimeWindowStyles();
            },
            addTimeWindowStyles() {
                for (var row = 1; row < this.rooms.length; row++) {
                    for (var timeWindowIndex = 1; timeWindowIndex <= 156; timeWindowIndex++) {
                        if (timeWindowIndex%3 == 0)
                            document.getElementById('timeWindow'+row+':'+timeWindowIndex).style.borderRight = '1px black solid';
   
                        if (document.getElementById('timeWindow'+row+':'+timeWindowIndex).getAttribute('data-booked') == '0') {
                            document.getElementById('timeWindow'+row+':'+timeWindowIndex).style.backgroundColor = 'white';
                        }
                        else if (document.getElementById('timeWindow'+row+':'+timeWindowIndex).getAttribute('data-booked') == '1') {
                            document.getElementById('timeWindow'+row+':'+timeWindowIndex).style.borderRight = '0px black solid';
                            document.getElementById('timeWindow'+row+':'+timeWindowIndex).style.backgroundColor = 'red';
                        }
                        else if (document.getElementById('timeWindow'+row+':'+timeWindowIndex).getAttribute('data-booked') == '2') {
                            document.getElementById('timeWindow'+row+':'+timeWindowIndex).style.backgroundColor = 'red';
                        }
                    }
                }
            },

            timeWindowClicked(id) {
                //parse id
                var input = id.slice(10);
                input = input.split(':');
                this.$refs.BookingModal.openModal(this.date, input, this.rooms[input[0]].name);
            },
            timeWindowHover(id) {
                /*
                //parse id
                var input = id.slice(10);
                input = input.split(':');
                console.log(input);
                */
                if (document.getElementById(id).getAttribute('data-booked') == '0')
                    document.getElementById(id).style.backgroundColor = 'lightgray';
            },
            timeWindowUnhover(id) {
                if (document.getElementById(id).getAttribute('data-booked') == '0')
                    document.getElementById(id).style.backgroundColor = 'white';
            },

            decDate: function() {
                this.date = new Date(this.date.setDate(this.date.getDate() - 1));
                //this.checkBooking();
            },
            incDate: function() {
                this.date = new Date(this.date.setDate(this.date.getDate() + 1));
                //this.checkBooking();
            }
        },
        
        mounted() {
            //Create Calendar
            this.initCalendar();
            window.addEventListener('resize', this.resizeCalendar);
            this.interval = setInterval(this.checkBookings, 5000);
        },
        destroyed() {
            //Stop checking for bookings
            clearInterval(this.interval);
        }
    }

</script>
