<template>
    <div class="BookingModal" id="BookingModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="modal-title" id="modalTitle"></div>
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="bookingForm">
                
            <div class="inputLg">
                <label for="title" class="sectionLabel">Title</label>
                <input type="text" id="title" class="form-control" placeholder="Title of your booking..." required autofocus>
            </div>

            <div class="inputLg">
                <label for="description" class="sectionLabel">Description</label>
                <textarea type="text" id="description" class="form-control" placeholder="Describe your booking..."></textarea>
            </div>

            <div class="inputSmLeft">
                <label for="startTime" class="sectionLabel">Start Time</label>
                <input type="time" min="9:00" max="21:00" step="300" id="startTime" class="form-control" placeholder="" required>
            </div>
            
            <div class="inputSmRight">
                <label for="endTime" class="sectionLabel">End Time</label>
                <input type="time" min="9:00" max="21:00" step="300" id="endTime" class="form-control" placeholder="" required>
            </div>

            <div class="colorSelectorContainer">
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
            
            <div class="sliderContainer">
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
                bookingSelected: {date: null, id: null, name: null},

                //Color options
                selectedColor: 'blue'
            }
        },

        methods: {
            submitBooking(event) {
                var date = this.bookingSelected.date.getMonth()+1+'/'+
                            this.bookingSelected.date.getDate()+'/'+
                            this.bookingSelected.date.getFullYear();
                var locationID = this.bookingSelected.id;
                var title = document.getElementById('title').value;
                var description = document.getElementById('description').value;               
                var startTime = document.getElementById('startTime').value;
                var endTime = document.getElementById('endTime').value;
                var bookingColor = this.selectedColor;
                var noiseLevel = document.getElementById('noiseSlider').value;

                api.insertBooking(date, locationID, title, description, startTime, endTime, bookingColor, noiseLevel).then(bookingResult => {
                    console.log(bookingResult);

                    //Booking overlap

                    //Booking too short

                    //Booking time not in a multiple of 5

                    //Successful booking
                    if (bookingResult) {
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
                    for (var index = 0; index < 8; index++) {
                        document.getElementById('colorOption'+index).style.visibility = 'visible';
                    }
                }
                else {
                    this.selectedColor = input;
                    document.getElementById('selectedColor').style.visibility = 'visible';
                    for (var index = 0; index < 8; index++) {
                        document.getElementById('colorOption'+index).style.visibility = 'hidden';
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

            openModal(date, input, bookingName) {
                this.bookingSelected.date = date;
                this.bookingSelected.id = input[0];
                this.bookingSelected.name = bookingName;

                //Modal Title
                document.getElementById('modalTitle').innerHTML = this.bookingSelected.name;

                //Start Time
                var hour = parseInt(((input[1]-1) / 12), 10) + 7;   //7 refers to the earliest window of time availible
                if (hour < 10)
                    hour = '0'+hour;
                var min = (input[1]-1) % 12 * 5;
                if (min < 10)
                    min = '0'+min;
                document.getElementById('startTime').value = hour + ":" + min;

                //End Time
                if (min == 55) {
                    hour += 1;
                    min = '00';
                }
                else if (min == '00')
                    min = '05';
                else if (min == '05')
                    min = 10;
                else
                    min += 5
                document.getElementById('endTime').value = hour + ":" + min;

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