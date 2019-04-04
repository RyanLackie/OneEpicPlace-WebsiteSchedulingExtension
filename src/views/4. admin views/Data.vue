<template>
    <div class="Data">

        <!-- Loading Icon -->
        <div class="loadingAnimation" v-if="!load"></div>

        <!-- Edit Navbar -->
        <div class="viewSelector">
            <a class="text" href="JavaScript:void(0)" v-if="load" @click="viewSelected = 0">Users</a>
            <a class="text" href="JavaScript:void(0)" v-if="load" @click="viewSelected = 1">Locations</a>
            <a class="text" href="JavaScript:void(0)" v-if="load" @click="viewSelected = 2">Resources</a>
        </div>
        
        <!-- Views -->
        <Users ref="Users" v-if="viewSelected == 0 && load"></Users>
        <Locations ref="Locations" v-if="viewSelected == 1 && load"></Locations>

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

    export default {
        components: {
            //Views
            Users,
            Locations
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
                        var users = data[0];
                        var adminUsers = [];
                        var normalUsers = [];
                        for (var i = 0; i < users.length; i++) {
                            if (users[i].privilege == 2)
                                adminUsers.push(users[i]);
                            else if (users[i].privilege == 1)
                                normalUsers.push(users[i]);
                        }
                        this.users[0] = adminUsers;
                        this.users[1] = normalUsers;

                        //Locations
                        var locations = data[1];
                        locations.sort(function(location1, location2) {
                            return location1.orderID - location2.orderID;
                        });
                        this.locations = locations;

                        //Resources
                        var resources = data[2];
                        resources.sort(function(Resource1, Resource2) {
                            return Resource1.orderID - Resource2.orderID;
                        });
                        this.resources = resources;

                        //Complete
                        this.load = true;
                    });
            },
            getUsers() {
                this.load = false;
                api.admin_GetUsers().then(
                    users => {
                        var adminUsers = [];
                        var normalUsers = [];
                        for (var i = 0; i < users.length; i++) {
                            if (users[i].privilege == 2)
                                adminUsers.push(users[i]);
                            else if (users[i].privilege == 1)
                                normalUsers.push(users[i]);
                        }
                        this.users[0] = adminUsers;
                        this.users[1] = normalUsers;
                        this.load = true;
                    }
                )
            },
            getLocations() {
                this.load = false;
                api.admin_GetLocations().then(
                    locations => {
                        locations.sort(function(location1, location2) {
                            return location1.orderID - location2.orderID;
                        });
                        this.locations = locations;
                        this.load = true;
                    }
                )
            },
            getResources() {
                this.load = false;
                api.admin_GetResources().then(
                    resources => {
                        resources.sort(function(resource1, resource2) {
                            return resource1.orderID - resource2.orderID;
                        });
                        this.resources = resources;
                        this.load = true;
                    }
                )
            }
        },

        mounted() {
            this.getData();
        }
    }
</script>