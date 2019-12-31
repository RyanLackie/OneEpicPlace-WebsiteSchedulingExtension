<template>
    <div class="PopUpModal BookingModal" id="BookingModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="text">Create Booking</div>
            <div class="date" id='BookingModal-HeaderDate'></div>
            
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="BookingModal-Form">

            <div class="label-sm">Location
                <span class="required">*</span>
            </div>
            <select id="BookingModal-Location" class="form-control" required>
                <option v-for="location in $parent.locations" :key='location.id' :id="'loc'+location.id" :value='location.id'>{{location.name}}</option>
            </select>

            <div v-if='checkFormType() == "room"'>
                <div class="label-sm">Meeting Type
                    <span class="required">*</span>
                </div>
                <select id="BookingModal-Type" class="form-control" required>
                    <option v-for="type in $parent.types" :key='type.id' :value='type.id'>{{type.type}}</option>
                </select>
            </div>
                
            <div v-if='checkFormType() == "room"'>
                <div class="label-sm">Title</div>
                <input type="text" id="BookingModal-Title" class="input-box form-control" placeholder="Title of your booking..." autofocus>
            </div>

            <div v-if='checkFormType() == "room"'>
                <div class="label-sm">Description</div>
                <textarea type="text" id="BookingModal-Description" class="input-box form-control" placeholder="Describe your booking..."></textarea>
            </div>

            <div class="leftContainer-sm">
                <div class="label-sm">Start Time
                    <span class="required">*</span>
                </div>
                <input type="time" min="7:00" max="22:00" step="300" id="BookingModal-StartTime" class="input-box form-control" required>
            </div>
            
            <div class="rightContainer-sm">
                <div class="label-sm">End Time
                    <span class="required">*</span>
                </div>
                <input type="time" min="7:00" max="22:00" step="300" id="BookingModal-EndTime" class="input-box form-control" required>
            </div>
            
            <div class="sliderContainer" v-if='checkFormType() == "room"'>
                <div class="label-sm">Noise Level
                    <span class="required">*</span>
                </div>
                <div class="value" id="BookingModal-NoiseValue">Quite</div>
                <input type="range" min="-1" max="1" value="0" class="slider" id="BookingModal-NoiseSlider" @input="getRangeValue()">
            </div>

            <div class="privacyContainer">
                <div class="label-sm">Private</div>
                <input class='checkbox' id='BookingModal-Privacy' type="checkbox">
            </div>


            <!-- Advanced Options -->            
            <button class="btn btn-outline-secondary advancedBtn" type="button" @click="changeOptions()">{{showMoreText}}</button>

            <div class='advancedOptions' id="BookingModal-AdvancedOptions">

                <div class="label-lg" style="margin-top: 10px;">Resources</div>
                <div class="resourceContainer">
                    <div class="resource" v-for="resource in $parent.resources" :key='resource.id'>
                        <div class="checkboxLabel">{{resource.name}}</div>
                        <input type="checkbox" class="checkbox" :id="'res'+resource.id">
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

