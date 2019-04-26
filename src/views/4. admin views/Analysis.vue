<template>
    <div class="Analysis">

        <!-- Loading Icon -->
        <div class="loadingAnimation" v-if="!load"></div>

        <div v-if="load">

            <div class="inputSection">

                <div id="users" class="dropdown-check-list inputContainer inputContainerLeft">
                    <span class="anchor" @click="clickList('users')">Select Users</span>
                    <div class="items">
                        <label class="container" @click="selectAll('usersSelectAllBtn')">
                            <div class="text">Select All</div>
                            <input type="checkbox" id='usersSelectAllBtn' checked>
                            <span class="checkmark"></span>
                        </label>
                        <label class="container" v-for="user in this.users" :key='user.id' :value='user.id'>
                            <div class="text">{{user.username}}</div>
                            <input type="checkbox" :id="'use'+user.id" checked>
                            <span class="checkmark"></span>
                        </label>
                    </div>
                </div>

                <div id="locations" class="dropdown-check-list inputContainer inputContainerRight">
                    <span class="anchor" @click="clickList('locations')">Select Locations</span>
                    <div class="items">
                        <label class="container" @click="selectAll('locationsSelectAllBtn')">
                            <div class="text">Select All</div>
                            <input type="checkbox" id='locationsSelectAllBtn' checked>
                            <span class="checkmark"></span>
                        </label>
                        <label class="container" v-for="location in this.locations" :key='location.id' :value='location.id'>
                            <div class="text">{{location.name}}</div>
                            <input type="checkbox" :id="'loc'+location.id" checked>
                            <span class="checkmark"></span>
                        </label>
                    </div>
                </div>

            </div>

            <div class="inputSection">

                <div id="resources" class="dropdown-check-list inputContainer inputContainerLeft">
                    <span class="anchor" @click="clickList('resources')">Select Resources</span>
                    <div class="items">
                        <label class="container" @click="selectAll('resourcesSelectAllBtn')">
                            <div class="text">Select All</div>
                            <input type="checkbox" id='resourcesSelectAllBtn' checked>
                            <span class="checkmark"></span>
                        </label>
                        <label class="container">
                            <div class="text">None</div>
                            <input type="checkbox" id='res0' checked>
                            <span class="checkmark"></span>
                        </label>
                        <label class="container" v-for="resource in this.resources" :key='resource.id' :value='resource.id'>
                            <div class="text">{{resource.name}}</div>
                            <input type="checkbox" :id="'res'+resource.id" checked>
                            <span class="checkmark"></span>
                        </label>
                    </div>
                </div>
                
                <div class="inputContainer inputContainerRight">
                    <input type='date' id='startDate' class="form-control date leftDate" :value="startDate">
                    <input type='date' id='endDate' class="form-control date rightDate" :value="endDate">
                </div>
                
            </div>

            <div class='buttonContainer'>
                <button class='button' @click='runReport()'>Submit</button>
            </div>



            <!-- Loading Icon -->
            <div class="loadingAnimation" v-if="!reportLoad"></div>

            <div v-if="reportLoad">

                <!-- 
                    users       (hours rented, most active times, most active location, most active resources)
                    locations   (hours rented, most active times, most active users, most active resources)
                    resources   (hours rented, most active times, most active users, most active locations)
                -->

                <div class='reportContainer'>
                    <div class="topRow">
                        <div class="reportCol">Users</div>
                        <div class="reportCol">Hours Booked</div>
                        <div class="reportCol">Activity</div>
                        <div class="reportCol">Locations</div>
                        <div class="reportCol">Resources</div>
                    </div>

                    <div class="reportRow" v-for="user in this.selectedUsers" :key="'user:'+user.id">
                        <div class="reportCol">
                            <div class="colText">{{user.username}}</div>
                        </div>
                        <div class="reportCol">
                            <div class="colText">{{user.hours}}</div>
                        </div>
                        <div class="reportCol">
                            <div class="barGraph" :style="styleBar(bar, user.activity)" v-for="(bar, index) in user.activity" :key="'bar1:'+index"></div>
                        </div>
                        <div class="reportCol">
                            <select class='selectMenu'>
                                <option class="colText" v-for="location in user.locations" :key="'loc1:'+location.id">
                                    {{getLocationName(location.id) + '   |   hours: ' + location.hours}}
                                </option>
                            </select>
                        </div>
                        <div class="reportCol">
                            <select class='selectMenu'>
                                <option class="colText" v-for="(resource, index) in user.resources" :key="'res1:'+index">
                                    {{getResourceName(resource.id) + '   |   hours: ' + resource.hours}}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>


                <div class='reportContainer'>
                    <div class="topRow">
                        <div class="reportCol">Locations</div>
                        <div class="reportCol">Hours Booked</div>
                        <div class="reportCol">Activity</div>
                        <div class="reportCol">Users</div>
                        <div class="reportCol">Resources</div>
                    </div>

                    <div class="reportRow" v-for="location in this.selectedLocations" :key="'location:'+location.id">
                        <div class="reportCol">
                            <div class="colText">{{location.name}}</div>
                        </div>
                        <div class="reportCol">
                            <div class="colText">{{location.hours}}</div>
                        </div>
                        <div class="reportCol">
                            <div class="barGraph" :style="styleBar(bar, location.activity)" v-for="(bar, index) in location.activity" :key="'bar2:'+index"></div>
                        </div>
                        <div class="reportCol">
                            <select class='selectMenu'>
                                <option class="colText" v-for="user in location.users" :key="'use2:'+user.id">
                                    {{getUserName(user.id) + '   |   hours: ' + location.hours}}
                                </option>
                            </select>
                        </div>
                        <div class="reportCol">
                            <select class='selectMenu'>
                                <option class="colText" v-for="(resource, index) in location.resources" :key="'res2'+index">
                                    {{getResourceName(resource.id) + '   |   hours: ' + resource.hours}}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>


                <div class='reportContainer'>
                    <div class="topRow">
                        <div class="reportCol">Resources</div>
                        <div class="reportCol">Hours Booked</div>
                        <div class="reportCol">Activity</div>
                        <div class="reportCol">Users</div>
                        <div class="reportCol">Locations</div>
                    </div>

                    <div class="reportRow" v-for="resource in this.selectedResources" :key="'resource:'+resource.id">
                        <div class="reportCol">
                            <div class="colText">{{resource.name}}</div>
                        </div>
                        <div class="reportCol">
                            <div class="colText">{{resource.hours}}</div>
                        </div>
                        <div class="reportCol">
                            <div class="barGraph" :style="styleBar(bar, resource.activity)" v-for="(bar, index) in resource.activity" :key="'bar3::'+index"></div>
                        </div>
                        <div class="reportCol">
                            <select class='selectMenu'>
                                <option class="colText" v-for="(user, index) in resource.users" :key="'use3:'+user.id+index">
                                    {{getUserName(user.id) + '   |   hours: ' + user.hours}}
                                </option>
                            </select>
                        </div>
                        <div class="reportCol">
                            <select class='selectMenu'>
                                <option class="colText" v-for="location in resource.locations" :key="'loc3:'+location.id">
                                    {{getLocationName(location.id) + '   |   hours: ' + location.hours}}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            
            </div>

        </div>

        

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "css/Analysis.css";
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                load: false,
                reportLoad: false,

                startDate: (new Date().getFullYear()) +'-'+ (('0' + (new Date().getMonth() + 1)).slice(-2)) +'-'+ (('0' + new Date().getDate()).slice(-2)),
                endDate: (new Date().getFullYear()) +'-'+ (('0' + (new Date().getMonth() + 1)).slice(-2)) +'-'+ (('0' + new Date().getDate()).slice(-2)),

                users: [],
                locations: [],
                resources: [],

                selectedUsers: [],
                selectedLocations: [],
                selectedResources: []
            }
        },

        methods: {
            getData() {
                this.load = false;
                api.admin_GetData().then(
                    data => {
                        //Users
                        this.users = this.sortUsers(data[0]);
                        //Locations
                        this.locations = this.sortLocations(data[1]);
                        //Resources
                        this.resources = data[2];
                        //Complete
                        this.load = true;
                    }
                );
            },
            sortUsers(users) {
                var admin = [];
                var tier5Member = [];
                var tier4Member = [];
                var tier3Member = [];
                var tier2Member = [];
                var tier1Member = [];
                var nonMember = [];
                for (var i = 0; i < users.length; i++) {
                    if (users[i].privilege == 6)
                        admin.push(users[i]);
                    else if (users[i].privilege == 5)
                        tier5Member.push(users[i]);
                    else if (users[i].privilege == 4)
                        tier4Member.push(users[i]);
                    else if (users[i].privilege == 3)
                        tier3Member.push(users[i]);
                    else if (users[i].privilege == 2)
                        tier2Member.push(users[i]);
                    else if (users[i].privilege == 1)
                        tier1Member.push(users[i]);
                    else if (users[i].privilege == 0)
                        nonMember.push(users[i]);
                }
                users = admin.concat(tier5Member).concat(tier4Member).concat(tier3Member).concat(tier2Member).concat(tier1Member).concat(nonMember);
                return users;
            },
            sortLocations(locations) {
                var room = [];
                var desk = [];
                for (var i = 0; i < locations.length; i++) {
                    if (locations[i].type == 'room')
                        room.push(locations[i]);
                    else if (locations[i].type == 'desk')
                        desk.push(locations[i]);
                }
                locations = room.concat(desk);
                return locations;
            },

            clickList(id) {
                if (id != 'users')
                    document.getElementById('users').classList.remove('visible');
                if (id != 'locations')  
                    document.getElementById('locations').classList.remove('visible');
                if (id != 'resources')
                    document.getElementById('resources').classList.remove('visible');

                var checkList = document.getElementById(id);
                if (checkList.classList.contains('visible'))
                    checkList.classList.remove('visible');
                else
                    checkList.classList.add('visible');
            },
            selectAll(id) {
                var checked = document.getElementById(id).checked;

                if (id == 'usersSelectAllBtn') {
                    for (var user = 0; user < this.users.length; user++) {
                        document.getElementById('use'+this.users[user].id).checked = checked;
                    }
                }
                else if (id == 'locationsSelectAllBtn') {
                    for (var loc = 0; loc < this.locations.length; loc++) {
                        document.getElementById('loc'+this.locations[loc].id).checked = checked;
                    }
                }
                else if (id == 'resourcesSelectAllBtn') {
                    document.getElementById('res0').checked = checked;
                    for (var res = 0; res < this.resources.length; res++) {
                        document.getElementById('res'+this.resources[res].id).checked = checked;
                    }
                }
            },

            runReport() {
                this.reportLoad = false;

                this.startDate = document.getElementById('startDate').value;
                this.endDate = document.getElementById('endDate').value;
                
                document.getElementById('users').classList.remove('visible');
                document.getElementById('locations').classList.remove('visible');
                document.getElementById('resources').classList.remove('visible');

                var users = [];
                var locations = [];
                var resources = [];

                for (var use = 0; use < this.users.length; use++) {
                    if (document.getElementById('use'+this.users[use].id).checked)
                        users[users.length] = this.users[use];
                }
                for (var loc = 0; loc < this.locations.length; loc++) {
                    if (document.getElementById('loc'+this.locations[loc].id).checked)
                        locations[locations.length] = this.locations[loc];
                }
                if (document.getElementById('res0').checked)
                    resources[0] = { id: 0, name: 'None' };
                for (var res = 0; res < this.resources.length; res++) {
                    if (document.getElementById('res'+this.resources[res].id).checked)
                        resources[resources.length] = this.resources[res];
                }

                var startDate = document.getElementById('startDate').value;
                var endDate = document.getElementById('endDate').value;

                api.admin_RunReport(users, locations, resources, startDate, endDate).then(
                    bookings => {
                        
                        for (var j = 0; j < users.length; j++) {
                            users[j].hours = 0;
                            users[j].activity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            users[j].locations = [];
                            users[j].resources = [];
                        }
                        for (var jj = 0; jj < locations.length; jj++) {
                            locations[jj].hours = 0;
                            locations[jj].activity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            locations[jj].users = [];
                            locations[jj].resources = [];
                        }
                        for (var jjj = 0; jjj < resources.length; jjj++) {
                            resources[jjj].hours = 0;
                            resources[jjj].activity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            resources[jjj].users = [];
                            resources[jjj].locations = [];
                        }

                        for (var booking = 0; booking < bookings.length; booking++) {

                            var hours = Math.abs(bookings[booking].endTime.split(':')[0] - bookings[booking].startTime.split(':')[0]);
                            var mins = Math.abs(bookings[booking].endTime.split(':')[1] - bookings[booking].startTime.split(':')[1]);

                            var MIN_HOUR = 7;
                            var MAX_HOUR = 21;

                            for (var user = 0; user < users.length; user++) {
                                if (bookings[booking].userID == users[user].id) {
                                    //Hours
                                    users[user].hours += Math.round( (hours + mins/60) * 100 ) / 100;
                                    //Activity
                                    for (var i = 0; i < hours+1; i++) {
                                        var index = (parseInt(bookings[booking].startTime.split(':')[0], 10) - MIN_HOUR + i);
                                        var value = users[user].activity[index] + 1;
                                        if (index < users[user].activity.length)
                                            users[user].activity[index] = value;
                                    }
                                    //Location
                                    var foundLocation = false;
                                    for (var ii = 0; ii < users[user].locations.length; ii++) {
                                        if (users[user].locations[ii].id == bookings[booking].locationID) {
                                            foundLocation = true;
                                            users[user].locations[ii].hours += Math.round( (hours + mins/60) * 100 ) / 100;
                                        }
                                    }
                                    if (!foundLocation)
                                        users[user].locations[users[user].locations.length] = {id: bookings[booking].locationID, hours: hours};
                                    //Resources
                                    var foundResource = false;
                                    for (var j = 0; j < bookings[booking].resourceID.length; j++) {
                                        for (var jj = 0; jj < users[user].resources.length; jj++) {
                                            if (bookings[booking].resourceID[j] == users[user].resources[jj].id) {
                                                foundResource = true;
                                                users[user].resources[jj].hours += Math.round( (hours + mins/60) * 100 ) / 100;
                                            }
                                        }
                                        if (!foundResource)
                                            users[user].resources[users[user].resources.length] = {id: bookings[booking].resourceID[j], hours: hours};
                                    }
                                }
                            }
                            
                            for (var loc = 0; loc < locations.length; loc++) {
                                if (bookings[booking].locationID == locations[loc].id) {
                                    //Hours
                                    locations[loc].hours += Math.round( (hours + mins/60) * 100 ) / 100;
                                    //Activity
                                    for (var i = 0; i < hours+1; i++) {
                                        var index = (parseInt(bookings[booking].startTime.split(':')[0], 10) - MIN_HOUR + i);
                                        var value = locations[loc].activity[index] + 1;
                                        if (index < locations[loc].activity.length)
                                            locations[loc].activity[index] = value;
                                    }
                                    //Users
                                    var foundUser = false;
                                    for (var ii = 0; ii < locations[loc].users.length; ii++) {
                                        if (locations[loc].users[ii].id == bookings[booking].userID) {
                                            foundUser = true;
                                            locations[loc].users[ii].hours += Math.round( (hours + mins/60) * 100 ) / 100;
                                        }
                                    }
                                    if (!foundLocation)
                                        locations[loc].users[locations[loc].users.length] = {id: bookings[booking].userID, hours: hours};
                                    //Resources
                                    var foundResource = false;
                                    for (var j = 0; j < bookings[booking].resourceID.length; j++) {
                                        for (var jj = 0; jj < locations[loc].resources.length; jj++) {
                                            if (bookings[booking].resourceID[j] == locations[loc].resources[jj].id) {
                                                foundResource = true;
                                                locations[loc].resources[jj].hours += Math.round( (hours + mins/60) * 100 ) / 100;
                                            }
                                        }
                                        if (!foundResource)
                                            locations[loc].resources[locations[loc].resources.length] = {id: bookings[booking].resourceID[j], hours: hours};
                                    }
                                }
                            }

                            for (var res = 0; res < resources.length; res++) {
                                if (bookings[booking].resourceID == resources[res].id) {
                                    //Hours
                                    resources[res].hours += Math.round( (hours + mins/60) * 100 ) / 100;
                                    //Activity
                                    for (var i = 0; i < hours+1; i++) {
                                        var index = (parseInt(bookings[booking].startTime.split(':')[0], 10) - MIN_HOUR + i);
                                        var value = resources[res].activity[index] + 1;
                                        if (index < resources[res].activity.length)
                                            resources[res].activity[index] = value;
                                    }
                                    //Users
                                    var foundUser = false;
                                    for (var ii = 0; ii < resources[res].users.length; ii++) {
                                        if (resources[res].users[ii].id == bookings[booking].userID) {
                                            foundUser = true;
                                            resources[res].users[ii].hours += Math.round( (hours + mins/60) * 100 ) / 100;
                                        }
                                    }
                                    if (!foundLocation)
                                        resources[res].users[resources[res].users.length] = {id: bookings[booking].userID, hours: hours};
                                    //Location
                                    var foundLocation = false;
                                    for (var iii = 0; iii < resources[res].locations.length; iii++) {
                                        if (resources[res].locations[iii].id == bookings[booking].locationID) {
                                            foundLocation = true;
                                            resources[res].locations[iii].hours += Math.round( (hours + mins/60) * 100 ) / 100;
                                        }
                                    }
                                    if (!foundLocation)
                                        resources[res].locations[resources[res].locations.length] = {id: bookings[booking].locationID, hours: hours};
                                }
                            }
                            
                        }

                        this.selectedUsers = users.sort(function(a, b) {
                            b.hours - a.hours;
                        });
                        
                        this.selectedLocations = locations.sort(function(a, b) {
                            b.hours - a.hours;
                        });

                        this.selectedResources = resources.sort(function(a, b) {
                            b.hours - a.hours;
                        });
                        
                        this.reportLoad = true;
                    }
                );
            },

            styleBar(bar, graph) {
                var max = 0;
                for (var i = 0; i < graph.length; i++) {
                    if (graph[i] > max)
                        max = graph[i];
                }
                if (max > 0)
                    return 'height: ' + (bar / max) * 100 + '%; background: purple; border: 1px indigo solid; border-top: 0px indigo solid;';
                return 'border-bottom: 1px indigo solid;';
            },
            getUserName(id) {
                for (var i = 0; i < this.users.length; i++) {
                    if (this.users[i].id == id)
                        return this.users[i].username;
                }
            },
            getLocationName(id) {
                for (var i = 0; i < this.locations.length; i++) {
                    if (this.locations[i].id == id)
                        return this.locations[i].name;
                }
            },
            getResourceName(id) {
                if (id == 0)
                    return 'None'
                for (var i = 0; i < this.resources.length; i++) {
                    if (this.resources[i].id == id)
                        return this.resources[i].name;
                }
            }
        },

        mounted() {
            this.getData();
        }

    }
</script>