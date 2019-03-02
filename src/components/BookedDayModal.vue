<template>
    <div class="BookedDayModal" id="BookedDayModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="text" id="BookedDayModal-Header">{{date}}</div>
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
                <div class="warningIcon" :style='styleWarningIcon(booking)'></div>
                <div class="title">{{booking.title}}</div>
            </div>
            <div class="line">
                <div class="name">{{booking.firstName + ' ' + booking.lastName}}</div>
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
                this.date = bookings[0].date.slice(0, 10).split('-');
                this.date = parseInt(this.date[1]) + '/' + this.date[2] + '/' + this.date[0];

                this.bookings = bookings;
                
                document.getElementById("BookedDayModal").style.opacity = "1.0";
                document.getElementById("BookedDayModal").style.visibility = "visible";
            },
            closeModal() {
                document.getElementById("BookedDayModal").style.opacity = "0.0";
                document.getElementById("BookedDayModal").style.visibility = "hidden";
            },

            getTime(time) {
                var time = [
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

            styleWarningIcon(booking) {
                if (booking.noiseLevel > 0)
                    return 'display: inline;';
            },
        }
    }
</script>
