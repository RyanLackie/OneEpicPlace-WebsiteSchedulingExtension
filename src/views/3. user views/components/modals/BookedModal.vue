<template>
    <div class="PopUpModal BookedModal" id="BookedModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="text">View Booking</div>

            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <div class="leftContainer-sm">
            <div class="sectionLabel">User</div>

            <input v-if='getMemberLevel() !== 6' type="text" class="form-control" v-model="username" :disabled='true'>

            <select v-if='getMemberLevel() === 6' class="form-control" v-model="userID" required>
                <option v-for="user in $parent.users" :key='user.id' :value='user.id'>{{user.username}}</option>
            </select>
        </div>
        
        <div class="rightContainer-sm">
            <div class="sectionLabel">Date</div>
            <input type="date" class="form-control" v-model='date' :disabled='disableFields'>
        </div>

        <div class="label-sm">Location
            <span class="required">*</span>
        </div>
        <select class="form-control" v-model='locationID' :disabled='disableFields' required>
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
            <div class="label-sm">Title</div>
            <input type="text" class="input-box form-control" placeholder="Title of your booking..." v-model='title' :disabled='disableFields'>
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

        <div v-if='getMemberLevel() === 6' class="privacyContainer">
            <div class="label-sm">Canceled</div>
            <input class='checkbox' type="checkbox" v-model='canceled'>
        </div>


        <!-- Advanced Options -->            
        <button class="btn btn-outline-secondary advancedBtn" type="button" @click="showMore = !showMore">
            {{showMore ? 'Show More' : 'Show Less'}}
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

        </div>

        <button v-if='!disableFields' class="btn btn-success leftBtn" @click="updateBooking()">Update</button>
        <button v-if='getMemberLevel() === 6' class="btn btn-danger rightBtn" @click="removeBooking()">Delete</button>
        <button v-if='!disableFields && getMemberLevel() !== 6' class="btn btn-danger rightBtn"
        @click="() => {
            canceled = true;
            updateBooking();
        }">Cancel</button>
        
        <button v-if='disableFields' class="btn btn-secondary centerBtn" @click="closeModal()">Close</button>

    </div>
</template>

<style scoped lang="scss">
    
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
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
                canceled: null,
                originalCanceledStatus: null,

                showMore: false,

                disableFields: false,

                locationType: null,
            }
        },
        methods: {
            openModal(booking) {    
                // Data
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

                //Style Modal
                if (this.locationType === 'room') {
                    document.getElementById('BookedModal').style.height = 90+'%';
                    document.getElementById('BookedModal').style.maxHeight = 750+'px';
                }
                else {
                    document.getElementById('BookedModal').style.height = 90+'%';
                    document.getElementById('BookedModal').style.maxHeight = 515+'px';
                }

                //Scroll
                document.getElementById('BookedModal').scrollTo(0, 0);
                
                document.getElementById("BookedModal").style.opacity = "1.0";
                document.getElementById("BookedModal").style.visibility = "visible";
            },
            closeModal() {
                document.getElementById("BookedModal").style.opacity = "0.0";
                document.getElementById("BookedModal").style.visibility = "hidden";
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
                            let messageDate;

                            if (updateResponce[0] == '100') {
                                this.$parent.closeModals();
                                this.$parent.checkBookings();
                            }
                            
                            else if (updateResponce[0] == '404')
                                alert('You dont have permission to update this booking');
                            else if (updateResponce[0] == '405')
                                alert('Booking time must be within the time range (watch out for AM - PM)');
                            else if (updateResponce[0] == '406')
                                alert('Start Time must be before End Time');
                            else if (updateResponce[0] == '407')
                                alert('Time is not within a 5 minoute interval');
                            else if (updateResponce[0] == '408') {
                                messageDate = updateResponce[1].split('-');
                                alert('Time Overlap on ' + messageDate[1]+'/'+messageDate[2]+'/'+messageDate[0]);
                            }
                            else if (updateResponce[0] == '409') {
                                messageDate = updateResponce[1].split('-');
                                alert('A Silent Reservation Has Already Been Made On ' + messageDate[1]+'/'+messageDate[2]+'/'+messageDate[0] + ' During This Time');
                            }
                            else if (updateResponce[0] == '410') {
                                messageDate = updateResponce[1].split('-');
                                alert('A Loud Reservation Has Already Been Made On ' + messageDate[1]+'/'+messageDate[2]+'/'+messageDate[0] + ' During This Time');
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
                            if (removeResponce === 404) {
                                alert('You dont have permission to update this booking');
                            }
                            else {
                                this.$parent.closeModals();
                                this.$parent.checkBookings();
                            }
                        }
                    );
                }
            }
        }
    }
</script>
