<template>
    <div class='PopUpModal BookingModal' :style="locationType === 'room' ? 'max-height: 730px;' : 'max-height: 490px;'" 
    id="BookingModal" aria-hidden="true">
                
        <div v-if='modalType === "booking"' class="modal-header">
            <div class="text">Create Booking</div>
            <div class="date">{{getDayOfTheWeek(date)+', '+getMonthName(date)+' '+date.getDate()+' '+date.getFullYear()}}</div>
            
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <div v-if='modalType === "booked"' class="modal-header">
            <div class="text">View Booking</div>

            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <!-- Booked -->
        <div v-if='modalType === "booked"' class="leftContainer-sm">
            <div class="sectionLabel">User</div>

            <input v-if='getMemberLevel() !== 6' type="text" class="form-control" v-model="username" :disabled='true'>

            <select v-if='getMemberLevel() === 6' class="form-control" v-model="userID" required>
                <option v-for="user in $parent.users" :key='user.id' :value='user.id'>{{user.username}}</option>
            </select>
        </div>
        <div v-if='modalType === "booked"' class="rightContainer-sm">
            <div class="sectionLabel">Date</div>
            <input type="date" class="form-control" v-model='date' :disabled='disableFields'>
        </div>

        <!-- Shared -->
        <div class="label-sm">Location
            <span class="required">*</span>
        </div>
        <select class="form-control" v-model='locationID' :disabled='disableFields' required
        @change='changeLocationType()'>
            <option value='null' style='display: none'>Choose your room</option>
            <option v-for="location in $parent.locations" :key='location.id' :value='location.id'>
                {{location.name}}
            </option>
        </select>

        <div v-if='locationType === "room"'>
            <div class="label-sm">Meeting Type
                <span class="required">*</span>
            </div>
            <select class="form-control" v-model='meetingType' :disabled='disableFields' required>
                <option v-for="type in $parent.types" :key='type.id' :value='type.id'>{{type.type}}</option>
            </select>
        </div>
            
        <div v-if='locationType === "room"'>
            <div class="label-sm">Title
                <span class="required">*</span>
            </div>
            <input type="text" class="input-box form-control" placeholder="Title of your booking..." v-model='title' :disabled='disableFields' required>
        </div>

        <div v-if='locationType === "room"'>
            <div class="label-sm">Description</div>
            <textarea type="text" class="input-box form-control" placeholder="Describe your booking..." v-model='description' :disabled='disableFields'></textarea>
        </div>

        <div class="leftContainer-sm">
            <div class="label-sm">Start Time
                <span class="required">*</span>
            </div>
            <input type="time" min="7:00" max="22:00" step="300" class="input-box form-control" v-model='startTime' :disabled='disableFields' required>
        </div>
        
        <div class="rightContainer-sm">
            <div class="label-sm">End Time
                <span class="required">*</span>
            </div>
            <input type="time" min="7:00" max="22:00" step="300" class="input-box form-control" v-model='endTime' :disabled='disableFields' required>
        </div>
        
        <div class="sliderContainer" v-if='locationType === "room"'>
            <div class="label-sm">Noise Level
                <span class="required">*</span>
            </div>
            <div class="value">
                {{parseInt(noiseLevel) === -1 ? 'Requires Quiet' : parseInt(noiseLevel) === 0 ? 'Quiet' : parseInt(noiseLevel) === 1 ? 'Loud' : 'Error'}}
            </div>
            <input type="range" min="-1" max="1" value="0" class="slider" v-model="noiseLevel" :disabled='disableFields'>
        </div>

        <div class="privacyContainer">
            <div class="label-sm">Private</div>
            <input class='checkbox' type="checkbox" v-model='privacy' :disabled='disableFields'>
        </div>

        <!-- Booked -->
        <div v-if='modalType === "booked" && getMemberLevel() === 6' class="privacyContainer">
            <div class="label-sm">Canceled</div>
            <input class='checkbox' type="checkbox" v-model='canceled'>
        </div>

        <!-- Advanced Options -->
        <button class="btn btn-outline-secondary advancedBtn" type="button" @click="showMore = !showMore">
            {{showMore ? 'Show Less' : 'Show More'}}
        </button>

        <div class='advancedOptions' :style="showMore ? 'height: auto;' : 'height: 0px;'">

            <div class="label-lg" style="margin-top: 10px;">Resources</div>
            <div class="resourceContainer">
                <div class="resource" v-for="resource in $parent.resources" :key='resource.id'>
                    <div class="checkboxLabel">{{resource.name}}</div>
                    <input type="checkbox" class="checkbox"
                    :checked="resourceCheck(resource.id)"
                    v-on:input="toggleResource(resource.id)"
                    :disabled='disableFields'>
                </div>
            </div>

            <div v-if='modalType === "booking"' class="label-lg" style="margin-top: 10px;">Repeat Booking</div>
            <div v-if='modalType === "booking"' class="dateSelector">
                <div class="backBtn" @click="changeMonth(-1)"></div>
                <div class="date">{{getMonthName(date) + ' ' + date.getFullYear()}}</div>
                <div class="forwardBtn" @click="changeMonth(1)"></div>

                <div class="calendar">
                    <div class="daysOfWeek" v-for="day in 7" :key='"day"+day'>{{getDayOfWeek(day)}}</div>
                    <div class="day" v-for="date in getDaysInRange(date)" :key='"date"+date' :style="styleDate(date)" @click="addDate(date)">
                        {{date.getDate()}}
                    </div>
                </div>
            </div>

        </div>

        <!-- Booking -->
        <button v-if='modalType === "booking"' class="btn btn-success leftBtn" @click="submitBooking()">Submit</button>
        <button v-if='modalType === "booking"' class="btn btn-secondary rightBtn" @click="closeModal()">Cancel</button>

        <!-- Booked -->
        <button v-if='modalType === "booked" && !disableFields' class="btn btn-success leftBtn" @click="updateBooking()">Update</button>
        <button v-if='modalType === "booked" && getMemberLevel() === 6' class="btn btn-danger rightBtn" @click="removeBooking()">Delete</button>
        <button v-if='modalType === "booked" && !disableFields && getMemberLevel() !== 6' class="btn btn-danger rightBtn"
        @click="() => {
            canceled = true;
            updateBooking();
        }">Cancel</button>
        
        <button v-if='modalType === "booked" && disableFields' class="btn btn-secondary centerBtn" @click="closeModal()">Close</button>

    </div>
