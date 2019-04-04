<template>
    <div class="Users">

        <div class="users-container" v-for='(array, index) in this.users' :key="'array:'+index">
            <div v-if='index === 0'      class="label">Admins</div>
            <div v-else-if='index === 1' class="label">Members</div>

            <div class="usersTopRow">
                <div class="usersCol">Email</div>
                <div class="usersCol">Username</div>
                <div class="usersCol">First Name</div>
                <div class="usersCol">Last Name</div>
                <div class="usersColBtn">Actions</div>
            </div>

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
                    <button class="btn btn-primary usersBtn editBtn" v-on:click="$refs.ViewUserModal.openModal(user)"></button>
                    <button class="btn btn-dark usersBtn deleteBtn" v-on:click="removeUser(user.id)"></button>
                </div>
            </div>
        </div>

        <button class="btn btn-success usersBtn createBtn" v-on:click="$refs.CreateUserModal.openModal()"></button>

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
    import ViewUserModal from '../modals/ViewUserModal.vue';
    import CreateUserModal from '../modals/CreateUserModal.vue';

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

            removeUser(id) {
                api.admin_RemoveAccount(id).then(
                    removeResponce => {
                        if (removeResponce == '100') {
                            this.$parent.getUsers();
                        }
                        else if (removeResponce == '409') 
                            this.$parent.$refs.Header.logout();
                    }
                );
            }
        }
    }
</script>