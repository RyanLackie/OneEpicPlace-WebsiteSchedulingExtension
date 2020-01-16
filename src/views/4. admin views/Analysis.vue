<template>
    <div class="Analysis">

        <!-- Loading Icon -->
        <div class="loadingAnimation" v-if="!load"></div>

        <div v-if="load">

            <div class="inputSection">

                <div id="users" class="dropdown-check-list inputContainer inputContainerLeft noselect"
                :class="usersListToggle ? 'visible' : ''" style="z-index: 2;">
                    <span class="anchor"
                    @click="() => {
                        usersListToggle = !usersListToggle;
                        locationsListToggle = false;
                        resourcesListToggle = false;
                    }">
                        Users
                    </span>
                    <div class="items">
                        <label class="container" @click="selectAll('usersSelectAllBtn')">
                            <div class="text">Select All</div>
                            <input type="checkbox" v-model="selectAllUsersToggle">
                            <span class="checkmark"></span>
                        </label>
                        <label class="container" v-for="user in this.users" :key='user.id'>
                            <div class="text">{{user.username}}</div>
                            <input type="checkbox"
                            :checked="itemCheck('users', user)"
                            v-on:input="toggleItem('users', user)">
                            <span class="checkmark"></span>
                        </label>
                    </div>
                </div>

                <div id="locations" class="dropdown-check-list inputContainer inputContainerRight noselect"
                :class="locationsListToggle ? 'visible' : ''" style="z-index: 2;">
                    <span class="anchor"
                    @click="() => {
                        usersListToggle = false;
                        locationsListToggle = !locationsListToggle;
                        resourcesListToggle = false;
                    }">
                        Locations
                    </span>
                    <div class="items">
                        <label class="container" @click="selectAll('locationsSelectAllBtn')">
                            <div class="text">Select All</div>
                            <input type="checkbox" v-model="selectAllLocationsToggle">
                            <span class="checkmark"></span>
                        </label>
                        <label class="container" v-for="location in this.locations" :key='location.id'>
                            <div class="text">{{location.name}}</div>
                            <input type="checkbox"
                            :checked="itemCheck('locations', location)"
                            v-on:input="toggleItem('locations', location)">
                            <span class="checkmark"></span>
                        </label>
                    </div>
                </div>

            </div>

            <div class="inputSection">

                <div id="resources" class="dropdown-check-list inputContainer inputContainerLeft noselect"
                :class="resourcesListToggle ? 'visible' : ''" style="z-index: 1;">
                    <span class="anchor"
                    @click="() => {
                        usersListToggle = false;
                        locationsListToggle = false;
                        resourcesListToggle = !resourcesListToggle;
                    }">
                        Resources
                    </span>
                    <div class="items">
                        <label class="container" @click="selectAll('resourcesSelectAllBtn')">
                            <div class="text">Select All</div>
                            <input type="checkbox" v-model="selectAllResourcesToggle">
                            <span class="checkmark"></span>
                        </label>
                        <label class="container" v-for="resource in this.resources" :key='resource.id'>
                            <div class="text">{{resource.name}}</div>
                            <input type="checkbox"
                            :checked="itemCheck('resources', resource)"
                            v-on:input="toggleItem('resources', resource)">
                            <span class="checkmark"></span>
                        </label>
                    </div>
                </div>
                
                <div class="inputContainer inputContainerRight">
                    <input type='date' id='startDate' class="form-control date leftDate" v-model="startDate">
                    <input type='date' id='endDate' class="form-control date rightDate" v-model="endDate">
                </div>
                
            </div>

            <div class='buttonContainer'>
                <button class='button' @click='runReport()'>Submit</button>
            </div>


            <!-- Loading Icon -->
            <div class="loadingAnimation" v-if="!reportLoad"></div>

            <div v-if="reportLoad">

                <!-- Edit Navbar -->
                <div class="viewSelector">
                    <div class='buttonGroup'>
                        <div class="text" v-if="load" @click="viewSelected = 0">
                            Users
                            <div class="underline" :style="viewSelected === 0 ? 'width: 100%' : null"></div>
                        </div>
                        <div class="text" v-if="load" @click="viewSelected = 1">
                            Locations
                            <div class="underline" :style="viewSelected === 1 ? 'width: 100%' : null"></div>
                        </div>
                        <div class="text" v-if="load" @click="viewSelected = 2">
                            Resources
                            <div class="underline" :style="viewSelected === 2 ? 'width: 100%' : null"></div>
                        </div>
                    </div>
                </div>

                <!-- 
                    users       (hours rented, most active times, most active location, most active resources)
                    locations   (hours rented, most active times, most active users, most active resources)
                    resources   (hours rented, most active times, most active users, most active locations)
                -->

                <AnalysisView viewType='Users' v-if="viewSelected === 0"/>

                <AnalysisView viewType='Locations' v-if="viewSelected === 1"/>

                <AnalysisView viewType='Resources' v-if="viewSelected === 2"/>
            
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

    //Views
    import AnalysisView from './analysisComponents/AnalysisView.vue';

    export default {
        components: {
            //Views
            AnalysisView
        },

        data() {
            return {
                viewSelected: 0,

                load: false,
                reportLoad: false,

                startDate: (new Date().getFullYear()) +'-'+ (('0' + (new Date().getMonth() + 1)).slice(-2)) +'-'+ (('0' + new Date().getDate()).slice(-2)),
                endDate: (new Date().getFullYear()) +'-'+ (('0' + (new Date().getMonth() + 1)).slice(-2)) +'-'+ (('0' + new Date().getDate()).slice(-2)),

                users: [],
                locations: [],
                resources: [],

                usersListToggle: false,
                selectAllUsersToggle: true,
                selectedUsers: [],

                locationsListToggle: false,
                selectAllLocationsToggle: true,
                selectedLocations: [],

                resourcesListToggle: false,
                selectAllResourcesToggle: true,
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
                        this.selectedUsers = this.users;

                        //Locations
                        this.locations = this.sortLocations(data[1]);
                        this.selectedLocations = this.locations;

                        //Resources
                        this.resources = data[2];
                        this.resources.unshift({ id: -1, name: 'None' })
                        this.selectedResources = this.resources;

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
                    if (users[i].memberLevel == 6)
                        admin.push(users[i]);
                    else if (users[i].memberLevel == 5)
                        tier5Member.push(users[i]);
                    else if (users[i].memberLevel == 4)
                        tier4Member.push(users[i]);
                    else if (users[i].memberLevel == 3)
                        tier3Member.push(users[i]);
                    else if (users[i].memberLevel == 2)
                        tier2Member.push(users[i]);
                    else if (users[i].memberLevel == 1)
                        tier1Member.push(users[i]);
                    else if (users[i].memberLevel == 0)
                        nonMember.push(users[i]);
                }
                users = admin.concat(tier5Member).concat(tier4Member).concat(tier3Member).concat(tier2Member).concat(tier1Member).concat(nonMember);
                return users;
            },
            sortLocations(locations) {
                // Sort
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

            selectAll(id) {
                if (id === 'usersSelectAllBtn') {
                    if (!this.selectAllUsersToggle) {
                        this.selectedUsers = this.users;
                    }
                    else {
                        this.selectedUsers = [];
                    }
                }
                else if (id === 'locationsSelectAllBtn') {
                    if (!this.selectAllLocationsToggle) {
                        this.selectedLocations = this.locations;
                    }
                    else {
                        this.selectedLocations = [];
                    }
                }
                else if (id === 'resourcesSelectAllBtn') {
                    if (!this.selectAllResourcesToggle) {
                        this.selectedResources = this.resources;
                    }
                    else {
                        this.selectedResources = [];
                    }
                }
            },

            itemCheck(type, item) {
                if (type === 'users') {
                    for (var i = 0; i < this.selectedUsers.length; i++) {
                        if (this.selectedUsers[i].id === item.id) {
                            return true;
                        }
                    }
                    return false;
                }
                else if (type === 'locations') {
                    for (var i = 0; i < this.selectedLocations.length; i++) {
                        if (this.selectedLocations[i].id === item.id) {
                            return true;
                        }
                    }
                    return false;
                }
                else if (type === 'resources') {
                    for (var i = 0; i < this.selectedResources.length; i++) {
                        if (this.selectedResources[i].id === item.id) {
                            return true;
                        }
                    }
                    return false;
                }
            },
            toggleItem(type, item) {
                let removed = false;
                if (type === 'users') {
                    this.selectedUsers = this.selectedUsers.filter(function(index) {
                        if (index.id === item.id) {
                            removed = true;
                            return false;
                        }
                        return true;
                    });
                    if (!removed) {
                        this.selectedUsers.push(item);
                    }
                }
                else if (type === 'locations') {
                    this.selectedLocations = this.selectedLocations.filter(function(index) {
                        if (index.id === item.id) {
                            removed = true;
                            return false;
                        }
                        return true;
                    });
                    if (!removed) {
                        this.selectedLocations.push(item);
                    }
                }
                else if (type === 'resources') {
                    this.selectedResources = this.selectedResources.filter(function(index) {
                        if (index.id === item.id) {
                            removed = true;
                            return false;
                        }
                        return true;
                    });
                    if (!removed) {
                        this.selectedResources.push(item);
                    }
                }
            },

            runReport() {
                this.reportLoad = false;
                
                this.usersListToggle = false;
                this.locationsListToggle = false;
                this.resourcesListToggle = false;

                let users = this.selectedUsers;
                let locations = this.selectedLocations;
                let resources = this.selectedResources;
                let startDate = this.startDate;
                let endDate = this.endDate;

                api.admin_RunReport(users, locations, resources, startDate, endDate).then(
                    bookings => {
                        if (bookings.length != 0) {

                            for (let j = 0; j < users.length; j++) {
                                users[j].hours = 0;
                                users[j].activity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                                users[j].locations = [];
                                users[j].resources = [];
                            }
                            for (let j = 0; j < locations.length; j++) {
                                locations[j].hours = 0;
                                locations[j].activity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                                locations[j].users = [];
                                locations[j].resources = [];
                            }
                            for (let j = 0; j < resources.length; j++) {
                                resources[j].hours = 0;
                                resources[j].activity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                                resources[j].users = [];
                                resources[j].locations = [];
                            }

                            bookings.forEach(booking => {

                                let hours = Math.abs(booking.endTime.split(':')[0] - booking.startTime.split(':')[0]);
                                let mins = Math.abs(booking.endTime.split(':')[1] - booking.startTime.split(':')[1]);

                                let MIN_HOUR = 7;
                                let MAX_HOUR = 21;

                                let arraysToCheck = [
                                    { type: 'users', array: users }, 
                                    { type: 'locations', array: locations },
                                    { type: 'resources', array: resources },
                                ];

                                arraysToCheck.forEach(object => {
                                    object.array.forEach(item => {
                                        // Hours
                                        item.hours += Math.round( (hours + mins/60) * 100 ) / 100;
                                        // Activity
                                        for (let i = 0; i < hours+1; i++) {
                                            let index = (parseInt(booking.startTime.split(':')[0], 10) - MIN_HOUR + i);
                                            let value = item.activity[index] + 1;
                                            if (index < item.activity.length)
                                                item.activity[index] = value;
                                        }
                                        // Users
                                        if (object.type !== 'users') {
                                            let foundUser = false;
                                            for (let i = 0; i < item.users.length; i++) {
                                                if (item.users[i].id === booking.userID) {
                                                    foundUser = true;
                                                    item.users[i].hours += Math.round( (hours + mins/60) * 100 ) / 100;
                                                    break;
                                                }
                                            }
                                            if (!foundUser) {
                                                item.users[item.users.length] = {
                                                    id: booking.userID,
                                                    name: this.getUserName(booking.userID),
                                                    hours: hours
                                                };
                                            }
                                            console.log(booking.userID, this.getUserName(booking.userID));
                                        }
                                        // Locations
                                        if (object.type !== 'locations') {
                                            let foundLocation = false;
                                            for (let i = 0; i < item.locations.length; i++) {
                                                if (item.locations[i].id === booking.locationID) {
                                                    foundLocation = true;
                                                    item.locations[i].hours += Math.round( (hours + mins/60) * 100 ) / 100;
                                                    break;
                                                }
                                            }
                                            if (!foundLocation) {
                                                item.locations[item.locations.length] = {
                                                    id: booking.locationID,
                                                    name: this.getLocationName(booking.locationID),
                                                    hours: hours
                                                };
                                            }
                                        }
                                        // Resources
                                        if (object.type !== 'resources') {
                                            let foundResource = false;
                                            for (let i = 0; i < booking.resourceID.length; i++) {
                                                booking.resourceID[i] = parseInt(booking.resourceID[i]);
                                            }
                                            booking.resourceID.forEach(resource => {
                                                for (let i = 0; i < item.resources.length; i++) {
                                                    if (resource == item.resources[i].id) {
                                                        foundResource = true;
                                                        item.resources[i].hours += Math.round( (hours + mins/60) * 100 ) / 100;
                                                        break;
                                                    }
                                                }
                                                if (!foundResource) {
                                                    item.resources[item.resources.length] = {
                                                        id: resource,
                                                        name: this.getResourceName(resource),
                                                        hours: hours
                                                    };
                                                }
                                            });
                                        }
                                    });
                                });
                                
                            });

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

            // Style
            styleRow(index) {
                if (index % 2 == 0)
                    return "background: DeepSkyBlue; color: white";
                return "background: white";
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
            getBarTime(index) {
                switch(index) {
                    case 0:
                        return 7;
                    case 1:
                        return 8;
                    case 2:
                        return 9;
                    case 3:
                        return 10;
                    case 4:
                        return 11;
                    case 5:
                        return 12;
                    case 6:
                        return 1;
                    case 7:
                        return 2;
                    case 8:
                        return 3;
                    case 9:
                        return 4;
                    case 10:
                        return 5;
                    case 11:
                        return 6;
                    case 12:
                        return 7;
                    case 13:
                        return 8;
                    case 14:
                        return 9;
                }
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