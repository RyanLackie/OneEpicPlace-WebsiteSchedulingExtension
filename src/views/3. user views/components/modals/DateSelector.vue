<template>
    <div class="PopUpModal DateSelectorModal" id="DateSelectorModal" aria-hidden="true">
                
        <div class="modal-header">
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <div class="dateSelector">
            <div class="backBtn" @click="changeMonth(-1)"></div>
            <div class="date">{{getMonthName(date) + ' ' + date.getFullYear()}}</div>
            <div class="forwardBtn" @click="changeMonth(1)"></div>

            <div class="calendar">
                <div class="daysOfWeek" v-for="day in 7" :key='"day"+day'>{{getDayOfWeek(day)}}</div>
                <div class="day" v-for="dateInLoop in getDaysInRange(date)" :key='"date"+dateInLoop'
                :style="styleDate(dateInLoop)" @click="selectDate(dateInLoop)">
                    {{dateInLoop.getDate()}}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>

<script>
    export default {
        data() {
            return {
                date: new Date()
            }
        },

        methods: {
            openModal() {
                // Data
                this.date = this.$parent.date;

                //Visibility
                document.getElementById("DateSelectorModal").style.opacity = "1.0";
                document.getElementById("DateSelectorModal").style.visibility = "visible";
            },
            closeModal() {
                //Visibility
                document.getElementById("DateSelectorModal").style.opacity = "0.0";
                document.getElementById("DateSelectorModal").style.visibility = "hidden";
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
                if (date.getDate() === new Date().getDate() && 
                        date.getMonth() == new Date().getMonth() && 
                        date.getFullYear() == new Date().getFullYear()) {
                    return "background: blue; color: white;";
                }
                else if (date.getMonth() != this.date.getMonth()) {
                    return "background: gainsboro;";
                }
            },
            selectDate(date) {
                this.$parent.date = date;
                this.$parent.updateCalender();
                this.closeModal();
            }
        }
    }
</script>