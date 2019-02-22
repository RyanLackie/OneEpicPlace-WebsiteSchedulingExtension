<template>
    <div class="BookingModal" id="BookingModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="modal-title" id="modalTitle"></div>
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="bookingForm">
                
            <div class="inputLg" v-if="this.bookingSelected.locationType == 'room'">
                <label for="title" class="sectionLabel">Title</label>
                <input type="text" id="title" class="form-control" placeholder="Title of your booking..." required autofocus>
            </div>

            <div class="inputLg" v-if="this.bookingSelected.locationType == 'room'">
                <label for="description" class="sectionLabel">Description</label>
                <textarea type="text" id="description" class="form-control" placeholder="Describe your booking..."></textarea>
            </div>

            <div class="inputSmLeft">
                <label for="startTime" class="sectionLabel">Start Time</label>
                <input type="time" min="7:00" max="22:00" step="300" id="startTime" class="form-control" placeholder="" required>
            </div>
            
            <div class="inputSmRight">
                <label for="endTime" class="sectionLabel">End Time</label>
                <input type="time" min="7:00" max="22:00" step="300" id="endTime" class="form-control" placeholder="" required>
            </div>

            <div class="colorSelectorContainer" id="colorSelectorContainer">
                <div class="colorLabel">Color</div>
                
                <div class="colorRow">
                    <div id='colorOption0' class="colorOption" style="background:blue;" @click="selectColor('blue')"></div>
                    <div id='colorOption1' class="colorOption" style="background:red;" @click="selectColor('red')"></div>
                    <div id='colorOption2' class="colorOption" style="background:yellow;" @click="selectColor('yellow')"></div>
                    <div id='colorOption3' class="colorOption" style="background:purple;" @click="selectColor('purple')"></div>
                </div>
                <div class="colorRow">
                    <div id='colorOption4' class="colorOption" style="background:green;" @click="selectColor('green')"></div>
                    <div id='colorOption5' class="colorOption" style="background:pink;" @click="selectColor('pink')"></div>
                    <div id='colorOption6' class="colorOption" style="background:orange;" @click="selectColor('orange')"></div>
                    <div id='colorOption7' class="colorOption" style="background:brown;" @click="selectColor('brown')"></div>
                </div>

                <div class="selectedColor" id='selectedColor' :style="{background: selectedColor}" @click="selectColor()"></div>
            </div>
            
            <div class="sliderContainer" v-if="this.bookingSelected.locationType == 'room'">
                <div class="noiseLabel">Noise Level</div>
                <div class="value" id="noiseValue">Quite</div>
                <input type="range" min="1" max="3" value="1" class="slider" id="noiseSlider" @change="getRangeValue()">
            </div>
            

            <button class="btn btn-success submitBtn" type="submit">Submit</button>
            <button class="btn btn-secondary cancelBtn" type="button" @click="closeModal()">Cancel</button>
        </form>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "css/BookingModal.css";
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                //bookingSelected include: id, name
                bookingSelected: {date: null, id: null, name: null, locationType: null},

                //Color options
                selectedColor: 'blue'
            }
        },

        methods: {
            submitBooking(event) {
                var date = this.bookingSelected.date.getMonth()+1+'/'+this.bookingSelected.date.getDate()+'/'+this.bookingSelected.date.getFullYear();
                var locationID = this.bookingSelected.id;

                var title = null;
                if (this.bookingSelected.locationType == 'room')
                    description = document.getElementById('title').value
                   
                var description = null;
                if (this.bookingSelected.locationType == 'room')
                    description = document.getElementById('description').value

                var startTime = document.getElementById('startTime').value;
                var endTime = document.getElementById('endTime').value;
                var bookingColor = this.selectedColor;

                var noiseLevel = 0;
                if (this.bookingSelected.locationType == 'room')
                    noiseLevel = document.getElementById('noiseSlider').value;

                api.insertBooking(date, locationID, title, description, startTime, endTime, bookingColor, noiseLevel).then(bookingResult => {
                    //Not logged in
                    if (bookingResult == '403') 
                        alert('You are not logged in');
                    //Booking time not in a multiple of 5
                    else if (bookingResult == '404') 
                        alert('Booking time must be within the time range (watch out for AM PM)');
                    //Not logged in
                    if (bookingResult == '405') 
                        alert('Start Time must be before End Time');
                    //Booking time not in a multiple of 5
                    if (bookingResult == '406') 
                        alert('Time is not within a 5 min interval');
                    //Booking overlap
                    if (bookingResult == '407') 
                        alert('Time Overlap');
                    //Successful booking
                    if (bookingResult == true) {
                        this.closeModal();
                        this.$parent.checkBookings();
                    }
                });

                //Prevent submit refresh
                event.preventDefault();
            },

            selectColor(input) {
                if (input == null) {
                    document.getElementById('selectedColor').style.visibility = 'hidden';
                    for (var index1 = 0; index1 < 8; index1++) {
                        document.getElementById('colorOption'+index1).style.visibility = 'visible';
                    }
                }
                else {
                    this.selectedColor = input;
                    document.getElementById('selectedColor').style.visibility = 'visible';
                    for (var index2 = 0; index2 < 8; index2++) {
                        document.getElementById('colorOption'+index2).style.visibility = 'hidden';
                    }
                }
            },

            getRangeValue() {
                if (document.getElementById('noiseSlider').value == 1)
                    document.getElementById('noiseValue').innerHTML = 'Quite';
                else if (document.getElementById('noiseSlider').value == 2)
                    document.getElementById('noiseValue').innerHTML = 'Loud';
                else if (document.getElementById('noiseSlider').value == 3)
                    document.getElementById('noiseValue').innerHTML = 'Very Loud';
            },

            openModal(date, input, bookingName, locationType) {
                this.bookingSelected.date = date;
                this.bookingSelected.id = input[0];
                this.bookingSelected.name = bookingName;
                this.bookingSelected.locationType = locationType;

                //Modal Title
                document.getElementById('modalTitle').innerHTML = this.bookingSelected.name;

                //Start Time
                var startHour = parseInt(((input[1]-1) / 12), 10) + 7;   //7 refers to the earliest window of time availible
                var startMin = (input[1]-1) % 12 * 5;

                //End Time
                var endHour = startHour;
                var endMin = startMin;
                if (startMin == 55) {
                    endHour += 1;
                    endMin = 0;
                }
                else
                    endMin += 5;

                if (startHour < 10)
                    startHour = '0'+startHour;
                if (startMin < 10)
                    startMin = '0'+startMin;
                if (endHour < 10)
                    endHour = '0'+endHour;
                if (endMin < 10)
                    endMin = '0'+endMin;

                document.getElementById('startTime').value = startHour + ":" + startMin;
                document.getElementById('endTime').value = endHour + ":" + endMin;

                if (this.bookingSelected.locationType == 'desk') {
                    document.getElementById('colorSelectorContainer').style.width = 100+'%';
                    document.getElementById('colorSelectorContainer').style.margin = '0px auto';
                }

                document.getElementById("BookingModal").style.opacity = "1.0";
                document.getElementById("BookingModal").style.visibility = "visible";
            },
            closeModal() {
                document.getElementById("BookingModal").style.opacity = "0.0";
                document.getElementById("BookingModal").style.visibility = "hidden";
                //colors
                document.getElementById('selectedColor').style.visibility = 'visible';
                for (var index = 0; index < 8; index++) {
                    document.getElementById('colorOption'+index).style.visibility = 'hidden';
                }
            }
        },

        mounted() {
            //Listen for modal submit
            document.getElementById('bookingForm').addEventListener('submit', this.submitBooking);
        }
    }
</script>