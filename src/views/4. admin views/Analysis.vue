<template>
    <div class="Analysis">

        <!-- Loading Icon -->
        <div class="loadingAnimation" v-if="!load"></div>

        <div class="inputSection" v-if="load">

            <div id="users" class="dropdown-check-list inputContainer inputContainerLeft">
                <span class="anchor" @click="clickList('users')">Select Users</span>
                <div class="items">
                    <label class="container">
                        <div class="text">Select All</div>
                        <input type="checkbox">
                        <span class="checkmark"></span>
                    </label>
                    <label class="container" v-for="user in this.users" :key='user.id' :value='user.id'>
                        <div class="text">{{user.username}}</div>
                        <input type="checkbox">
                        <span class="checkmark"></span>
                    </label>
                </div>
            </div>

            <div id="locations" class="dropdown-check-list inputContainer inputContainerRight">
                <span class="anchor" @click="clickList('locations')">Select Locations</span>
                <div class="items">
                    <label class="container">
                        <div class="text">Select All</div>
                        <input type="checkbox">
                        <span class="checkmark"></span>
                    </label>
                    <label class="container" v-for="location in this.locations" :key='location.id' :value='location.id'>
                        <div class="text">{{location.name}}</div>
                        <input type="checkbox">
                        <span class="checkmark"></span>
                    </label>
                </div>
            </div>

        </div>

        <div class="inputSection" v-if="load">

            <div id="resources" class="dropdown-check-list inputContainer inputContainerLeft">
                <span class="anchor" @click="clickList('resources')">Select Resources</span>
                <div class="items">
                    <label class="container">
                        <div class="text">Select All</div>
                        <input type="checkbox">
                        <span class="checkmark"></span>
                    </label>
                    <label class="container" v-for="resource in this.resources" :key='resource.id' :value='resource.id'>
                        <div class="text">{{resource.name}}</div>
                        <input type="checkbox">
                        <span class="checkmark"></span>
                    </label>
                </div>
            </div>
            
            <div class="inputContainer inputContainerRight">
                <div>
                    <input type='date' class="form-control date leftDate" placeholder="Start Date: ">
                    <input type='date' class="form-control date rightDate" placeholder="End Date: ">
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
                users: [],
                locations: [],
                resources: [],

                load: false
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
                var checkList = document.getElementById(id);
                
                if (checkList.classList.contains('visible'))
                    checkList.classList.remove('visible');
                else
                    checkList.classList.add('visible');
                
                
            }
        },

        mounted() {
            this.getData();
        }

    }
</script>