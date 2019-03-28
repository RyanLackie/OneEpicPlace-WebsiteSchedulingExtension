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

            <!-- locations -->
            <div class="locationCol">
                <div class="firstLocationPlaceHolder"></div>
                <div class="locationContainer" v-for="location in locations" :key="'locCon'+location.id" :style='styleDeskElements(location)'>
                    <div class="location">
                        <div class="text">{{location.name}}</div>
                    </div>
                </div>
            </div>

            <!-- Inner Scrollable Section -->
            <div class="innerSection" id='innerSection' @scroll='handleInnerSectionScroll()'>
                
                <!-- Hours -->
                <div class="topRow" id='topRow'>
                    <div class="hourContainer" v-for="(hour, index) in hours" :key="'hour'+index">
                        <div class="hour">
                            <div class="text">{{hour.time}}</div>
                        </div>
                    </div>
                </div>
                <div class="calendarRow"></div>

                <!-- Calendar Rows -->
                <div class="calendarRow" v-for="(location, row) in locations" :key="'row'+row" :style='styleDeskElements(location)'>
                    <!-- Booking Blocks -->
                    <div class="booking" v-for="booking in bookings" :key="'booking'+booking.id" :style='styleBooking(location.id, booking)' @click='bookingClicked(booking)'>
                        <div v-if="location.type == 'room' && booking.noiseLevel != 0" class="icon" :style='styleIcon(booking)'></div>
                        <div v-if="location.type == 'room'" class="title" :style='styleTitle(booking)'>{{booking.title}}</div>
                        <div v-if="location.type == 'room'" class="name">{{booking.username}}</div>
                        <div v-if="location.type == 'desk'" class="centerText">{{booking.username}}</div>
                    </div>

                    <!-- Time Slots -->
                    <div class="timeChunk" v-for="(hour, col) in hours" :key="'tc'+col">
                        <div
                            v-for="slot in 12" :key="'ts'+row+':'+(col*12+slot)" :id="'timeSlot'+row+':'+(col*12+slot)" 
                            class="timeSlot" :style='styleTimeSlot((col*12+slot))'
                            @click="timeSlotClicked(location, 'timeSlot'+row+':'+(col*12+slot))"
                            @mouseenter="timeSlotHover('timeSlot'+row+':'+(col*12+slot), true)"
                            @mouseleave="timeSlotHover('timeSlot'+row+':'+(col*12+slot), false)">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./css/DailyViewCalendar.css";
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                //Date for calender
                date: null,

                //locations include: id, name, type
                locations: this.$parent.locations,
                //hours include: id, time
                hours: this.$parent.hours,

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
            /* Date Functions */
            getDate() {
                var date = new Date();
                date.setHours(0, 0, 0, 0);
                this.date = date;
            },
            decDate: function() {
                this.date = new Date(this.date.setDate(this.date.getDate() - 1));
                this.checkBookings();
            },
            incDate: function() {
                this.date = new Date(this.date.setDate(this.date.getDate() + 1));
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
                    return 'height: 30px;';
            },
            styleTimeSlot(timeSlot) {
                if (timeSlot%3 == 0)
                    return 'border-right: 1px black solid;';
            },
            styleTimeHighlighterLoop() {
                var THIS = this;
                this.timeHighlighterTimeout = setTimeout(function() {
                    THIS.timeHighlighterDelay = (60 - new Date().getSeconds()) * 1000;
                    
                    var currentHour = parseInt(new Date().getHours());
                    var currentMin = parseInt(new Date().getMinutes());
                    for (var row = 0; row < THIS.locations.length; row++) {
                        for (var timeSlot = 1; timeSlot <= THIS.hours.length*12; timeSlot++) {
                            var timeSlotHour = parseInt((timeSlot-1)/12, 10) + parseInt(THIS.hours[0].time.substring(0, THIS.hours[0].time.length - 2));
                            var timeSlotMin = (timeSlot-1) % 12 * 5;
                            
                            document.getElementById('timeSlot'+row+':'+timeSlot).style.backgroundColor = 'white';
                            
                            if (timeSlotHour == currentHour) {
                                if (currentMin >= 0 && currentMin < 15 && timeSlotMin >= 0 && timeSlotMin < 15)
                                    document.getElementById('timeSlot'+row+':'+timeSlot).style.backgroundColor = 'Gainsboro';
                                else if (currentMin >= 15 && currentMin < 30 && timeSlotMin >= 15 && timeSlotMin < 30)
                                    document.getElementById('timeSlot'+row+':'+timeSlot).style.backgroundColor = 'Gainsboro';
                                else if (currentMin >= 30 && currentMin < 45 && timeSlotMin >= 30 && timeSlotMin < 45)
                                    document.getElementById('timeSlot'+row+':'+timeSlot).style.backgroundColor = 'Gainsboro';
                                else if (currentMin >= 45 && currentMin < 60 && timeSlotMin >= 45 && timeSlotMin < 60)
                                    document.getElementById('timeSlot'+row+':'+timeSlot).style.backgroundColor = 'Gainsboro';
                            }
                        }
                    }
                    
                    THIS.styleTimeHighlighterLoop();
                }, this.timeHighlighterDelay)
            },
            styleBooking(locationID, booking) {
                if (locationID == booking.locationID) {
                    var startTime = booking.startTime;
                    var startTimeHour = parseInt(startTime.split(':')[0], 10);
                    var startTimeMin = parseInt(startTime.split(':')[1], 10);
                    var startTimeSlot = ((startTimeHour - this.hours[0].time.substring(0, this.hours[0].time.length - 2)) * 12) + (startTimeMin / 5) + 1;
                    
                    var endTime = booking.endTime;
                    var endTimeHour = parseInt(endTime.split(':')[0], 10);
                    var endTimeMin = parseInt(endTime.split(':')[1], 10);
                    var endTimeSlot = ((endTimeHour - this.hours[0].time.substring(0, this.hours[0].time.length - 2)) * 12) + (endTimeMin / 5) + 1;

                    /*  
                    Left is tricky because getting the bounds is not relative to inside the row, getting the left value of the 
                    first slot and subtractiing it from the used slot solves this problem
                    */
                    var left = document.getElementById('timeSlot'+locationID+':'+startTimeSlot).getBoundingClientRect().left - document.getElementById('timeSlot'+locationID+':'+1).getBoundingClientRect().left;
                    var width = (endTimeSlot - startTimeSlot) * document.getElementById('timeSlot'+locationID+':'+startTimeSlot).getBoundingClientRect().width;

                    return 'left:'+left+'px; width:'+width+'px;background-color:'+booking.bookingColor+';';
                }
                return 'left: 0px; width: 0px; height: 0px; display: none;';
            },
            styleIcon(booking) {
                var volumeOn = require('../../../../assets/volumeOn-white.png');
                var volumeOff = require('../../../../assets/volumeOff-white.png');
                if (booking.noiseLevel > 0)
                    return 'background-image: url('+volumeOn+');';
                else if (booking.noiseLevel < 0)
                    return 'background-image: url('+volumeOff+');';
            },
            styleTitle(booking) {
                if (booking.noiseLevel != 0)
                    return 'width: calc(100% - 27px);';
            },

            /* Data Update */
            checkBookingsLoop() {
                var THIS = this;
                this.checkBookingsTimeout = setTimeout(function() {
                    THIS.bookingsDelay = 5000;
                    var date = THIS.date.toJSON().slice(0, 10);
                    var refDate = THIS.date;
                    api.getBookingsDate(date, date).then(bookingsResult => {
                        if (refDate != THIS.date)
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
            
            timeSlotHover(id, mouseOverTimeSlot) {
                if (mouseOverTimeSlot) {
                    this.previousTimeSlotColor = document.getElementById(id).style.backgroundColor;
                    document.getElementById(id).style.backgroundColor = 'silver';
                }
                if (!mouseOverTimeSlot)
                    document.getElementById(id).style.backgroundColor = this.previousTimeSlotColor;
            },
            timeSlotClicked(location, id) {
                id = id.slice(8).split(':');
                var startTime = [
                    parseInt(((id[1]-1) / 12), 10) + parseInt(this.hours[0].time.substring(0, this.hours[0].time.length - 2)),
                    (id[1]-1) % 12 * 5
                ];
                var endTime = [
                    startTime[0],
                    startTime[1]
                ];

                if (startTime[1] == 55) {
                    endTime[0] += 1;
                    endTime[1] = 0;
                }
                else
                    endTime[1] += 5;

                if (startTime[0] < 10)
                    startTime[0] = '0'+startTime[0];
                if (startTime[1] < 10)
                    startTime[1] = '0'+startTime[1];
                if (endTime[0] < 10)
                    endTime[0] = '0'+endTime[0];
                if (endTime[1] < 10)
                    endTime[1] = '0'+endTime[1];
                
                this.$parent.closeModals();
                this.$parent.$refs.BookingModal.openModal(this.date, location, startTime[0]+':'+startTime[1], endTime[0]+':'+endTime[1]);
            },

            bookingClicked(booking) {
                this.$parent.closeModals();
                this.$parent.$refs.BookedModal.openModal(booking);
            }
        },
        
        beforeMount() {
            //console.log('beforeMount');
            this.getDate();
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
            //End page scroll listener
            window.removeEventListener('scroll', this.handlePageScroll);
        }
    }
</script>
