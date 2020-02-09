<template>
    <div class='PopUpModal BookingModal' :class="locationType === 'room' ? 'lg-booking-modal' : 'sm-booking-modal'" 
    id="BookingModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="text">Create Booking</div>
            <div class="date">{{getDayOfTheWeek(date)+', '+getMonthName(date)+' '+date.getDate()+' '+date.getFullYear()}}</div>
            
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="BookingModal-Form">

            <div class="label-sm">Location
                <span class="required">*</span>
            </div>
            <select class="form-control" v-model='locationID' required>
                <option v-for="location in $parent.locations" :key='location.id' :value='location.id'>
                    {{location.name}}
                </option>
            </select>

            <div v-if='locationType === "room"'>
                <div class="label-sm">Meeting Type
                    <span class="required">*</span>
                </div>
                <select class="form-control" v-model='meetingType' required>
                    <option v-for="type in $parent.types" :key='type.id' :value='type.id'>{{type.type}}</option>
                </select>
            </div>
                
            <div v-if='locationType === "room"'>
                <div class="label-sm">Title</div>
                <input type="text" class="input-box form-control" placeholder="Title of your booking..." v-model='title'>
            </div>

            <div v-if='locationType === "room"'>
                <div class="label-sm">Description</div>
                <textarea type="text" class="input-box form-control" placeholder="Describe your booking..." v-model='description'></textarea>
            </div>

            <div class="leftContainer-sm">
                <div class="label-sm">Start Time
                    <span class="required">*</span>
                </div>
                <input type="time" min="7:00" max="22:00" step="300" class="input-box form-control" v-model='startTime' required>
            </div>
            
            <div class="rightContainer-sm">
                <div class="label-sm">End Time
                    <span class="required">*</span>
                </div>
                <input type="time" min="7:00" max="22:00" step="300" class="input-box form-control" v-model='endTime' required>
            </div>
            
            <div class="sliderContainer" v-if='locationType === "room"'>
                <div class="label-sm">Noise Level
                    <span class="required">*</span>
                </div>
                <div class="value">
                    {{parseInt(noiseLevel) === -1 ? 'Requires Quiet' : parseInt(noiseLevel) === 0 ? 'Quiet' : parseInt(noiseLevel) === 1 ? 'Loud' : 'Error'}}
                </div>
                <input type="range" min="-1" max="1" value="0" class="slider" v-model="noiseLevel">
            </div>

            <div class="privacyContainer">
                <div class="label-sm">Private</div>
                <input class='checkbox' type="checkbox" v-model='privacy'>
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
                        v-on:input="toggleResource(resource.id)">
                    </div>
                </div>

                <div class="label-lg" style="margin-top: 10px;">Repeat Booking</div>
                <div class="dateSelector">
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

            <button class="btn btn-success leftBtn" type="submit">Submit</button>
            <button class="btn btn-secondary rightBtn" type="button" @click="closeModal()">Cancel</button>
        </form>

    </div>
</template>

<style scoped lang="scss">
    .sm-booking-modal {
        height: 90%;
        max-height: 490px;
    }
    .lg-booking-modal {
        height: 90%;
        max-height: 730px;
    }
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                locationType: null,

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

                showMore: false,
                
                selectedDates: [new Date()],
            }
        },

        methods: {
            openModal(date, location, startTime, endTime) {
                this.locationType = location.type;

                this.date = date;
                this.locationID = location.id;
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
            closeModal() {
                // Visibility
                document.getElementById("BookingModal").style.opacity = "0.0";
                document.getElementById("BookingModal").style.visibility = "hidden";
            },

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
            
            submitBooking(event) {
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
                        var messageDate;

                        if (bookingResult[0] == '100') {
                            this.closeModal();
                            this.$parent.checkBookings();
                        }
                        
                        else if (bookingResult[0] == '404')
                            alert('You dont have permission to make a booking');
                        else if (bookingResult[0] == '405')
                            alert('Booking time must be within the time range (watch out for AM - PM)');
                        else if (bookingResult[0] == '406')
                            alert('Start Time must be before End Time');
                        else if (bookingResult[0] == '407')
                            alert('Time is not within a 5 minoute interval');
                        
                        else if (bookingResult[0] == '408') {
                            messageDate = bookingResult[1].split('-');
                            alert('Time Overlap on ' + messageDate[1]+'/'+messageDate[2]+'/'+messageDate[0]);
                        }
                        else if (bookingResult[0] == '409') {
                            messageDate = bookingResult[1].split('-');
                            alert('A Silent Reservation Has Already Been Made On ' + messageDate[1]+'/'+messageDate[2]+'/'+messageDate[0] + ' During This Time');
                        }
                        else if (bookingResult[0] == '410') {
                            messageDate = bookingResult[1].split('-');
                            alert('A Loud Reservation Has Already Been Made On ' + messageDate[1]+'/'+messageDate[2]+'/'+messageDate[0] + ' During This Time');
                        }
                    }
                );
                
                // Prevent submit refresh
                event.preventDefault();
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

            //Calendar
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
        },

        mounted() {
            //Listen for modal submit
            document.getElementById('BookingModal-Form').addEventListener('submit', this.submitBooking);
        }
    }
</script>