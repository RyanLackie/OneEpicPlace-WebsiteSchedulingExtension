<template>
    <div class="Data">

        <!-- Loading Icon -->
        <div class="loadingAnimation" v-if="!load"></div>

        <!-- Edit Navbar -->
        <div class="viewSelector">
            <div class='buttonGroup'>
                <div class="text" v-if="load" @click="viewSelected = 0">Users
                    <div class="underline" :style="styleUnderline(0)"></div>
                </div>
                <div class="text" v-if="load" @click="viewSelected = 1">Locations
                    <div class="underline" :style="styleUnderline(1)"></div>
                </div>
                <div class="text" v-if="load" @click="viewSelected = 2">Resources
                    <div class="underline" :style="styleUnderline(2)"></div>
                </div>
            </div>
        </div>
        
        <!-- Views -->
        <Users ref="Users" v-if="viewSelected == 0 && load"></Users>
        <Locations ref="Locations" v-if="viewSelected == 1 && load"></Locations>
        <Resources ref="Resources" v-if="viewSelected == 2 && load"></Resources>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./css/Data.css";
</style>

<script>
    import * as api from '@/services/api_access';

    //Views
    import Users from './components/views/Users.vue';
    import Locations from './components/views/Locations.vue';
    import Resources from './components/views/Resources.vue';

    export default {
        components: {
            //Views
            Users,
            Locations,
            Resources
        },
        
        data() {
            return {
                viewSelected: 0,

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

            getUsers() {
                this.load = false;
                api.admin_GetUsers().then(
                    users => {
                        this.users = this.sortUsers(users);
                        this.load = true;
                    }
                )
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
                users = [
                    admin, tier5Member, tier4Member,
                    tier3Member, tier2Member, tier1Member,
                    nonMember
                ];
                return users;
            },

            getLocations() {
                this.load = false;
                api.getLocations().then(
                    locations => {
                        this.locations = this.sortLocations(locations);
                        this.load = true;
                    }
                )
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
                locations = [
                    room, desk
                ];
                return locations;
            },

            getResources() {
                this.load = false;
                api.getResources().then(
                    resources => {
                        this.resources = resources;
                        this.load = true;
                    }
                )
            },

            styleUnderline(viewSelected) {
                if (this.viewSelected == viewSelected)
                    return 'width: 100%;';
                return 'width: 0px;';
            }
        },

        mounted() {
            this.getData();
        }
    }
</script>