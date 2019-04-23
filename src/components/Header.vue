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
        <div class="navbar" v-if="privilegeLevel < MIN_MEMBER_PRIVILEGE">
            <div class="buttonGroup">
                <router-link class="text" exact-active-class="active" to="/">Home
                    <div class="underline"></div>
                </router-link>
                <router-link class="text" exact-active-class="active" to="/about">About
                    <div class="underline"></div>
                </router-link>
                <router-link class="text" exact-active-class="active" to="/login">Login
                    <div class="underline"></div>
                </router-link>
            </div>
        </div>

        <!-- User Navbar -->
        <div class="navbar" v-if="privilegeLevel >= MIN_MEMBER_PRIVILEGE && privilegeLevel < ADMIN_PRIVILEGE">
            <div class="buttonGroup">
                <router-link class="text" exact-active-class="active" to="/">Home
                    <div class="underline"></div>
                </router-link>
                <router-link class="text" exact-active-class="active" to="/profile">Profile
                    <div class="underline"></div>
                </router-link>
                <router-link class="text" exact-active-class="active" to="/schedule">Schedule
                    <div class="underline"></div>
                </router-link>
                <router-link class="text" exact-active-class="active" to="/about">About
                    <div class="underline"></div>
                </router-link>
                <router-link class="text" exact-active-class="active" to="/" v-on:click.native="logout()">Logout</router-link>
            </div>
        </div>

        <!-- Admin Navbar -->
        <div class="navbar" v-if="privilegeLevel == ADMIN_PRIVILEGE">
            <div class="buttonGroup">
                <router-link class="text" exact-active-class="active" to="/">Home
                    <div class="underline"></div>
                </router-link>
                <router-link class="text" exact-active-class="active" to="/profile">Profile
                    <div class="underline"></div>
                </router-link>
                <router-link class="text" exact-active-class="active" to="/schedule">Schedule
                    <div class="underline"></div>
                </router-link>
                <router-link class="text" exact-active-class="active" to="/data">Data
                    <div class="underline"></div>
                </router-link>
                <router-link class="text" exact-active-class="active" to="/analysis">Analysis
                    <div class="underline"></div>
                </router-link>
                <router-link class="text" exact-active-class="active" to="/about">About
                    <div class="underline"></div>
                </router-link>
                <router-link class="text" exact-active-class="active" to="/" v-on:click.native="logout()">Logout</router-link>
            </div>
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