</template>


<style scoped lang="scss">

</style>


<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                modalType: null,

                locationType: null,

                // Booked
                bookingID: null,
                userID: null,
                username: null,

                date: new Date(),
                locationID: null,
                resourceID: [],
                meetingType: null,
                title: null,
                description: null,
                startTime: null,
                endTime: null,
                noiseLevel: null,
                privacy: null,

                // Booked
                canceled: null,
                originalCanceledStatus: null,
                disableFields: false,

                showMore: false,
                
                selectedDates: [new Date()],
            }
        },

        methods: {
            openBookingModal(date, location, startTime, endTime) {
                this.modalType = 'booking';

                if (location !== null) {
                    this.locationType = location.type;
                }
                else {
                    this.locationType = 'room';
                }

                this.date = date;
                if (location !== null) {
                    this.locationID = location.id;
                }
                else {
                    this.locationID = null;
                }
                this.resourceID = [];
                this.selectedDates = [date];
                this.meetingType = 0;
                this.title = '';
                this.description = '';
                this.startTime = startTime;
                this.endTime = endTime;
                this.noiseLevel = 0;
                this.privacy = false;

                this.showMore = false;

                // Scroll
                document.getElementById('BookingModal').scrollTo(0, 0);

                // Visibility
                document.getElementById("BookingModal").style.opacity = "1.0";
                document.getElementById("BookingModal").style.visibility = "visible";
            },
            submitBooking() {
                var locationID = this.locationID;
                var resourceID = this.resourceID;

                var date = [];
                for (var j = 0; j < this.selectedDates.length; j++) {
                    date[date.length] = this.selectedDates[j].toJSON().slice(0, 10);
                }

                var startTime = this.startTime;
                var endTime = this.endTime;
                var meetingType = this.meetingType;
                var title = this.title;
                var description = this.description;
                var noiseLevel = this.noiseLevel;
                var privacy = this.privacy;
                
                api.insertBooking(locationID, resourceID, date, startTime, endTime, meetingType, title, description, noiseLevel, privacy).then(
                    bookingResult => {
                        if (bookingResult.statusCode === 200) {
                            this.closeModal();
                            this.$parent.checkBookings();
                        }
                        else {
                            alert(bookingResult.message);
                        }
                    }
                );
            },

            openBookedModal(booking) {    
                this.modalType = 'booked';

                this.bookingID = booking.id;
                this.userID = booking.userID;
                this.username = booking.username;
                this.date = booking.date.slice(0, 10);
                this.locationID = booking.locationID;

                this.resourceID = []
                booking.resourceID = booking.resourceID.replace('[', '');
                booking.resourceID = booking.resourceID.replace(']', '');
                if (booking.resourceID.length > 0) {
                    booking.resourceID = booking.resourceID.split(',');
                    for (let i = 0; i < booking.resourceID.length; i++) {
                        let resource = parseInt(booking.resourceID[i]) 
                        this.resourceID.push(resource);
                    }
                }

                this.meetingType = booking.meetingType;
                this.title = booking.title;
                this.description = booking.description;

                this.startTime = [
                    parseInt(booking.startTime.split(':')[0]),
                    parseInt(booking.startTime.split(':')[1])
                ];
                if (this.startTime[0] < 10)
                    this.startTime[0] = '0'+this.startTime[0];
                if (this.startTime[1] < 10)
                    this.startTime[1] = '0'+this.startTime[1];
                this.startTime = this.startTime[0] + ":" + this.startTime[1];
                
                this.endTime = [
                    parseInt(booking.endTime.split(':')[0]),
                    parseInt(booking.endTime.split(':')[1])
                ];
                if (this.endTime[0] < 10)
                    this.endTime[0] = '0'+this.endTime[0];
                if (this.endTime[1] < 10)
                    this.endTime[1] = '0'+this.endTime[1];
                this.endTime = this.endTime[0] + ":" + this.endTime[1];

                this.noiseLevel = booking.noiseLevel;
                this.privacy = booking.private;
                this.canceled = booking.canceled;
                this.originalCanceledStatus = booking.canceled;
                this.showMore = false;

                // Are fields disabled
                if (api.getLocalUser().memberLevel == 6) {
                    this.disableFields = false;
                }
                // Can not edit if time is 22 hours before booking
                else {
                    var bookingDate = new Date(this.date);
                    bookingDate.setHours(this.startTime.split(':')[0], this.startTime.split(':')[1]);
                    if (this.userID === api.getLocalUser().id && (bookingDate - new Date())/(1000*60*60) > 22) {
                        this.disableFields = false;
                    }
                    else {
                        this.disableFields = true;
                    }
                }

                // Location type - What fields to show
                for (let i = 0; i < this.$parent.locations.length; i++) {
                    if (this.$parent.locations[i].id === booking.locationID) {
                        this.locationType = this.$parent.locations[i].type;
                        break;
                    }
                }

                // Style Modal
                if (this.locationType === 'room') {
                    document.getElementById('BookingModal').style.height = 90+'%';
                    document.getElementById('BookingModal').style.maxHeight = 750+'px';
                }
                else {
                    document.getElementById('BookingModal').style.height = 90+'%';
                    document.getElementById('BookingModal').style.maxHeight = 515+'px';
                }

                //Scroll
                document.getElementById('BookingModal').scrollTo(0, 0);
                
                document.getElementById("BookingModal").style.opacity = "1.0";
                document.getElementById("BookingModal").style.visibility = "visible";
            },
            updateBooking() {
                let bookingID = this.bookingID;
                let userID = this.userID;
                let locationID = this.locationID;
                let resourceID = this.resourceID;
                let date = [this.date];
                let startTime = this.startTime;
                let endTime = this.endTime;
                let meetingType = this.meetingType;
                let title = this.title
                let description = this.description;
                let noiseLevel = this.noiseLevel;
                let privacy = this.privacy;
                let canceled = this.canceled;
                let originalCanceledStatus = this.originalCanceledStatus;

                let responce = true;
                if (!originalCanceledStatus && canceled) {
                    responce = confirm("Are you sure you want to cancel this booking?");
                }
                if (responce) {
                    api.updateBooking(bookingID, userID, locationID, resourceID, date, startTime,
                    endTime, meetingType, title, description, noiseLevel, privacy, canceled).then(
                        updateResponce => {
                            if (updateResponce.statusCode === 200) {
                                this.$parent.closeModals();
                                this.$parent.checkBookings();
                            }
                            else {
                                alert(updateResponce.message);
                            }
                        }
                    );
                }
            },
            removeBooking() {
                let responce = confirm("Are you sure you want to delete this booking by - " + this.username);
                if (responce) {
                    api.removeBooking(this.bookingID, this.userID, this.date, this.startTime).then(
                        removeResponce => {
                            if (removeResponce.statusCode === 200) {
                                this.$parent.closeModals();
                                this.$parent.checkBookings();
                            }
                            else {
                                alert(removeResponce.message);
                            }
                        }
                    );
                }
            },

            closeModal() {
                // Visibility
                document.getElementById("BookingModal").style.opacity = "0.0";
                document.getElementById("BookingModal").style.visibility = "hidden";
            },

            getMemberLevel() { return api.getLocalUser().memberLevel; },

            resourceCheck(id) {
                for (var i = 0; i < this.resourceID.length; i++) {
                    if (this.resourceID[i] === id) {
                        return true;
                    }
                }
                return false;
            },
            toggleResource(id) {
                let removed = false;
                this.resourceID = this.resourceID.filter(function(indexedID) {
                    if (indexedID === id) {
                        removed = true;
                        return false;
                    }
                    return true;
                });
                if (!removed) {
                    this.resourceID.push(id);
                }
            },

            changeLocationType() {
                if (this.locationID !== null) {
                    for (let i = 0; i < this.$parent.locations.length; i++) {
                        if (this.$parent.locations[i].id === this.locationID) {
                            this.locationType = this.$parent.locations[i].type;
                            return;
                        }
                    }
                }
                else {
                    this.locationType = 'room';
                }
            },

            // Booking Modal
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

            // Calendar
            getDayOfWeek(day) {
                switch(day) {
                    case 1: return 'Su';
                    case 2: return 'M';
                    case 3: return 'T';
                    case 4: return 'W';
                    case 5: return 'Th';
                    case 6: return 'F';
                    case 7: return 'Sa';
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

            changeMonth(amt) {
                this.date = new Date(this.date.setMonth(this.date.getMonth()+amt));
                this.date = new Date(this.date.setDate(1));
            },
            getDaysInRange(date) {
                var days = [];
                var dateCopy = new Date(date);
                var startOfTheMonth = new Date(dateCopy.setDate(1));
                var weekDay = startOfTheMonth.getDay();
                var startOfCalendar = new Date(dateCopy.setDate(startOfTheMonth.getDate() - weekDay));
                
                for (var index = 0; index < 42; index++) {
                    var temp = new Date(dateCopy);
                    temp = new Date(temp.setDate(startOfCalendar.getDate() + index));
                    temp.setHours(0, 0, 0, 0);
                    days[days.length] = temp;
                }

                return days;
            },
            styleDate(date) {
                for (var i = 0; i < this.selectedDates.length; i++) {
                    if (this.selectedDates[i].getTime() == date.getTime())
                        return "background: indigo; color: white;";
                }
                if (date.getMonth() != this.date.getMonth())
                    return "background: gainsboro;";
                else if (date.getDate() == this.date.getDate())
                    return "background: blue;";
            },
            addDate(date) {
                var dateClone = new Date(date);
                dateClone.setHours(0, 0, 0, 0);
                for (var i = 0; i < this.selectedDates.length; i++) {
                    if (this.selectedDates[i].getTime() == date.getTime()) {
                        this.selectedDates.splice(i, 1);
                        return;
                    }
                }
                this.selectedDates.push(date);
            }
        }
    }
</script>