</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                date: new Date(),
                location: null,
                selectedDates: [new Date()],

                showMoreText: 'Show More',
                showMore: false,     
            }
        },

        methods: {
            openModal(date, location, startTime, endTime) {
                this.date = date;
                this.location = location;
                this.selectedDates = [date];

                //Style Modal
                if (this.checkFormType() == 'room') {
                    document.getElementById('BookingModal').style.height = 90+'%';
                    document.getElementById('BookingModal').style.maxHeight = 730+'px';
                }
                else {
                    document.getElementById('BookingModal').style.height = 90+'%';
                    document.getElementById('BookingModal').style.maxHeight = 490+'px';
                }

                //Modal Header
                document.getElementById('BookingModal-HeaderDate').innerHTML = this.getDayOfTheWeek(this.date)+', '+this.getMonthName(date)+' '+date.getDate()+' '+date.getFullYear();

                //Modal Location
                document.getElementById('BookingModal-Location').value = location.id;

                //Time
                document.getElementById('BookingModal-StartTime').value = startTime;
                document.getElementById('BookingModal-EndTime').value = endTime;

                //Advanced Options
                this.showMoreText = 'Show More';
                this.showMore = false;
                document.getElementById('BookingModal-AdvancedOptions').style.height = '0px';

                //Scroll
                document.getElementById('BookingModal').scrollTo(0, 0);

                //Visibility
                document.getElementById("BookingModal").style.opacity = "1.0";
                document.getElementById("BookingModal").style.visibility = "visible";
            },
            closeModal() {
                //Visibility
                document.getElementById("BookingModal").style.opacity = "0.0";
                document.getElementById("BookingModal").style.visibility = "hidden";

                //inputs
                this.selectedDates = [];
                if (this.checkFormType() == 'room') {
                    document.getElementById('BookingModal-Type').value = 0;
                    document.getElementById('BookingModal-Title').value = '';  
                    document.getElementById('BookingModal-Description').value = '';
                    document.getElementById('BookingModal-NoiseSlider').value = 0;
                    document.getElementById('BookingModal-NoiseValue').innerHTML = 'Quiet';
                }
                document.getElementById('BookingModal-Privacy').checked = false;
            },
            
            submitBooking(event) {
                var locationID = document.getElementById('BookingModal-Location').value;
                
                var resourceID = '';
                for (var i = 0; i < this.$parent.resources.length; i++) {
                    if (document.getElementById('res'+this.$parent.resources[i].id) != null && document.getElementById('res'+this.$parent.resources[i].id).checked)
                        resourceID += this.$parent.resources[i].id + ',';
                }
                if (resourceID == '')
                    resourceID = '0';
                else
                    resourceID = resourceID.substring(0, resourceID.length - 1);

                var date = [];
                for (var j = 0; j < this.selectedDates.length; j++) {
                    date[date.length] = this.selectedDates[j].toJSON().slice(0, 10);
                }

                var startTime = document.getElementById('BookingModal-StartTime').value;
                var endTime = document.getElementById('BookingModal-EndTime').value;

                var meetingType = '-1';
                if (document.getElementById('BookingModal-Type'))
                    meetingType = document.getElementById('BookingModal-Type').value;
                
                var title = '';
                if (document.getElementById('BookingModal-Title'))
                    title = document.getElementById('BookingModal-Title').value;

                var description = '';
                if (document.getElementById('BookingModal-Description'))
                    description = document.getElementById('BookingModal-Description').value;
                
                var noiseLevel = 0;
                if (document.getElementById('BookingModal-NoiseSlider'))
                    noiseLevel = document.getElementById('BookingModal-NoiseSlider').value;

                var privacy = document.getElementById('BookingModal-Privacy').checked;
                if (privacy)
                    privacy = 1;
                else
                    privacy = 0;
                
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
                
                //Prevent submit refresh
                event.preventDefault();
            },

            //Modal
            checkFormType() {
                var type = 'room';
                if (this.location != null && this.location.type != undefined)
                    type = this.location.type;
                return type;
            },
            getRangeValue() {
                if (document.getElementById('BookingModal-NoiseSlider').value == -1)
                    document.getElementById('BookingModal-NoiseValue').innerHTML = 'Requires Quiet';
                else if (document.getElementById('BookingModal-NoiseSlider').value == 0)
                    document.getElementById('BookingModal-NoiseValue').innerHTML = 'Quiet';
                else if (document.getElementById('BookingModal-NoiseSlider').value == 1)
                    document.getElementById('BookingModal-NoiseValue').innerHTML = 'Loud';
            },

            changeOptions() {
                this.showMore = !this.showMore;
                if (this.showMore) {
                    this.showMoreText = 'Show Less';
                    document.getElementById('BookingModal-AdvancedOptions').style.height = 'auto';
                }

                else {
                    this.showMoreText = 'Show More';
                    document.getElementById('BookingModal-AdvancedOptions').style.height = '0px';
                }
            },

            //Booking Modal
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