<template>
    <div class="BookedDayModal" id="BookedDayModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="text">Bookings</div>
            <div class="date" id='BookedDayModal-HeaderDate'></div>
            
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <div class="booking" v-for="booking in bookings" :key="'booking'+booking.id" :id="'booking'+booking.id">
            <div class="line">
                <div class="details">{{getTime(booking.startTime) + ' - ' + getTime(booking.endTime) + '  /  ' + booking.locationName}}</div>
            </div>
            <div class="line">
                <div class="color" :style='"background-color:"+booking.bookingColor+";"'></div>
                <div v-if='booking.noiseLevel != 0' class="icon" :style='styleIcon(booking)'></div>
                <div class="title">{{booking.title}}</div>
            </div>
            <div class="line">
                <div class="name">{{booking.username}}</div>
            </div>
            
        </div>

        <button class="btn btn-secondary closeBtn" type="button" @click="closeModal()">Close</button>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "css/BookedDayModal.css";
</style>

<script>
    export default {
        data() {
            return {
                date: new Date(),
                bookings: []
            }
        },
        methods: {
            openModal(bookings) {
                this.date = new Date(bookings[0].date);
                this.bookings = bookings;

                //Modal Header
                document.getElementById('BookedDayModal-HeaderDate').innerHTML = this.getDayOfTheWeek(this.date)+', '+this.getMonthName(this.date)+' '+this.date.getDate()+' '+this.date.getFullYear();

                //Scroll
                document.getElementById('BookedDayModal').scrollTo(0, 0);

                document.getElementById("BookedDayModal").style.opacity = "1.0";
                document.getElementById("BookedDayModal").style.visibility = "visible";
            },
            closeModal() {
                document.getElementById("BookedDayModal").style.opacity = "0.0";
                document.getElementById("BookedDayModal").style.visibility = "hidden";
            },

            getDayOfTheWeek(date) {
                switch(date.getDay()) {
                    case 0: return 'Sunday';
                    case 1: return 'Monday';
                    case 2: return 'Tuesday';
                    case 3: return 'Wednesday';
                    case 4: return 'Thursday';
                    case 5: return 'Friday';
                    case 6: return 'Saterday';
                }
            },
            getMonthName(date) {
                switch(date.getMonth()) {
                    case 0: return 'January';
                    case 1: return 'February';
                    case 2: return 'March';
                    case 3: return 'April';
                    case 4: return 'May';
                    case 5: return 'June';
                    case 6: return 'July';
                    case 7: return 'August';
                    case 8: return 'September';
                    case 9: return 'October';
                    case 10: return 'November';
                    case 11: return 'December';
                }
            },

            getTime(time) {
                time = [
                    parseInt(time.split(':')[0]),
                    parseInt(time.split(':')[1])
                ]
                var AMPM = '';
                if (time[0] < 12)
                    AMPM = 'am';
                else
                    AMPM = 'pm';
                if (time[0] > 12)
                    time[0] = time[0] - 12;

                if (time[1] < 10)
                    time[1] = '0'+time[1];
                
                return time[0] + ':' + time[1] + AMPM;
            },

            styleIcon(booking) {
                var volumeOn = require('../../../../assets/volumeOn-black.png');
                var volumeOff = require('../../../../assets/volumeOff-black.png');
                if (booking.noiseLevel > 0)
                    return 'background-image: url('+volumeOn+');';
                else if (booking.noiseLevel < 0)
                    return 'background-image: url('+volumeOff+');';
            },
        }
    }
</script>
