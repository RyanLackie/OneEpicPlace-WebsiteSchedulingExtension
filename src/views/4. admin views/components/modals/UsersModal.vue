<template>
    <div class="UsersModal" id="UsersModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="modal-header-text">Edit User</div>
            
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="UsersModal-Form">

            <div class="inputLg">
                <label class="sectionLabel">Account Type</label>
                <select id="UsersModal-Privilege" class="form-control" required>
                    <option value=2>Admin User</option>
                    <option value=1>User</option>
                </select>
            </div>
            <div class="inputLg">
                <label class="sectionLabel">Email</label>
                <input type="text" class="input-box form-control" id="UsersModal-Email" placeholder="User's Email">
            </div>
            <div class="inputSmLeft">
                <label class="sectionLabel">Username</label>
                <input type="text" class="input-box form-control" id="UsersModal-Username" placeholder="User's Username">
            </div>
            <div class="inputSmRight">
                <label class="sectionLabel">Password</label>
                <input type="text" class="input-box form-control" id="UsersModal-Password" placeholder="User's Password">
            </div>
            <div class="inputSmLeft">
                <label class="sectionLabel">First Name</label>
                <input type="text" class="input-box form-control" id="UsersModal-FirstName" placeholder="User's First Name">
            </div>
            <div class="inputSmRight">
                <label class="sectionLabel">Last Name</label>
                <input type="text" class="input-box form-control" id="UsersModal-LastName" placeholder="User's Last Name">
            </div>
            <div class="inputLg">
                <label class="sectionLabel">Occupation</label>
                <input type="text" class="input-box form-control" id="UsersModal-Occupation" placeholder="User's Occupation">
            </div>
            <div class="inputLg">
                <label class="sectionLabel">Description</label>
                <textarea type="textarea" class="input-box form-control" id="UsersModal-Description" placeholder="User's Description"></textarea>
            </div>

            <button class="btn btn-success submitBtn" type="submit">Submit</button>
            <button class="btn btn-secondary cancelBtn" type="button" @click="closeModal()">Cancel</button>
        </form>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./css/UsersModal.css";
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
                document.getElementById("UsersModal-Privilege").value = user.privilege;
                document.getElementById("UsersModal-Email").value = user.email;
                document.getElementById("UsersModal-Username").value = user.username;
                document.getElementById("UsersModal-Password").value = user.password;
                document.getElementById("UsersModal-FirstName").value = user.firstName;
                document.getElementById("UsersModal-LastName").value = user.lastName;
                document.getElementById("UsersModal-Occupation").value = user.occupation;
                document.getElementById("UsersModal-Description").value = user.description;

                //Scroll
                document.getElementById('UsersModal').scrollTo(0, 0);

                document.getElementById("UsersModal").style.opacity = "1.0";
                document.getElementById("UsersModal").style.visibility = "visible";
            },
            closeModal() {
                //user
                this.user = null;

                document.getElementById("UsersModal").style.opacity = "0.0";
                document.getElementById("UsersModal").style.visibility = "hidden";
            },
            
            updateProfile(event) {
                var id = this.user.id;
                var privilege = document.getElementById("UsersModal-Privilege").value;
                var email = document.getElementById("UsersModal-Email").value;
                var username = document.getElementById("UsersModal-Username").value;
                var password = document.getElementById("UsersModal-Password").value;
                var firstName = document.getElementById("UsersModal-FirstName").value;
                var lastName = document.getElementById("UsersModal-LastName").value;
                var occupation = document.getElementById("UsersModal-Occupation").value;
                var description = document.getElementById("UsersModal-Description").value;
                
                api.admin_UpdateProfile(id, privilege, email, username, password, firstName, lastName, occupation, description).then(updateResult => {
                    if (updateResult == '409') 
                        this.$parent.$refs.Header.logout();
                    else {
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
            document.getElementById('UsersModal-Form').addEventListener('submit', this.updateProfile);
        }
    }
</script>