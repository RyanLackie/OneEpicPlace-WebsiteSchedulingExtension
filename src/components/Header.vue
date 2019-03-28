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
        <div class="nonUserNavbar" v-if="privilegeLevel == 0">
            <router-link class="text" exact-active-class="active" to="/">Home</router-link>
            <router-link class="text" exact-active-class="active" to="/about">About</router-link>
            <router-link class="text" exact-active-class="active" to="/signup">Sign Up</router-link>
            <router-link class="text" exact-active-class="active" to="/login">Login</router-link>
        </div>

        <!-- User Navbar -->
        <div class="userNavbar" v-if="privilegeLevel == 1">
            <router-link class="text" exact-active-class="active" to="/">Home</router-link>
            <router-link class="text" exact-active-class="active" to="/profile">Profile</router-link>
            <router-link class="text" exact-active-class="active" to="/schedule">Schedule</router-link>
            <router-link class="text" exact-active-class="active" to="/about">About</router-link>
            <router-link class="text" exact-active-class="active" to="/" v-on:click.native="logout()">Logout</router-link>
        </div>

        <!-- Admin Navbar -->
        <div class="adminNavbar" v-if="privilegeLevel == 2">
            <router-link class="text" exact-active-class="active" to="/">Home</router-link>
            <router-link class="text" exact-active-class="active" to="/profile">Profile</router-link>
            <router-link class="text" exact-active-class="active" to="/schedule">Schedule</router-link>
            <router-link class="text" exact-active-class="active" to="/edit">Edit</router-link>
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
                    case 'signup':
                        if (this.privilegeLevel > 0)
                            this.$router.push('/');
                        break;
                    case 'login':
                        if (this.privilegeLevel > 0)
                            this.$router.push('/');
                        break;

                    //Users
                    case 'profile':
                        if (this.privilegeLevel < 1)
                            this.$router.push('/');
                        break;
                    case 'schedule':
                        if (this.privilegeLevel < 1)
                            this.$router.push('/');
                        break;

                    //Admin
                    case 'edit':
                        if (this.privilegeLevel < 2)
                            this.$router.push('/');
                        break;
                    case 'analysis':
                        if (this.privilegeLevel < 2)
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
