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

    export default {
        components: {
            //Views
            Users
        },
        
        data() {
            return {
                viewSelected: 0,

                users: [],

                load: false
            }
        },

        methods: {
            getUsers() {
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
            }
        },

        mounted() {
            this.getUsers();
        }
    }
</script>