<template>
    <div class="BookingModal" id="BookingModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="text">Booking</div>
            <div class="date" id='BookingModal-HeaderDate'></div>
            
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="BookingModal-Form">

            <div class="inputLg">
                <label class="sectionLabel">Location</label>
                <select id="BookingModal-Location" class="form-control" required>
                    <option v-for="location in $parent.locations" :key='location.id' :id="'loc'+location.id" :value='location.id'>{{location.name}}</option>
                </select>
            </div>

            <div class="inputLg" v-if='checkFormType() == "room"'>
                <label class="sectionLabel">Meeting Type</label>
                <select id="BookingModal-Type" class="form-control" required>
                    <option v-for="type in $parent.types" :key='type.id' :value='type.id'>{{type.type}}</option>
                </select>
            </div>
                
            <div class="inputLg" v-if='checkFormType() == "room"'>
                <label class="sectionLabel">Title</label>
                <input type="text" id="BookingModal-Title" class="form-control" placeholder="Title of your booking..." required autofocus>
            </div>

            <div class="inputLg" v-if='checkFormType() == "room"'>
                <label class="sectionLabel">Description</label>
                <textarea type="text" id="BookingModal-Description" class="form-control" placeholder="Describe your booking..."></textarea>
            </div>

            <div class="inputSmLeft">
                <label class="sectionLabel">Start Time</label>
                <input type="time" min="7:00" max="22:00" step="300" id="BookingModal-StartTime" class="form-control" required>
            </div>
            
            <div class="inputSmRight">
                <label class="sectionLabel">End Time</label>
                <input type="time" min="7:00" max="22:00" step="300" id="BookingModal-EndTime" class="form-control" required>
            </div>

            <div class="colorSelectorContainer" :style='styleColorSelector()'>
                <div class="colorLabel">Color</div>

                <div id='BookingModal-SelectedColor' class="selectedColor" :style="{background: selectedColor}" @click="selectColor()"></div>
                
                <div class="colorRow">
                    <div id='BookingModal-ColorOption0' class="colorOption" style="background:blue;" @click="selectColor('blue')"></div>
                    <div id='BookingModal-ColorOption1' class="colorOption" style="background:red;" @click="selectColor('red')"></div>
                    <div id='BookingModal-ColorOption2' class="colorOption" style="background:yellow;" @click="selectColor('yellow')"></div>
                    <div id='BookingModal-ColorOption3' class="colorOption" style="background:purple;" @click="selectColor('purple')"></div>
                </div>
                <div class="colorRow">
                    <div id='BookingModal-ColorOption4' class="colorOption" style="background:green;" @click="selectColor('green')"></div>
                    <div id='BookingModal-ColorOption5' class="colorOption" style="background:pink;" @click="selectColor('pink')"></div>
                    <div id='BookingModal-ColorOption6' class="colorOption" style="background:orange;" @click="selectColor('orange')"></div>
                    <div id='BookingModal-ColorOption7' class="colorOption" style="background:brown;" @click="selectColor('brown')"></div>
                </div>
                
            </div>
            
            <div class="sliderContainer" v-if='checkFormType() == "room"'>
                <div class="noiseLabel">Noise Level</div>
                <div class="value" id="BookingModal-NoiseValue">Quite</div>
                <input type="range" min="-1" max="1" value="0" class="slider" id="BookingModal-NoiseSlider" @input="getRangeValue()">
            </div>

            <!-- Advanced Options -->            
            <button class="btn btn-outline-secondary advancedBtn" type="button" @click="changeOptions()">{{showMoreText}}</button>

            <div class="inputLg" v-if="showMore">
                <label class="sectionLabel">Resources</label>
                <select id="BookingModal-Resources" class="form-control">
                    <option v-for="resource in $parent.resources" :key='resource.id' :value='resource.id'>{{resource.name}}</option>
                </select>
            </div>
            <!--
            <div class="calendarLabel" v-if="showMore">
                <label class="sectionLabel">Repeat</label>
            </div>
            <div class="dateSelector" v-if="showMore">
                <button id="dateSelectorPreviousBtn" class="btn backBtn" type="button" @click="decMonth()"></button>
                <input id="dateSelectorDate" class="date" :value="getMonthName(date)+' '+date.getFullYear()" disabled>
                <button id="dateSelectorPreviousBtn" class="btn forwardBtn" type="button" @click="incMonth()"></button>
            </div>
            -->

            <button class="btn btn-success submitBtn" type="submit">Submit</button>
            <button class="btn btn-secondary cancelBtn" type="button" @click="closeModal()">Cancel</button>
        </form>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./css/BookingModal.css";
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                date: null,
                location: null,

                //Color options
                selectedColor: 'blue',

                showMoreText: 'Show More',
                showMore: false
            }
        },

        methods: {
            openModal(date, location, startTime, endTime) {
                this.date = date;
                this.location = location;

                //Modal Header
                document.getElementById('BookingModal-HeaderDate').innerHTML = this.getDayOfTheWeek(date)+', '+this.getMonthName(date)+' '+date.getDate()+' '+date.getFullYear();

                //Modal Location
                document.getElementById('BookingModal-Location').value = location.id;

                //Time
                document.getElementById('BookingModal-StartTime').value = startTime;
                document.getElementById('BookingModal-EndTime').value = endTime;

                document.getElementById("BookingModal").style.opacity = "1.0";
                document.getElementById("BookingModal").style.visibility = "visible";
            },
            closeModal() {
                document.getElementById("BookingModal").style.opacity = "0.0";
                document.getElementById("BookingModal").style.visibility = "hidden";
                //colors
                document.getElementById('BookingModal-SelectedColor').style.visibility = 'visible';
                for (var index = 0; index < 8; index++) {
                    document.getElementById('BookingModal-ColorOption'+index).style.visibility = 'hidden';
                }
            },

            checkFormType() {
                var type = 'room';
                if (this.location != null && this.location.type != undefined)
                    type = this.location.type;
                return type;
            },
            styleColorSelector() {
                if (this.location != null && this.location.type != undefined) {
                    if (this.location.type == 'desk')
                        return 'width: 40%; margin: 10px 30%;';
                }
            },
            
            submitBooking(event) {
                var date = this.date.toJSON().slice(0, 10);
                var locationID = document.getElementById('BookingModal-Location').value;
                var locationName = this.$parent.locations[document.getElementById('BookingModal-Location').value].name;
                var title = document.getElementById('BookingModal-Title').value;          
                var description = document.getElementById('BookingModal-Description').value;
                var startTime = document.getElementById('BookingModal-StartTime').value;
                var endTime = document.getElementById('BookingModal-EndTime').value;
                var bookingColor = this.selectedColor;
                var noiseLevel = document.getElementById('BookingModal-NoiseSlider').value;
                
                api.insertBooking(date, locationID, locationName, title, description, startTime, endTime, bookingColor, noiseLevel).then(bookingResult => {
                    //Not logged in
                    if (bookingResult == '403') 
                        alert('You dont have permission to make a booking');
                    //Booking time not in a multiple of 5
                    else if (bookingResult == '404') 
                        alert('Booking time must be within the time range (watch out for AM PM)');
                    //Not logged in
                    else if (bookingResult == '405') 
                        alert('Start Time must be before End Time');
                    //Booking time not in a multiple of 5
                    else if (bookingResult == '406') 
                        alert('Time is not within a 5 min interval');
                    //Booking overlap
                    else if (bookingResult == '407') 
                        alert('Time Overlap');
                    //Successful booking
                    else if (bookingResult == '100') {
                        this.closeModal();
                        this.$parent.checkBookings();
                    }
                });
                
                //Prevent submit refresh
                event.preventDefault();
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

            selectColor(input) {
                if (input == null) {
                    document.getElementById('BookingModal-SelectedColor').style.visibility = 'hidden';
                    for (var index1 = 0; index1 < 8; index1++) {
                        document.getElementById('BookingModal-ColorOption'+index1).style.visibility = 'visible';
                    }
                }
                else {
                    this.selectedColor = input;
                    document.getElementById('BookingModal-SelectedColor').style.visibility = 'visible';
                    for (var index2 = 0; index2 < 8; index2++) {
                        document.getElementById('BookingModal-ColorOption'+index2).style.visibility = 'hidden';
                    }
                }
            },

            getRangeValue() {
                if (document.getElementById('BookingModal-NoiseSlider').value == -1)
                    document.getElementById('BookingModal-NoiseValue').innerHTML = 'Requires Quite';
                else if (document.getElementById('BookingModal-NoiseSlider').value == 0)
                    document.getElementById('BookingModal-NoiseValue').innerHTML = 'Quite';
                else if (document.getElementById('BookingModal-NoiseSlider').value == 1)
                    document.getElementById('BookingModal-NoiseValue').innerHTML = 'Loud';
            },

            changeOptions() {
                this.showMore = !this.showMore;
                if (this.showMore)
                    this.showMoreText = 'Show Less';
                else
                    this.showMoreText = 'Show More';
            }
        },

        mounted() {
            //Listen for modal submit
            document.getElementById('BookingModal-Form').addEventListener('submit', this.submitBooking);
        }
    }
</script>