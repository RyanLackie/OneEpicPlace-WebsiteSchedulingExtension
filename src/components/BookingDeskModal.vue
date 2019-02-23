<template>
    <div class="BookingDeskModal" id="BookingDeskModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="text" id="BookingDeskModal-Header"></div>
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="BookingDeskModal-Form">

            <div class="inputSmLeft">
                <label class="sectionLabel">Start Time</label>
                <input type="time" min="7:00" max="22:00" step="300" id="BookingDeskModal-StartTime" class="form-control" required>
            </div>
            
            <div class="inputSmRight">
                <label class="sectionLabel">End Time</label>
                <input type="time" min="7:00" max="22:00" step="300" id="BookingDeskModal-EndTime" class="form-control" required>
            </div>

            <div class="colorSelectorContainer">
                <div class="colorLabel">Color</div>

                <div id='BookingDeskModal-SelectedColor' class="selectedColor" :style="{background: selectedColor}" @click="selectColor()"></div>
                
                <div class="colorRow">
                    <div id='BookingDeskModal-ColorOption0' class="colorOption" style="background:blue;" @click="selectColor('blue')"></div>
                    <div id='BookingDeskModal-ColorOption1' class="colorOption" style="background:red;" @click="selectColor('red')"></div>
                    <div id='BookingDeskModal-ColorOption2' class="colorOption" style="background:yellow;" @click="selectColor('yellow')"></div>
                    <div id='BookingDeskModal-ColorOption3' class="colorOption" style="background:purple;" @click="selectColor('purple')"></div>
                </div>
                <div class="colorRow">
                    <div id='BookingDeskModal-ColorOption4' class="colorOption" style="background:green;" @click="selectColor('green')"></div>
                    <div id='BookingDeskModal-ColorOption5' class="colorOption" style="background:pink;" @click="selectColor('pink')"></div>
                    <div id='BookingDeskModal-ColorOption6' class="colorOption" style="background:orange;" @click="selectColor('orange')"></div>
                    <div id='BookingDeskModal-ColorOption7' class="colorOption" style="background:brown;" @click="selectColor('brown')"></div>
                </div>
                
            </div>

            <button class="btn btn-success submitBtn" type="submit">Submit</button>
            <button class="btn btn-secondary cancelBtn" type="button" @click="closeModal()">Cancel</button>
        </form>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "css/BookingDeskModal.css";
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
                var title = '';           
                var description = '';
                var startTime = document.getElementById('BookingDeskModal-StartTime').value;
                var endTime = document.getElementById('BookingDeskModal-EndTime').value;
                var bookingColor = this.selectedColor;
                var noiseLevel = 0;

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
                    document.getElementById('BookingDeskModal-SelectedColor').style.visibility = 'hidden';
                    for (var index1 = 0; index1 < 8; index1++) {
                        document.getElementById('BookingDeskModal-ColorOption'+index1).style.visibility = 'visible';
                    }
                }
                else {
                    this.selectedColor = input;
                    document.getElementById('BookingDeskModal-SelectedColor').style.visibility = 'visible';
                    for (var index2 = 0; index2 < 8; index2++) {
                        document.getElementById('BookingDeskModal-ColorOption'+index2).style.visibility = 'hidden';
                    }
                }
            },

            getRangeValue() {
                if (document.getElementById('BookingDeskModal-NoiseSlider').value == 0)
                    document.getElementById('BookingDeskModal-NoiseValue').innerHTML = 'Quite';
                else if (document.getElementById('BookingDeskModal-NoiseSlider').value == 1)
                    document.getElementById('BookingDeskModal-NoiseValue').innerHTML = 'Loud';
                else if (document.getElementById('BookingDeskModal-NoiseSlider').value == 2)
                    document.getElementById('BookingDeskModal-NoiseValue').innerHTML = 'Very Loud';
            },

            openModal(date, input, bookingName, locationType) {
                this.bookingSelected.date = date;
                this.bookingSelected.id = input[0];
                this.bookingSelected.name = bookingName;
                this.bookingSelected.locationType = locationType;

                //Modal Title
                document.getElementById('BookingDeskModal-Header').innerHTML = this.bookingSelected.name;

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
                document.getElementById('BookingDeskModal-StartTime').value = startHour + ":" + startMin;
                document.getElementById('BookingDeskModal-EndTime').value = endHour + ":" + endMin;

                document.getElementById("BookingDeskModal").style.opacity = "1.0";
                document.getElementById("BookingDeskModal").style.visibility = "visible";
            },
            closeModal() {
                document.getElementById("BookingDeskModal").style.opacity = "0.0";
                document.getElementById("BookingDeskModal").style.visibility = "hidden";
                //colors
                document.getElementById('BookingDeskModal-SelectedColor').style.visibility = 'visible';
                for (var index = 0; index < 8; index++) {
                    document.getElementById('BookingDeskModal-ColorOption'+index).style.visibility = 'hidden';
                }
            }
        },

        mounted() {
            //Listen for modal submit
            document.getElementById('BookingDeskModal-Form').addEventListener('submit', this.submitBooking);
        }
    }
</script>