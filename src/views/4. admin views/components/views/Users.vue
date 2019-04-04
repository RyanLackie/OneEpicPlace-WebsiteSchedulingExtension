<template>
    <div class="Users">

        <div class="user-container" v-for='(array, index) in this.users' :key="'array:'+index">
            <div v-if='index === 0'      class="label">Admin Users</div>
            <div v-else-if='index === 1' class="label">Users</div>

            <div class="usersTopRow">
                <div class="usersColBtn">Actions</div>
                <div class="usersCol">Email</div>
                <div class="usersCol">Username</div>
                <div class="usersCol">Password</div>
                <div class="usersCol">First Name</div>
                <div class="usersCol">Last Name</div>
            </div>

            <div class="usersRow" v-for='user in array' :key="'user:'+user.id">
                <div class="usersColBtn">
                    <button class="btn btn-primary usersBtn editBtn" v-on:click="$refs.UsersModal.openModal(user)"></button>
                    <button class="btn btn-dark usersBtn deleteBtn"></button>
                </div>

                <div class="usersCol">
                    <div class="colText">{{user.email}}</div>
                </div>
                <div class="usersCol">
                    <div class="colText">{{user.username}}</div>
                </div>
                <div class="usersCol">
                    <div class="colText">{{user.password}}</div>
                </div>
                <div class="usersCol">
                    <div class="colText">{{user.firstName}}</div>
                </div>
                <div class="usersCol">
                    <div class="colText">{{user.lastName}}</div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <UsersModal ref="UsersModal"></UsersModal>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./css/Users.css";
</style>

<script>
    import * as api from '@/services/api_access';

    //Modals
    import UsersModal from '../modals/UsersModal.vue';

    export default {
        components: {
            UsersModal
        },

        data() {
            return {
                users: this.$parent.users
            }
        },

        methods: {
            updateUsers() {
                this.$parent.getUsers();
            }
        }
    }
</script>