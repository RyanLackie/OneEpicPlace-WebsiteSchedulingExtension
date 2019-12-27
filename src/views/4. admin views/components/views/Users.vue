<template>
    <div class="Data">

        <div class="dataContainer" v-for='(array, index) in this.users' :key="'array:'+index">
            <div v-if='index === 0 && array.length > 0'      class="label">Admins</div>
            <div v-else-if='index === 1 && array.length > 0' class="label">Tier 5 Members</div>
            <div v-else-if='index === 2 && array.length > 0' class="label">Tier 4 Members</div>
            <div v-else-if='index === 3 && array.length > 0' class="label">Tier 3 Members</div>
            <div v-else-if='index === 4 && array.length > 0' class="label">Tier 2 Members</div>
            <div v-else-if='index === 5 && array.length > 0' class="label">Tier 1 Members</div>
            <div v-else-if='index === 6 && array.length > 0' class="label">Non-Members</div>

            <div v-if='array.length > 0' class="nameRow">
                <div class="dataCol-4">Email</div>
                <div class="dataCol-4">Username</div>
                <div class="dataCol-4">First Name</div>
                <div class="dataCol-4">Last Name</div>
                <div class="dataBtnCol">Actions</div>
            </div>

            <div class="dataRow" v-for='(user, index) in array' :key="'user:'+user.id" :style="$parent.styleRow(index)">
                <div class="dataCol-4">
                    <div class="text">{{user.email}}</div>
                </div>
                <div class="dataCol-4">
                    <div class="text">{{user.username}}</div>
                </div>
                <div class="dataCol-4">
                    <div class="text">{{user.firstName}}</div>
                </div>
                <div class="dataCol-4">
                    <div class="text">{{user.lastName}}</div>
                </div>
                <div class="dataBtnCol">
                    <button class="btn btn-primary actionBtn editBtn" v-on:click="openUserModal(user)"></button>
                    <button class="btn btn-dark actionBtn deleteBtn" v-on:click="removeUser(user)"></button>
                </div>
            </div>

            <div class="space" v-if='array.length > 0'></div>
        </div>

        <button class="btn btn-success actionBtn createBtn" v-on:click="openUserModal()"></button>

        <!-- Modals -->
        <!-- <ViewUserModal ref="ViewUserModal"></ViewUserModal>
        <CreateUserModal ref="CreateUserModal"></CreateUserModal> -->
        <UserModal ref="UserModal"></UserModal>

        <!-- Dimmer -->
        <Dimmer ref="Dimmer"></Dimmer>

    </div>
</template>

<style scoped lang="scss">

</style>

<script>
    import * as api from '@/services/api_access';

    //Modals
    // import ViewUserModal from '../modals/users/ViewUserModal.vue';
    // import CreateUserModal from '../modals/users/CreateUserModal.vue';
    import UserModal from '../modals/users/UserModal.vue';

    //Dimmer
    import Dimmer from '../modals/components/Dimmer';

    export default {
        components: {
            // Modals
            // ViewUserModal,
            // CreateUserModal,
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