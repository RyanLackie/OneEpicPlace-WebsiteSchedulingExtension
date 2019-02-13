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
        <div class="nonUserNavbar" v-if="!loggedInStatus">
            <router-link class="text" exact-active-class="active" to="/">
                Home
            </router-link>

            <router-link class="text" exact-active-class="active" to="/about">
                About
            </router-link>

            <router-link class="text" exact-active-class="active" to="/signup">
                Sign Up
            </router-link>

            <router-link class="text" exact-active-class="active" to="/login">
                Login
            </router-link>
        </div>

        <!-- User Navbar -->
        <div class="userNavbar" v-if="loggedInStatus">
            <router-link class="text" exact-active-class="active" to="/">
                Home
            </router-link>

            <router-link class="text" exact-active-class="active" to="/profile">
                Your Profile
            </router-link>
            <!--
            <router-link class="text" exact-active-class="active" to="/reserve">
                Make A Reservation
            </router-link>
            -->
            <router-link class="text" exact-active-class="active" to="/schedule">
                Schedule
            </router-link>

            <router-link class="text" exact-active-class="active" to="/about">
                About
            </router-link>

            <router-link class="text" exact-active-class="active" to="/" v-on:click.native="logout()">
                Logout
            </router-link>
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
                loggedInStatus: false
            }
        },

        methods: {
            getLoggedInStatus() {
                api.checkUser().then(checkResult => {
                    if (checkResult == true)
                        this.loggedInStatus = true;
                    else if (checkResult == 408) {
                        console.log("Null user");
                        this.loggedInStatus = false;
                    }
                    else if (checkResult == 409) {
                        console.log("Error with current logged in status: email or password incorect");
                        this.loggedInStatus = false;
                    }
                    else {
                        console.log("Unnumbered error");
                        this.loggedInStatus = false;
                    }
                });
            },

            logout() {
                api.setUser(null);
                this.loggedInStatus = false;
            }
        },

        mounted() {
            this.getLoggedInStatus();
        }
    }
</script>
