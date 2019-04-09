<template>
    <div class="ViewUserModal" id="ViewUserModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="modal-header-text">Edit User</div>
            
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="ViewUserModal-Form">

            <div class="inputLg">
                <label class="sectionLabel">Account Type</label>
                <select id="ViewUserModal-Privilege" class="form-control" required>
                    <option value=6>Admin</option>
                    <option value=5>Tier 5 Member</option>
                    <option value=4>Tier 4 Member</option>
                    <option value=3>Tier 3 Member</option>
                    <option value=2>Tier 2 Member</option>
                    <option value=1>Tier 1 Member</option>
                    <option value=0>Non-Member</option>
                </select>
            </div>
            <div class="inputLg">
                <label class="sectionLabel">Email</label>
                <input type="text" class="input-box form-control" id="ViewUserModal-Email" placeholder="User's Email">
            </div>
            <div class="inputSmLeft">
                <label class="sectionLabel">Username</label>
                <input type="text" class="input-box form-control" id="ViewUserModal-Username" placeholder="User's Username">
            </div>
            <div class="inputSmRight">
                <label class="sectionLabel">Password</label>
                <input type="text" class="input-box form-control" id="ViewUserModal-Password" placeholder="User's Password">
            </div>
            <div class="inputSmLeft">
                <label class="sectionLabel">First Name</label>
                <input type="text" class="input-box form-control" id="ViewUserModal-FirstName" placeholder="User's First Name">
            </div>
            <div class="inputSmRight">
                <label class="sectionLabel">Last Name</label>
                <input type="text" class="input-box form-control" id="ViewUserModal-LastName" placeholder="User's Last Name">
            </div>
            <div class="inputLg">
                <label class="sectionLabel">Occupation</label>
                <input type="text" class="input-box form-control" id="ViewUserModal-Occupation" placeholder="User's Occupation">
            </div>
            <div class="inputLg">
                <label class="sectionLabel">Description</label>
                <textarea type="textarea" class="input-box form-control" id="ViewUserModal-Description" placeholder="User's Description"></textarea>
            </div>

            <button class="btn btn-success submitBtn" type="submit">Submit</button>
            <button class="btn btn-secondary cancelBtn" type="button" @click="closeModal()">Cancel</button>
        </form>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./css/ViewUserModal.css";
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                user: null
            }
        },

        methods: {
            openModal(user) {
                //Data
                this.user = user;
                
                //Fields
                document.getElementById("ViewUserModal-Privilege").value = user.privilege;
                document.getElementById("ViewUserModal-Email").value = user.email;
                document.getElementById("ViewUserModal-Username").value = user.username;
                document.getElementById("ViewUserModal-Password").value = user.password;
                document.getElementById("ViewUserModal-FirstName").value = user.firstName;
                document.getElementById("ViewUserModal-LastName").value = user.lastName;
                document.getElementById("ViewUserModal-Occupation").value = user.occupation;
                document.getElementById("ViewUserModal-Description").value = user.description;

                //Scroll
                document.getElementById('ViewUserModal').scrollTo(0, 0);

                document.getElementById("ViewUserModal").style.opacity = "1.0";
                document.getElementById("ViewUserModal").style.visibility = "visible";
            },
            closeModal() {
                //user
                this.user = null;

                document.getElementById("ViewUserModal").style.opacity = "0.0";
                document.getElementById("ViewUserModal").style.visibility = "hidden";
            },
            
            updateAccount(event) {
                var id = this.user.id;
                var privilege = document.getElementById("ViewUserModal-Privilege").value;
                var previousEmail = this.user.email;
                var email = document.getElementById("ViewUserModal-Email").value;
                var previousUsername = this.user.username;
                var username = document.getElementById("ViewUserModal-Username").value;
                var password = document.getElementById("ViewUserModal-Password").value;
                var firstName = document.getElementById("ViewUserModal-FirstName").value;
                var lastName = document.getElementById("ViewUserModal-LastName").value;
                var occupation = document.getElementById("ViewUserModal-Occupation").value;
                var description = document.getElementById("ViewUserModal-Description").value;
                
                api.admin_UpdateAccount(id, privilege, previousEmail, email, previousUsername, username, password, firstName, lastName, occupation, description).then(updateResult => {
                    if (updateResult == '409') 
                        this.$parent.$refs.Header.logout();
                    else {
                        if (email != updateResult.email)
                            alert('Email is taken');
                        if (username != updateResult.username)
                            alert('Username is taken');
                        this.closeModal();
                        this.$parent.updateUsers();
                    }
                });
                
                //Prevent submit refresh
                event.preventDefault();
            }
        },

        mounted() {
            //Listen for modal submit
            document.getElementById('ViewUserModal-Form').addEventListener('submit', this.updateAccount);
        }
    }
</script>