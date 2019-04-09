<template>
    <div class="Header">

        <!-- Text -->
        <div class="text-container">
            <router-link class="text" exact-active-class="active" to="/">
                One EPIC Place
            </router-link>
        </div>

        <!-- Logo -->
        <div class="logo-container">
            <img class="logo" src="../assets/logo.png"/>
        </div>

        <!-- Non User Navbar -->
        <div class="nonUserNavbar" v-if="privilegeLevel < MIN_MEMBER_PRIVILEGE">
            <router-link class="text" exact-active-class="active" to="/">Home</router-link>
            <router-link class="text" exact-active-class="active" to="/about">About</router-link>
            <router-link class="text" exact-active-class="active" to="/login">Login</router-link>
        </div>

        <!-- User Navbar -->
        <div class="userNavbar" v-if="privilegeLevel > MIN_MEMBER_PRIVILEGE && privilegeLevel < ADMIN_PRIVILEGE">
            <router-link class="text" exact-active-class="active" to="/">Home</router-link>
            <router-link class="text" exact-active-class="active" to="/profile">Profile</router-link>
            <router-link class="text" exact-active-class="active" to="/schedule">Schedule</router-link>
            <router-link class="text" exact-active-class="active" to="/about">About</router-link>
            <router-link class="text" exact-active-class="active" to="/" v-on:click.native="logout()">Logout</router-link>
        </div>

        <!-- Admin Navbar -->
        <div class="adminNavbar" v-if="privilegeLevel == ADMIN_PRIVILEGE">
            <router-link class="text" exact-active-class="active" to="/">Home</router-link>
            <router-link class="text" exact-active-class="active" to="/profile">Profile</router-link>
            <router-link class="text" exact-active-class="active" to="/schedule">Schedule</router-link>
            <router-link class="text" exact-active-class="active" to="/data">Data</router-link>
            <router-link class="text" exact-active-class="active" to="/analysis">Analysis</router-link>
            <router-link class="text" exact-active-class="active" to="/about">About</router-link>
            <router-link class="text" exact-active-class="active" to="/" v-on:click.native="logout()">Logout</router-link>
        </div>

        <!-- Line -->
        <div class="line"></div>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "css/Header.css";
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                ADMIN_PRIVILEGE: 6,
                MIN_MEMBER_PRIVILEGE: 1,

                privilegeLevel: 0
            }
        },

        methods: {
            getUserPrivilege() {
                var user = api.getLocalUser();
                if (user != null && user.username != undefined && user.password != undefined) {
                    api.getAccount(user.username, user.password).then(
                        fetchedUser => {
                            if (fetchedUser == '409')
                                this.logout();
                            else {
                                this.privilegeLevel = fetchedUser.privilege;
                                this.checkRoutePrivilege();
                            }
                        }
                    );
                }
                else {
                    this.privilegeLevel = 0;
                    this.checkRoutePrivilege();
                }
            },
            checkRoutePrivilege() {
                var route = this.$router.currentRoute.name;
                
                switch(route) {
                    //All
                    case 'home':
                        break;
                    case 'about':
                        break;

                    //Non Users
                    case 'login':
                        if (this.privilegeLevel > this.MIN_MEMBER_PRIVILEGE)
                            this.$router.push('/');
                        break;

                    //Users
                    case 'profile':
                    case 'schedule':
                        if (this.privilegeLevel < this.MIN_MEMBER_PRIVILEGE)
                            this.$router.push('/');
                        break;

                    //Admin
                    case 'data':
                    case 'analysis':
                        if (this.privilegeLevel < this.ADMIN_PRIVILEGE)
                            this.$router.push('/');
                        break;
                }
            },

            logout() {
                api.logoutUser();
                this.privilegeLevel = 0;
                this.$router.push('/');
            }
        },

        mounted() {
            this.getUserPrivilege();
        }
    }
</script>
