<template>
    <div class="BookingRoomModal" id="BookingRoomModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="text" id="BookingRoomModal-Header"></div>
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="BookingRoomModal-Form">
                
            <div class="inputLg">
                <label class="sectionLabel">Title</label>
                <input type="text" id="BookingRoomModal-Title" class="form-control" placeholder="Title of your booking..." required autofocus>
            </div>

            <div class="inputLg">
                <label class="sectionLabel">Description</label>
                <textarea type="text" id="BookingRoomModal-Description" class="form-control" placeholder="Describe your booking..."></textarea>
            </div>

            <div class="inputSmLeft">
                <label class="sectionLabel">Start Time</label>
                <input type="time" min="7:00" max="22:00" step="300" id="BookingRoomModal-StartTime" class="form-control" required>
            </div>
            
            <div class="inputSmRight">
                <label class="sectionLabel">End Time</label>
                <input type="time" min="7:00" max="22:00" step="300" id="BookingRoomModal-EndTime" class="form-control" required>
            </div>

            <div class="colorSelectorContainer">
                <div class="colorLabel">Color</div>

                <div id='BookingRoomModal-SelectedColor' class="selectedColor" :style="{background: selectedColor}" @click="selectColor()"></div>
                
                <div class="colorRow">
                    <div id='BookingRoomModal-ColorOption0' class="colorOption" style="background:blue;" @click="selectColor('blue')"></div>
                    <div id='BookingRoomModal-ColorOption1' class="colorOption" style="background:red;" @click="selectColor('red')"></div>
                    <div id='BookingRoomModal-ColorOption2' class="colorOption" style="background:yellow;" @click="selectColor('yellow')"></div>
                    <div id='BookingRoomModal-ColorOption3' class="colorOption" style="background:purple;" @click="selectColor('purple')"></div>
                </div>
                <div class="colorRow">
                    <div id='BookingRoomModal-ColorOption4' class="colorOption" style="background:green;" @click="selectColor('green')"></div>
                    <div id='BookingRoomModal-ColorOption5' class="colorOption" style="background:pink;" @click="selectColor('pink')"></div>
                    <div id='BookingRoomModal-ColorOption6' class="colorOption" style="background:orange;" @click="selectColor('orange')"></div>
                    <div id='BookingRoomModal-ColorOption7' class="colorOption" style="background:brown;" @click="selectColor('brown')"></div>
                </div>
                
            </div>
            
            <div class="sliderContainer">
                <div class="noiseLabel">Noise Level</div>
                <div class="value" id="BookingRoomModal-NoiseValue">Quite</div>
                <input type="range" min="0" max="2" value="0" class="slider" id="BookingRoomModal-NoiseSlider" @change="getRangeValue()">
            </div>
            

            <button class="btn btn-success submitBtn" type="submit">Submit</button>
            <button class="btn btn-secondary cancelBtn" type="button" @click="closeModal()">Cancel</button>
        </form>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "css/BookingRoomModal.css";
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
                var title = document.getElementById('BookingRoomModal-Title').value;           
                var description = document.getElementById('BookingRoomModal-Description').value;
                var startTime = document.getElementById('BookingRoomModal-StartTime').value;
                var endTime = document.getElementById('BookingRoomModal-EndTime').value;
                var bookingColor = this.selectedColor;
                var noiseLevel = document.getElementById('BookingRoomModal-NoiseSlider').value;

                api.insertBooking(date, locationID, title, description, startTime, endTime, bookingColor, noiseLevel).then(bookingResult => {
                    //Not logged in
                    if (bookingResult == '403') 
                        alert('You are not logged in');
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
                    else if (bookingResult == true) {
                        this.closeModal();
                        this.$parent.checkBookings();
                    }
                });

                //Prevent submit refresh
                event.preventDefault();
            },

            selectColor(input) {
                if (input == null) {
                    document.getElementById('BookingRoomModal-SelectedColor').style.visibility = 'hidden';
                    for (var index1 = 0; index1 < 8; index1++) {
                        document.getElementById('BookingRoomModal-ColorOption'+index1).style.visibility = 'visible';
                    }
                }
                else {
                    this.selectedColor = input;
                    document.getElementById('BookingRoomModal-SelectedColor').style.visibility = 'visible';
                    for (var index2 = 0; index2 < 8; index2++) {
                        document.getElementById('BookingRoomModal-ColorOption'+index2).style.visibility = 'hidden';
                    }
                }
            },

            getRangeValue() {
                if (document.getElementById('BookingRoomModal-NoiseSlider').value == 0)
                    document.getElementById('BookingRoomModal-NoiseValue').innerHTML = 'Quite';
                else if (document.getElementById('BookingRoomModal-NoiseSlider').value == 1)
                    document.getElementById('BookingRoomModal-NoiseValue').innerHTML = 'Loud';
                else if (document.getElementById('BookingRoomModal-NoiseSlider').value == 2)
                    document.getElementById('BookingRoomModal-NoiseValue').innerHTML = 'Very Loud';
            },

            openModal(date, input, bookingName, locationType) {
                this.bookingSelected.date = date;
                this.bookingSelected.id = input[0];
                this.bookingSelected.name = bookingName;
                this.bookingSelected.locationType = locationType;

                //Modal Title
                document.getElementById('BookingRoomModal-Header').innerHTML = this.bookingSelected.name;

                //Time
                var startHour = parseInt(((input[1]-1) / 12), 10) + parseInt(this.$parent.hours[0].time.substring(0, this.$parent.hours[0].time.length - 2));
                var startMin = (input[1]-1) % 12 * 5;
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
                document.getElementById('BookingRoomModal-StartTime').value = startHour + ":" + startMin;
                document.getElementById('BookingRoomModal-EndTime').value = endHour + ":" + endMin;

                document.getElementById("BookingRoomModal").style.opacity = "1.0";
                document.getElementById("BookingRoomModal").style.visibility = "visible";
            },
            closeModal() {
                document.getElementById("BookingRoomModal").style.opacity = "0.0";
                document.getElementById("BookingRoomModal").style.visibility = "hidden";
                //colors
                document.getElementById('BookingRoomModal-SelectedColor').style.visibility = 'visible';
                for (var index = 0; index < 8; index++) {
                    document.getElementById('BookingRoomModal-ColorOption'+index).style.visibility = 'hidden';
                }
            }
        },

        mounted() {
            //Listen for modal submit
            document.getElementById('BookingRoomModal-Form').addEventListener('submit', this.submitBooking);
        }
    }
</script>