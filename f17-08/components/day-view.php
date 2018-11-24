<div class="Container" style="width:50%; margin:0px auto 0px auto;">
    <form method="post" action="#submit">
        <div class="form-group">
            <label for="roomInputSection" class="register-section-label">Room</label>
            <select id="roomInputSection" class="form-control" required>
                <option>Room 1</option>
                <option>Room 2</option>
                <option>Room 3</option>
                <option>Room 4</option>
                <option>Room 5</option>
            </select>

            <label for="startTimeInputSection" class="register-section-label">Time (Start)</label>
            <select id="startTimeInputSection" class="form-control" required>
                <option>8am</option>
                <option>9am</option>
                <option>10am</option>
                <option>11am</option>
                <option>12am</option>
                <option>1am</option>
                <option>2am</option>
                <option>3am</option>
                <option>4am</option>
                <option>5am</option>
                <option>6am</option>
                <option>7am</option>
                <option>8am</option>
            </select>

            <label for="endTimeInputSection" class="register-section-label">Time (End)</label>
            <select id="endTimeInputSection" class="form-control" required>
                <option>8am</option>
                <option>9am</option>
                <option>10am</option>
                <option>11am</option>
                <option>12am</option>
                <option>1am</option>
                <option>2am</option>
                <option>3am</option>
                <option>4am</option>
                <option>5am</option>
                <option>6am</option>
                <option>7am</option>
                <option>8am</option>
            </select>

            <button class="btn btn-lg btn-outline-primary enter-button" type="submit" value="Submit" name="submitButton">Enter</button>
        </div>
    </form>
</div>

<!-- Day Calendar View -->
<div class="calendar-container">
    <div class="calendar-day-daterow">
        <div class="calendar-day-date">
            1
        </div>
    </div>

    <!-- Container for hour markers -->
    <div class="calendar-day-hoursrow" id="row-0">
        <div class="hours-space"></div>

        <div class="hours-group">
            <div class="hours" id="0-1">8am</div>
            <div class="hours" id="0-2">9am</div>
            <div class="hours" id="0-3">10am</div>
            <div class="hours" id="0-4">11am</div>
            <div class="hours" id="0-5">12am</div>
            <div class="hours" id="0-6">1pm</div>
            <div class="hours" id="0-7">2pm</div>
            <div class="hours" id="0-8">3pm</div>
            <div class="hours" id="0-9">4pm</div>
            <div class="hours" id="0-10">5pm</div>
            <div class="hours" id="0-11">6pm</div>
            <div class="hours" id="0-12">7pm</div>
            <div class="hours" id="0-13">8pm</div>
        </div>
    </div>

    <div class="calendar-day-timerow" id="row-1">
        <div class="room-box">Room 1</div>

        <div class="timebox-group">
            <div class="timebox" id="1-1"></div>
            <div class="timebox" id="1-2"></div>
            <div class="timebox" id="1-3"></div>
            <div class="timebox" id="1-4"></div>
            <div class="timebox" id="1-5"></div>
            <div class="timebox" id="1-6"></div>
            <div class="timebox" id="1-7"></div>
            <div class="timebox" id="1-8"></div>
            <div class="timebox" id="1-9"></div>
            <div class="timebox" id="1-10"></div>
            <div class="timebox" id="1-11"></div>
            <div class="timebox" id="1-12"></div>
            <div class="timebox" id="1-13"></div>
        </div>
    </div>

    <div class="calendar-day-timerow" id="row-2">
        <div class="room-box">Room 2</div>
        
        <div class="timebox-group">
            <div class="timebox" id="2-1"></div>
            <div class="timebox" id="2-2"></div>
            <div class="timebox" id="2-3"></div>
            <div class="timebox" id="2-4"></div>
            <div class="timebox" id="2-5"></div>
            <div class="timebox" id="2-6"></div>
            <div class="timebox" id="2-7"></div>
            <div class="timebox" id="2-8"></div>
            <div class="timebox" id="2-9"></div>
            <div class="timebox" id="2-10"></div>
            <div class="timebox" id="2-11"></div>
            <div class="timebox" id="2-12"></div>
            <div class="timebox" id="2-13"></div>
        </div>
    </div>

    <div class="calendar-day-timerow" id="row-3">
        <div class="room-box">Room 3</div>
        
        <div class="timebox-group">
            <div class="timebox" id="3-1"></div>
            <div class="timebox" id="3-2"></div>
            <div class="timebox" id="3-3"></div>
            <div class="timebox" id="3-4"></div>
            <div class="timebox" id="3-5"></div>
            <div class="timebox" id="3-6"></div>
            <div class="timebox" id="3-7"></div>
            <div class="timebox" id="3-8"></div>
            <div class="timebox" id="3-9"></div>
            <div class="timebox" id="3-10"></div>
            <div class="timebox" id="3-11"></div>
            <div class="timebox" id="3-12"></div>
            <div class="timebox" id="3-13"></div>
        </div>
    </div>

    <div class="calendar-day-timerow" id="row-4">
        <div class="room-box">Room 4</div>
        
        <div class="timebox-group">
            <div class="timebox" id="4-1"></div>
            <div class="timebox" id="4-2"></div>
            <div class="timebox" id="4-3"></div>
            <div class="timebox" id="4-4"></div>
            <div class="timebox" id="4-5"></div>
            <div class="timebox" id="4-6"></div>
            <div class="timebox" id="4-7"></div>
            <div class="timebox" id="4-8"></div>
            <div class="timebox" id="4-9"></div>
            <div class="timebox" id="4-10"></div>
            <div class="timebox" id="4-11"></div>
            <div class="timebox" id="4-12"></div>
            <div class="timebox" id="4-13"></div>
        </div>
    </div>

    <div class="calendar-day-timerow" id="row-5">
        <div class="room-box">Room 5</div>
        
        <div class="timebox-group">
            <div class="timebox" id="5-1"></div>
            <div class="timebox" id="5-2"></div>
            <div class="timebox" id="5-3"></div>
            <div class="timebox" id="5-4"></div>
            <div class="timebox" id="5-5"></div>
            <div class="timebox" id="5-6"></div>
            <div class="timebox" id="5-7"></div>
            <div class="timebox" id="5-8"></div>
            <div class="timebox" id="5-9"></div>
            <div class="timebox" id="5-10"></div>
            <div class="timebox" id="5-11"></div>
            <div class="timebox" id="5-12"></div>
            <div class="timebox" id="5-13"></div>
        </div>
    </div>
</div>