<template>
    <div class="Users">

        <div class="topRow">
            <div class="usersCol">Email</div>
            <div class="usersCol">Username</div>
            <div class="usersCol">First Name</div>
            <div class="usersCol">Last Name</div>
            <div class="usersColBtn">Actions</div>
        </div>

        <div class="users-container" v-for='(array, index) in this.users' :key="'array:'+index">
            <div v-if='index === 0 && array.length > 0'      class="label">Admins</div>
            <div v-else-if='index === 1 && array.length > 0' class="label">Tier 5 Members</div>
            <div v-else-if='index === 2 && array.length > 0' class="label">Tier 4 Members</div>
            <div v-else-if='index === 3 && array.length > 0' class="label">Tier 3 Members</div>
            <div v-else-if='index === 4 && array.length > 0' class="label">Tier 2 Members</div>
            <div v-else-if='index === 5 && array.length > 0' class="label">Tier 1 Members</div>
            <div v-else-if='index === 6 && array.length > 0' class="label">Non-Members</div>

            <div class="usersRow" v-for='user in array' :key="'user:'+user.id">
                <div class="usersCol">
                    <div class="colText">{{user.email}}</div>
                </div>
                <div class="usersCol">
                    <div class="colText">{{user.username}}</div>
                </div>
                <div class="usersCol">
                    <div class="colText">{{user.firstName}}</div>
                </div>
                <div class="usersCol">
                    <div class="colText">{{user.lastName}}</div>
                </div>
                <div class="usersColBtn">
                    <button class="btn btn-primary usersBtn editBtn" v-on:click="openViewUserModal(user)"></button>
                    <button class="btn btn-dark usersBtn deleteBtn" v-on:click="removeUser(user)"></button>
                </div>
            </div>

            <div class="space" v-if='array.length > 0'></div>
        </div>

        <button class="btn btn-success usersBtn createBtn" v-on:click="openCreateUserModal()"></button>

        <!-- Modals -->
        <ViewUserModal ref="ViewUserModal"></ViewUserModal>
        <CreateUserModal ref="CreateUserModal"></CreateUserModal>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./css/Users.css";
</style>

<script>
    import * as api from '@/services/api_access';

    //Modals
    import ViewUserModal from '../modals/users/ViewUserModal.vue';
    import CreateUserModal from '../modals/users/CreateUserModal.vue';

    export default {
        components: {
            ViewUserModal,
            CreateUserModal
        },

        data() {
            return {
                users: this.$parent.users
            }
        },

        methods: {
            updateUsers() {
                this.$parent.getUsers();
            },

            removeUser(user) {
                var responce = confirm("Are you sure you want to delete user - " + user.username);
                if (responce) {
                    api.admin_RemoveAccount(user.id).then(
                        removeResponce => {
                            if (removeResponce == '100')
                                this.$parent.getUsers();
                            else if (removeResponce == '409') 
                                this.$parent.$refs.Header.logout();
                        }
                    );
                }
            },

            openViewUserModal(user) {
                this.closeModals();
                this.$refs.ViewUserModal.openModal(user);
            },
            openCreateUserModal() {
                this.closeModals();
                this.$refs.CreateUserModal.openModal();
            },
            closeModals() {
                this.$refs.ViewUserModal.closeModal()
                this.$refs.CreateUserModal.closeModal();
            }
        }
    }
</script>