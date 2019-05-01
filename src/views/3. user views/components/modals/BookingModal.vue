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
                <div id="resources" class="dropdown-check-list">
                    <span class="anchor" @click="clickList('resources')">Select Resources</span>
                    <div class="items">
                        <label class="container" @click="selectAll()">
                            <div class="text">Select All</div>
                            <input type="checkbox" id='selectAllBtn'>
                            <span class="checkmark"></span>
                        </label>
                        <label class="container" v-for="resource in $parent.resources" :key='resource.id'>
                            <div class="text">{{resource.name}}</div>
                            <input type="checkbox" :id="'res'+resource.id">
                            <span class="checkmark"></span>
                        </label>
                    </div>
                </div>
            </div>

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

                //Scroll
                document.getElementById('BookingModal').scrollTo(0, 0);

                document.getElementById("BookingModal").style.opacity = "1.0";
                document.getElementById("BookingModal").style.visibility = "visible";
            },
            closeModal() {
                document.getElementById("BookingModal").style.opacity = "0.0";
                document.getElementById("BookingModal").style.visibility = "hidden";
                //colors
                document.getElementById('BookingModal-SelectedColor').style.visibility = 'visible';
                for (var index = 0; index < 8; index++)
                    document.getElementById('BookingModal-ColorOption'+index).style.visibility = 'hidden';
                //inputs
                this.date = null;
                this.location = null;
                document.getElementById('BookingModal-Title').value = '';          
                document.getElementById('BookingModal-Description').value = '';
                document.getElementById('BookingModal-NoiseSlider').value = 0;
                document.getElementById('BookingModal-NoiseValue').innerHTML = 'Quiet';
            },
            
            submitBooking(event) {
                var date = this.date.toJSON().slice(0, 10);
                var locationID = document.getElementById('BookingModal-Location').value;
                var locationName = this.$parent.locations[document.getElementById('BookingModal-Location').value].name;
                
                var resourceID = '';
                for (var i = 0; i < this.$parent.resources.length; i++) {
                    if (document.getElementById('res'+this.$parent.resources[i].id) != null && document.getElementById('res'+this.$parent.resources[i].id).checked) {
                        resourceID += this.$parent.resources[i].id + ',';
                    }
                }
                if (resourceID == '')
                    resourceID = '0';
                else
                    resourceID = resourceID.substring(0, resourceID.length - 1);
                
                var title = '';
                if (document.getElementById('BookingModal-Title'))
                    title = document.getElementById('BookingModal-Title').value;
                var description = '';
                if (document.getElementById('BookingModal-Description'))
                    description = document.getElementById('BookingModal-Description').value;
                
                var startTime = document.getElementById('BookingModal-StartTime').value;
                var endTime = document.getElementById('BookingModal-EndTime').value;
                var bookingColor = this.selectedColor;
                
                var noiseLevel = 0;
                if (document.getElementById('BookingModal-NoiseSlider'))
                    noiseLevel = document.getElementById('BookingModal-NoiseSlider').value;
                
                api.insertBooking(date, locationID, locationName, resourceID, title, description, startTime, endTime, bookingColor, noiseLevel).then(bookingResult => {
                    if (bookingResult == '100') {
                        this.closeModal();
                        this.$parent.checkBookings();
                    }
                    
                    else if (bookingResult == '403') 
                        alert('You dont have permission to make a booking');
                    else if (bookingResult == '404') 
                        alert('Booking time must be within the time range (watch out for AM PM)');
                    else if (bookingResult == '405') 
                        alert('Start Time must be before End Time');
                    else if (bookingResult == '406') 
                        alert('Time is not within a 5 min interval');
                    else if (bookingResult == '407') 
                        alert('Time Overlap');
                    else if (bookingResult == '408') 
                        alert('A Silent Reservation Has Already Been Made During This Time');
                    else if (bookingResult == '409') 
                        alert('A Loud Reservation Has Already Been Made During This Time');
                });
                
                //Prevent submit refresh
                event.preventDefault();
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

            getDayOfTheWeek(date) {
                switch(date.getDay()) {
                    case 0: return 'Sunday';
                    case 1: return 'Monday';
                    case 2: return 'Tuesday';
                    case 3: return 'Wednesday';
                    case 4: return 'Thursday';
                    case 5: return 'Friday';
                    case 6: return 'Saturday';
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
                    document.getElementById('BookingModal-NoiseValue').innerHTML = 'Requires Quiet';
                else if (document.getElementById('BookingModal-NoiseSlider').value == 0)
                    document.getElementById('BookingModal-NoiseValue').innerHTML = 'Quiet';
                else if (document.getElementById('BookingModal-NoiseSlider').value == 1)
                    document.getElementById('BookingModal-NoiseValue').innerHTML = 'Loud';
            },

            changeOptions() {
                this.showMore = !this.showMore;
                if (this.showMore)
                    this.showMoreText = 'Show Less';
                else
                    this.showMoreText = 'Show More';
            },

            clickList(id) {
                var checkList = document.getElementById(id);
                if (checkList.classList.contains('visible'))
                    checkList.classList.remove('visible');
                else
                    checkList.classList.add('visible');
            },
            selectAll() {
                var checked = document.getElementById('selectAllBtn').checked;
                for (var i = 0; i < this.$parent.resources.length; i++) {
                    document.getElementById('res'+this.$parent.resources[i].id).checked = checked;
                }
            }
        },

        mounted() {
            //Listen for modal submit
            document.getElementById('BookingModal-Form').addEventListener('submit', this.submitBooking);
        }
    }
</script>