<template>
    <div>

        <div class="container" v-for='(array, index) in this.users' :key="'array:'+index">

            <div v-if='array.length > 0' class="row">
                <div v-if='index === 0 && array.length > 0'      class="col label">Admins</div>
                <div v-else-if='index === 1 && array.length > 0' class="col label">Tier 5 Members</div>
                <div v-else-if='index === 2 && array.length > 0' class="col label">Tier 4 Members</div>
                <div v-else-if='index === 3 && array.length > 0' class="col label">Tier 3 Members</div>
                <div v-else-if='index === 4 && array.length > 0' class="col label">Tier 2 Members</div>
                <div v-else-if='index === 5 && array.length > 0' class="col label">Tier 1 Members</div>
                <div v-else-if='index === 6 && array.length > 0' class="col label">Non-Members</div>
            </div>

            <div v-if='array.length > 0' class="row" style='text-align: center;'>
                <div class="col">Email</div>
                <div class="col">Username</div>
                <div class="col">First Name</div>
                <div class="col">Last Name</div>
                <div class="col">Actions</div>
            </div>

            <div class="row" style='text-align: center;'
            v-for='(user, index) in array' :key="'user:'+user.id" :style="$parent.styleRow(index)">
                <div class="col" style='position: relative;'>
                    <div class="col-text">{{user.email}}</div>
                </div>
                <div class="col" style='position: relative;'>
                    <div class="col-text">{{user.username}}</div>
                </div>
                <div class="col" style='position: relative;'>
                    <div class="col-text">{{user.firstName}}</div>
                </div>
                <div class="col" style='position: relative;'>
                    <div class="col-text">{{user.lastName}}</div>
                </div>
                <div class="col">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-5">
                                <button class="btn btn-primary btn-lg editBtn" v-on:click="openUserModal(user)"></button>
                            </div>
                            <div class="col-5">
                                <button class="btn btn-dark btn-lg deleteBtn" v-on:click="removeUser(user)"></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="space" v-if='array.length > 0'></div>
        </div>

        <div class="container">
            <div class="row justify-content-center">
                <button class="col-6 btn btn-success btn-lg btn-block createBtn" v-on:click="openUserModal()"></button>
            </div>
        </div>


        <!-- Modals -->
        <UserModal ref="UserModal"></UserModal>

        <!-- Dimmer -->
        <Dimmer ref="Dimmer"></Dimmer>

    </div>
</template>

<style lang="scss">

</style>

<script>
    import * as api from '@/services/api_access';

    //Modals
    import UserModal from './UserModal.vue';

    //Dimmer
    import Dimmer from '../modals/components/Dimmer';

    export default {
        components: {
            // Modals
            UserModal,

            // Dimmer
            Dimmer
        },

        data() {
            return {
                users: this.$parent.users
            }
        },

        methods: {
            updateUsers() {
                this.$parent.getAllUsers();
            },

            removeUser(user) {
                var responce = confirm("Are you sure you want to delete user - " + user.username);
                if (responce) {
                    api.admin_RemoveAccount(user.id).then(
                        removeResponce => {
                            if (removeResponce == '100')
                                this.$parent.getAllUsers();
                            else if (removeResponce == '404') 
                                this.$parent.$refs.Header.logout();
                        }
                    );
                }
            },

            openUserModal(user=null) {
                this.closeModals();
                if (user === null) {
                    this.$refs.UserModal.openModal('create', user);
                }
                else if (user !== null) {
                    this.$refs.UserModal.openModal('update', user);
                }
                this.$refs.Dimmer.openDimmer();
            },
            closeModals() {
                this.$refs.UserModal.closeModal();
            },
            closeDimmer() {
                this.$refs.Dimmer.closeDimmer();
            }
        }
    }
</script>