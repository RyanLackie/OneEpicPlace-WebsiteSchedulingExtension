<template>
    <div class="DailyViewCalendar"> 

        <!-- Container for date selector -->
        <div class="container" style='margin-bottom: 10px'>
            <div class="row justify-content-center">
                <div class="col-2">
                    <button id="dateSelectorPreviousBtn" class="btn backBtn" type="button" @click="decDate()"></button>
                </div>
                <div class="col-4" @click="$parent.$refs.DateSelector.openModal()">
                    <span class="dateSelectorDate">
                        {{$parent.date.getMonth()+1+'/'+$parent.date.getDate()+'/'+$parent.date.getFullYear()}}
                    </span>
                </div>
                <div class="col-2">
                    <button id="dateSelectorPreviousBtn" class="btn forwardBtn" type="button" @click="incDate()"></button>
                </div>
            </div>
        </div>

        <!-- Calendar -->
        <div class="calendar" id='calendar'>

            <!-- locations -->
            <div class="locationCol">
                <div class="firstLocationPlaceHolder"></div>
                <div class="locationContainer" v-for="location in locations" :key="'locationContainer'+location.id" :style='styleDeskElements(location)'>
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
                    <div class="booking" v-for="booking in bookings" :key="'booking'+booking.id" 
                    :style='styleBooking(location, booking)' @click='bookingClicked(booking)'>
                        <div class="container-fluid">
                            <div v-if="location.type === 'room'" class="row">
                                <div class="title col-md-9">
                                    {{booking.title}}
                                </div>
                                <div class="noiseIcon col-md-2"
                                :style='booking.noiseLevel > 0 ? volume : booking.noiseLevel < 0 ? silent : null'></div>
                            </div>
                            <div v-if="location.type === 'room'" class="row">
                                <div class="name col-12">
                                    {{booking.username}}
                                </div>
                            </div>
                            <div v-if="location.type === 'desk'" class="row">
                                <div class="centerText col-12">
                                    {{booking.username}}
                                </div>
                            </div>
                        </div>
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
                previousTimeSlotColor: '',

                volume: 'background-image: url('+require('../../../../assets/volumeOn-white.png')+');',
                silent: 'background-image: url('+require('../../../../assets/volumeOff-white.png')+');',
            }
        },

        methods: {
            getDate() {
                this.checkBookings();
            },

            /* Date Functions */
            decDate() {
                let date = this.$parent.date;
                date = new Date(date.setDate(date.getDate() - 1));
                this.getDate();
            },
            incDate() {
                let date = this.$parent.date;
                date = new Date(date.setDate(date.getDate() + 1));
                this.getDate();
            },

            /* JavaScript Styling */
            styleDeskElements(location) {
                if (location.type === 'room') {
                    for (var i = 0; i < this.locations.length; i++) {
                        if (this.locations[i] == location && i+1 < this.locations.length && this.locations[i+1].type === 'desk')
                            return 'margin-bottom: 20px;';
                    }
                }
                else if (location.type === 'desk')
                    return 'height: 30px;';
            },
            styleTimeSlot(timeSlot) {
                let style = '';

                let currentDate = new Date();
                let selectedDate = new Date(this.$parent.date);
                selectedDate.setHours(
                    parseInt((timeSlot-1) / 12) + parseInt(this.hours[0].time.substring(0, this.hours[0].time.length - 2)),
                    (timeSlot-1) % 12 * 5,
                    0,
                    0
                );

                if (timeSlot % 3 === 0) {
                    style += 'border-right: 1px black solid;';
                }

                if (selectedDate.getTime() < currentDate.getTime()) {
                    style += 'background: Gainsboro;';
                    return style;
                }
               
                style += 'background: white;';
                return style;
            },

            styleBooking(location, booking) {
                if (location.id === booking.locationID) {
                    let startTime = booking.startTime;
                    let startTimeHour = parseInt(startTime.split(':')[0], 10);
                    let startTimeMin = parseInt(startTime.split(':')[1], 10);
                    let startTimeSlot = ((startTimeHour - this.hours[0].time.substring(0, this.hours[0].time.length - 2)) * 12) + (startTimeMin / 5) + 1;
                    
                    let endTime = booking.endTime;
                    let endTimeHour = parseInt(endTime.split(':')[0], 10);
                    let endTimeMin = parseInt(endTime.split(':')[1], 10);
                    let endTimeSlot = ((endTimeHour - this.hours[0].time.substring(0, this.hours[0].time.length - 2)) * 12) + (endTimeMin / 5) + 1;

                    /*  
                    Left is tricky because getting the bounds is not relative to inside the row, getting the left value of the 
                    first slot and subtractiing it from the used slot solves this problem
                    */
                    let left = document.getElementById('timeSlot'+location.id+':'+startTimeSlot).getBoundingClientRect().left - document.getElementById('timeSlot'+location.id+':'+1).getBoundingClientRect().left;
                    let width = (endTimeSlot - startTimeSlot) * document.getElementById('timeSlot'+location.id+':'+startTimeSlot).getBoundingClientRect().width;

                    let style = 'left:'+left+'px; width:'+width+'px;background-color:'+location.color+';';

                    if (booking.canceled) {
                        style += 'opacity: 0.5;';
                    }

                    return style;
                }
                return 'left: 0px; width: 0px; height: 0px; display: none;';
            },

            /* Data Update */
            checkBookingsLoop() {
                var THIS = this;
                this.checkBookingsTimeout = setTimeout(function() {
                    THIS.bookingsDelay = 5000;
                    var date = THIS.$parent.date.toJSON().slice(0, 10);
                    var refDate = THIS.$parent.date;
                    api.getBookingsDate(date, date).then(bookingsResult => {
                        if (refDate != THIS.$parent.date)
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
                this.$parent.$refs.BookingModal.openBookingModal(this.$parent.date, location, startTime[0]+':'+startTime[1], endTime[0]+':'+endTime[1]);
            },

            bookingClicked(booking) {
                this.$parent.closeModals();
                this.$parent.$refs.BookingModal.openBookedModal(booking);
            }
        },
        
        mounted() {
            this.getDate();
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
