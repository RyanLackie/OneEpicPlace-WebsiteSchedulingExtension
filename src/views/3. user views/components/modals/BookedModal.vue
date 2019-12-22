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

            <input type="text" class="form-control" id='BookedModal-User' :value="booking.username" :disabled='true' v-if='getMemberLevel() != 6'>

            <select id="BookedModal-User" class="form-control" v-if='getMemberLevel() == 6' required>
                <option v-for="user in $parent.users" :key='user.id' :id="'user'+user.id" :value='user.id'>{{user.username}}</option>
            </select>
        </div>
        
        <div class="rightContainer-sm">
            <div class="sectionLabel">Date</div>
            <input type="date" class="form-control" id='BookedModal-Date' :value='booking.date.slice(0, 10)' :disabled='inputDisabled()'>
        </div>

        <div class="label-sm">Location
            <span class="required">*</span>
        </div>
        <select id="BookedModal-Location" class="form-control" :disabled='inputDisabled()' required>
            <option v-for="location in $parent.locations" :key='location.id' :id="'loc'+location.id" :value='location.id'>{{location.name}}</option>
        </select>

        <div v-if='checkFormType() == "room"'>
            <div class="label-sm">Meeting Type
                <span class="required">*</span>
            </div>
            <select id="BookedModal-MeetingType" class="form-control" :disabled='inputDisabled()' required>
                <option v-for="type in $parent.types" :key='type.id' :value='type.id'>{{type.type}}</option>
            </select>
        </div>
            
        <div v-if='checkFormType() == "room"'>
            <div class="label-sm">Title</div>
            <input type="text" id="BookedModal-Title" class="input-box form-control" placeholder="Title of your booking..." :disabled='inputDisabled()' autofocus>
        </div>

        <div v-if='checkFormType() == "room"'>
            <div class="label-sm">Description</div>
            <textarea type="text" id="BookedModal-Description" class="input-box form-control" placeholder="Describe your booking..." :disabled='inputDisabled()'></textarea>
        </div>

        <div class="leftContainer-sm">
            <div class="label-sm">Start Time
                <span class="required">*</span>
            </div>
            <input type="time" min="7:00" max="22:00" step="300" id="BookedModal-StartTime" class="input-box form-control" :disabled='inputDisabled()' required>
        </div>
        
        <div class="rightContainer-sm">
            <div class="label-sm">End Time
                <span class="required">*</span>
            </div>
            <input type="time" min="7:00" max="22:00" step="300" id="BookedModal-EndTime" class="input-box form-control" :disabled='inputDisabled()' required>
        </div>
        
        <div class="sliderContainer" v-if='checkFormType() == "room"'>
            <div class="label-sm">Noise Level
                <span class="required">*</span>
            </div>
            <div class="value" id="BookedModal-NoiseValue">Quite</div>
            <input type="range" min="-1" max="1" value="0" class="slider" id="BookedModal-NoiseSlider" @input="getRangeValue()" :disabled='inputDisabled()'>
        </div>

        <div class="privacyContainer">
            <div class="label-sm">Private</div>
            <input class='checkbox' id='BookedModal-Privacy' type="checkbox" :disabled='inputDisabled()'>
        </div>


        <!-- Advanced Options -->            
        <button class="btn btn-outline-secondary advancedBtn" type="button" @click="changeOptions()">{{showMoreText}}</button>

        <div class='advancedOptions' id="BookedModal-AdvancedOptions">

            <div class="label-lg" style="margin-top: 10px;">Resources</div>
            <div class="resourceContainer">
                <div class="resource" v-for="resource in $parent.resources" :key='resource.id'>
                    <div class="checkboxLabel">{{resource.name}}</div>
                    <input type="checkbox" class="checkbox" :id="'res'+resource.id">
                </div>
            </div>

        </div>

        <button v-if='!inputDisabled()' class="btn btn-success leftBtn" @click="updateBooking()">Update</button>
        <button v-if='!inputDisabled()' class="btn btn-danger rightBtn" @click="removeBooking()">Delete</button>

        <button v-if='inputDisabled()' class="btn btn-secondary centerBtn" @click="closeModal()">Close</button>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                //Values are pre entered to avoid error message
                booking: {username: '', date: '', title: '', description: ''},

                showMoreText: 'Show More',
                showMore: false
            }
        },
        methods: {
            openModal(booking) {
                this.booking = booking;

                //Style Modal
                if (this.checkFormType() == 'room') {
                    document.getElementById('BookedModal').style.height = 90+'%';
                    document.getElementById('BookedModal').style.maxHeight = 750+'px';
                }
                else {
                    document.getElementById('BookedModal').style.height = 90+'%';
                    document.getElementById('BookedModal').style.maxHeight = 515+'px';
                }

                //Modal User
                document.getElementById('BookedModal-User').value = booking.userID;

                //Modal Location
                document.getElementById('BookedModal-Location').value = booking.locationID;

                //Modal Meeting Type
                if (document.getElementById('BookedModal-MeetingType'))
                    document.getElementById('BookedModal-MeetingType').value = booking.meetingType;

                //Modal Title
                if (document.getElementById('BookedModal-Title'))
                    document.getElementById('BookedModal-Title').value = booking.title;

                //Modal Description
                if (document.getElementById('BookedModal-Description'))
                    document.getElementById('BookedModal-Description').value = booking.description;
                
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
                
                //Noise Level
                if (document.getElementById('BookedModal-NoiseSlider') && document.getElementById('BookedModal-NoiseValue')) {
                    document.getElementById('BookedModal-NoiseSlider').value = booking.noiseLevel;
                    this.getRangeValue();
                }
                
                //Private
                if (booking.private)
                    document.getElementById('BookedModal-Privacy').checked = true;
                else
                    document.getElementById('BookedModal-Privacy').checked = false;

                //Advanced Options
                this.showMoreText = 'Show More';
                this.showMore = false;
                document.getElementById('BookedModal-AdvancedOptions').style.height = '0px';

                //Resources
                for (var i = 0; i < this.$parent.resources.length; i++) {
                    document.getElementById('res'+this.$parent.resources[i].id).checked = false;
                }
                var resources = this.booking.resourceID.split(',');
                if (resources != '0') {
                    for (var i = 0; i < resources.length; i++) {
                        document.getElementById('res'+resources[i]).checked = true;
                    }
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

            updateBooking() {
                var userID = document.getElementById('BookedModal-User').value;

                var locationID = document.getElementById('BookedModal-Location').value;
                
                var resourceID = '';
                for (var i = 0; i < this.$parent.resources.length; i++) {
                    if (document.getElementById('res'+this.$parent.resources[i].id) != null && document.getElementById('res'+this.$parent.resources[i].id).checked)
                        resourceID += this.$parent.resources[i].id + ',';
                }
                if (resourceID == '')
                    resourceID = '0';
                else
                    resourceID = resourceID.substring(0, resourceID.length - 1);

                var date = [document.getElementById('BookedModal-Date').value];

                var startTime = document.getElementById('BookedModal-StartTime').value;
                var endTime = document.getElementById('BookedModal-EndTime').value;

                var meetingType = -1;
                if (document.getElementById('BookedModal-MeetingType'))
                    meetingType = document.getElementById('BookedModal-MeetingType').value;
                
                var title = '';
                if (document.getElementById('BookedModal-Title'))
                    title = document.getElementById('BookedModal-Title').value;

                var description = '';
                if (document.getElementById('BookedModal-Description'))
                    description = document.getElementById('BookedModal-Description').value;
                
                var noiseLevel = 0;
                if (document.getElementById('BookedModal-NoiseSlider'))
                    noiseLevel = document.getElementById('BookedModal-NoiseSlider').value;

                var privacy = document.getElementById('BookedModal-Privacy').checked;
                if (privacy)
                    privacy = 1;
                else
                    privacy = 0;

                api.updateBooking(this.booking.id, userID, locationID, resourceID, date, startTime, endTime, meetingType, title, description, noiseLevel, privacy).then(
                    updateResponce => {
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
                            var messageDate = updateResponce[1].split('-');
                            alert('Time Overlap on ' + messageDate[1]+'/'+messageDate[2]+'/'+messageDate[0]);
                        }
                        else if (updateResponce[0] == '409') {
                            var messageDate = updateResponce[1].split('-');
                            alert('A Silent Reservation Has Already Been Made On ' + messageDate[1]+'/'+messageDate[2]+'/'+messageDate[0] + ' During This Time');
                        }
                        else if (updateResponce[0] == '410') {
                            var messageDate = updateResponce[1].split('-');
                            alert('A Loud Reservation Has Already Been Made On ' + messageDate[1]+'/'+messageDate[2]+'/'+messageDate[0] + ' During This Time');
                        }
                    }
                );
            },
            
            removeBooking() {
                var responce = confirm("Are you sure you want to delete this booking by - " + this.booking.username);
                if (responce) {
                    api.removeBooking(this.booking.id, this.booking.userID, this.booking.date, this.booking.startTime).then(
                        removeResponce => {
                            this.$parent.closeModals();
                            this.$parent.checkBookings();
                        }
                    );
                }
            },
            
            //BookedModal
            inputDisabled() {
                if (api.getLocalUser().memberLevel == 6)
                    return false;

                // Not 22 hours before booking
                if (this.booking.date != '' && this.booking.startTime != '') {
                    var bookingDate = new Date(this.booking.date);
                    bookingDate.setHours(this.booking.startTime.split(':')[0], this.booking.startTime.split(':')[1]);
                    if (this.booking.userID == api.getLocalUser().id && (bookingDate - new Date())/(1000*60*60) > 22)
                        return false;
                }

                return true;
            },
            
            getMemberLevel() {
                return api.getLocalUser().memberLevel;
            },

            //Modal
            checkFormType() {
                var type = '';
                for (var i = 0; i < this.$parent.locations.length; i++) {
                    if (this.booking.locationID == this.$parent.locations[i].id) {
                        type = this.$parent.locations[i].type;
                        return type;
                    }
                }
                return null;
            }, 

            getRangeValue() {
                if (document.getElementById('BookedModal-NoiseSlider').value == -1)
                    document.getElementById('BookedModal-NoiseValue').innerHTML = 'Requires Quiet';
                else if (document.getElementById('BookedModal-NoiseSlider').value == 0)
                    document.getElementById('BookedModal-NoiseValue').innerHTML = 'Quiet';
                else if (document.getElementById('BookedModal-NoiseSlider').value == 1)
                    document.getElementById('BookedModal-NoiseValue').innerHTML = 'Loud';
            },

            changeOptions() {
                this.showMore = !this.showMore;
                if (this.showMore) {
                    this.showMoreText = 'Show Less';
                    document.getElementById('BookedModal-AdvancedOptions').style.height = 'auto';
                }
                else {
                    this.showMoreText = 'Show More';
                    document.getElementById('BookedModal-AdvancedOptions').style.height = '0px';
                }
            }
        }
    }
</script>
