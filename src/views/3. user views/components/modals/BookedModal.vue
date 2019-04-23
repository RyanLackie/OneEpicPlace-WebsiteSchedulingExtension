<template>
    <div class="BookedModal" id="BookedModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="text">Booking</div>

            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <div class="inputSmLeft">
            <label class="sectionLabel">Booked By</label>
            <input type="text" class="form-control" id='BookedModal-Name' :placeholder="booking.username" :disabled='inputDisabled()'>
        </div>
        
        <div class="inputSmRight">
            <label class="sectionLabel">Date</label>
            <input type="date" class="form-control" id='BookedModal-Date' :value='booking.date.slice(0, 10)' :disabled='inputDisabled()'>
        </div>

        <div class="inputLg">
            <label class="sectionLabel">Location</label>
            <select type="text" id="BookedModal-Location" class="form-control" :disabled='inputDisabled()'>
                <option v-for="option in $parent.locations" :key='option.id' :id="'option'+option.id" :value='option.id'>{{option.name}}</option>
            </select>
        </div>
                
        <div class="inputLg">
            <label class="sectionLabel">Title</label>
            <input type="text" id="BookedModal-Title" class="form-control" :placeholder='booking.title' :disabled='inputDisabled()'>
        </div>

        <div class="inputLg">
            <label class="sectionLabel">Description</label>
            <textarea type="text" id="BookedModal-Description" class="form-control" :placeholder='booking.description' :disabled='inputDisabled()'></textarea>
        </div>

        <div class="inputSmLeft">
            <label class="sectionLabel">Start Time</label>
            <input type="time" min="7:00" max="22:00" step="300" id="BookedModal-StartTime" class="form-control" :disabled='inputDisabled()'>
        </div>
        
        <div class="inputSmRight">
            <label class="sectionLabel">End Time</label>
            <input type="time" min="7:00" max="22:00" step="300" id="BookedModal-EndTime" class="form-control" :disabled='inputDisabled()'>
        </div>

        <div class="footerBtnContainer">
            <button v-if='!inputDisabled()' class="btn btn-danger deleateBtn" :style='styleButton()' @click="deleateBooking()">Deleate</button>
            <button class="btn btn-secondary cancelBtn" :style='styleButton()' @click="closeModal()">Close</button>
        </div>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "css/BookedModal.css";
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                //Values are pre entered to avoid error message
                booking: {username: '', date: '', title: '', description: ''}
            }
        },
        methods: {
            openModal(booking) {
                this.booking = booking;

                //Modal Location
                document.getElementById('BookingModal-Location').value = booking.locationID;
                
                //Time
                var startTime = [
                    parseInt(booking.startTime.split(':')[0]),
                    parseInt(booking.startTime.split(':')[1])
                ];
                if (startTime[0] < 10)
                    startTime[0] = '0'+startTime[0];
                if (startTime[1] < 10)
                    startTime[1] = '0'+startTime[1];
                document.getElementById('BookedModal-StartTime').value = startTime[0] + ":" + startTime[1];

                var endTime = [
                    parseInt(booking.endTime.split(':')[0]),
                    parseInt(booking.endTime.split(':')[1])
                ];
                if (endTime[0] < 10)
                    endTime[0] = '0'+endTime[0];
                if (endTime[1] < 10)
                    endTime[1] = '0'+endTime[1];
                document.getElementById('BookedModal-EndTime').value = endTime[0] + ":" + endTime[1];

                //Scroll
                document.getElementById('BookedModal').scrollTo(0, 0);
                
                document.getElementById("BookedModal").style.opacity = "1.0";
                document.getElementById("BookedModal").style.visibility = "visible";
            },
            closeModal() {
                document.getElementById("BookedModal").style.opacity = "0.0";
                document.getElementById("BookedModal").style.visibility = "hidden";
            },

            //This feature is not reforced by the server (For presentation only)
            deleateBooking() {
                var responce = confirm("Are you sure you want to delete booking - " + this.booking.title);
                if (responce) {
                    api.removeBooking(this.booking.id).then(
                        removeResponce => {
                            this.$parent.checkBookings();
                            this.closeModal();
                        }
                    );
                }
            },

            styleButton() {
                if (api.getLocalUser().privilege == 6)
                    return 'width: 48%';

                if (this.booking.date != '') {
                    var bookingDate = new Date(this.booking.date);
                    bookingDate.setHours(this.booking.startTime.split(':')[0], this.booking.startTime.split(':')[1]);
                    if (this.booking.userID != api.getLocalUser().id && (bookingDate - new Date())/(1000*60*60) > 22)
                        return 'width: 48%';
                    else
                        return 'width: 100%';
                }
            },
            inputDisabled() {
                //This feature is not reforced by the server (For presentation only)
                if (api.getLocalUser().privilege == 6)
                    return false;

                if (this.booking.date != '') {
                    var bookingDate = new Date(this.booking.date);
                    bookingDate.setHours(this.booking.startTime.split(':')[0], this.booking.startTime.split(':')[1]);
                    if (this.booking.userID != api.getLocalUser().id && (bookingDate - new Date())/(1000*60*60) > 22)
                        return false;
                    else
                        return true;
                }
            }
        }
    }
</script>
