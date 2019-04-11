<template>
    <div class="Analysis">

        <!-- Loading Icon -->
        <div class="loadingAnimation" v-if="!load"></div>

        <div class="inputSection" v-if="load">
            
            <div class="inputContainer inputContainerLeft">
                <label class="label">Users</label>
                <select id="users" class="form-control">
                    <option value='all'>Select All</option>
                    <option v-for="user in this.users" :key='user.id' :value='user.id'>{{user.username}}</option>
                </select>
            </div>
            
            <div class="inputContainer inputContainerRight">
                <label class="label">Locations</label>
                <select id="locations" class="form-control">
                    <option value='all'>Select All</option>
                    <option v-for="location in this.locations" :key='location.id' :value='location.id'>{{location.name}}</option>
                </select>
            </div>

            <div class="inputContainer inputContainerLeft">
                <label class="label">Resources</label>
                <select id="resources" class="form-control">
                    <option value='all'>Select All</option>
                    <option v-for="resource in this.resources" :key='resource.id' :value='resource.id'>{{resource.name}}</option>
                </select>
            </div>
            
            <div class="inputContainer inputContainerRight">
                <label class="label">Date Range</label>
                <div>
                    <input type='date' class="form-control date leftDate">
                    <input type='date' class="form-control date rightDate">
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
        },

        mounted() {
            this.getData();
        }

    }
</script>