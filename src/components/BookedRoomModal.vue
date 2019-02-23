<template>
    <div class="BookedRoomModal" id="BookedRoomModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="text" id="BookedRoomModal-Header"></div>
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <div class="inputSmLeft">
            <label class="sectionLabel">Booked By</label>
            <input type="text" class="form-control" id='BookedRoomModal-Name' :placeholder="booking.firstName + ' ' + booking.lastName">
        </div>
        
        <div class="inputSmRight">
            <label class="sectionLabel">Date</label>
            <input type="text" class="form-control" id='BookedRoomModal-Date' :placeholder='booking.date'>
        </div>
                
        <div class="inputLg">
            <label class="sectionLabel">Title</label>
            <input type="text" id="BookedRoomModal-Title" class="form-control" :placeholder='booking.title'>
        </div>

        <div class="inputLg">
            <label class="sectionLabel">Description</label>
            <textarea type="text" id="BookedRoomModal-Description" class="form-control" :placeholder='booking.description'></textarea>
        </div>

        <div class="inputSmLeft">
            <label class="sectionLabel">Start Time</label>
            <input type="time" min="7:00" max="22:00" step="300" id="BookedRoomModal-StartTime" class="form-control">
        </div>
        
        <div class="inputSmRight">
            <label class="sectionLabel">End Time</label>
            <input type="time" min="7:00" max="22:00" step="300" id="BookedRoomModal-EndTime" class="form-control">
        </div>

        <button class="btn btn-secondary closeBtn" type="button" @click="closeModal()">Close</button>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "css/BookedRoomModal.css";
</style>

<script>
    export default {
        data() {
            return {
                //Values are pre entered to avoid vue from saying the values are null
                booking: {firstName: '', lastName: '', date: '', title: '', description: ''}
            }
        },
        methods: {
            openModal(booking) {
                this.booking = booking;

                //Modal Title
                var locationName = this.$parent.rooms[booking.locationID].name;
                document.getElementById('BookedRoomModal-Header').innerHTML = locationName;

                //Time
                var startHour = parseInt(booking.startTime.split(':')[0]);
                var startMin = parseInt(booking.startTime.split(':')[1]);
                if (startHour < 10)
                    startHour = '0'+startHour;
                if (startMin < 10)
                    startMin = '0'+startMin;
                //console.log('start ' + startHour + ":" + startMin);
                document.getElementById('BookedRoomModal-StartTime').value = startHour + ":" + startMin;

                var endHour = parseInt(booking.endTime.split(':')[0]);
                var endMin = parseInt(booking.endTime.split(':')[1]);
                if (endHour < 10)
                    endHour = '0'+endHour;
                if (endMin < 10)
                    endMin = '0'+endMin;
                //console.log('end ' + endHour + ":" + endMin);
                document.getElementById('BookedRoomModal-EndTime').value = endHour + ":" + endMin;

                //Color
                //document.getElementById('BookedRoomModal').style.outline = '3px ' + booking.bookingColor + ' solid';
                
                document.getElementById("BookedRoomModal").style.opacity = "1.0";
                document.getElementById("BookedRoomModal").style.visibility = "visible";
            },
            closeModal() {
                document.getElementById("BookedRoomModal").style.opacity = "0.0";
                document.getElementById("BookedRoomModal").style.visibility = "hidden";
            }
        }
    }
</script>
