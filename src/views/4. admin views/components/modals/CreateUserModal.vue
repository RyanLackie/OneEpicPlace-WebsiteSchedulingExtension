<template>
    <div class="CreateUserModal" id="CreateUserModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="modal-header-text">Create User</div>
            
            <button type="button" class="close" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="CreateUserModal-Form">

            <div class="inputLg">
                <label class="sectionLabel">Account Type</label>
                <select id="CreateUserModal-Privilege" class="form-control" required>
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
                <input type="text" class="input-box form-control" id="CreateUserModal-Email" placeholder="User's Email" required>
            </div>
            <div class="inputSmLeft">
                <label class="sectionLabel">Username</label>
                <input type="text" class="input-box form-control" id="CreateUserModal-Username" placeholder="User's Username" required>
            </div>
            <div class="inputSmRight">
                <label class="sectionLabel">Password</label>
                <input type="text" class="input-box form-control" id="CreateUserModal-Password" placeholder="User's Password" required>
            </div>
            <div class="inputSmLeft">
                <label class="sectionLabel">First Name</label>
                <input type="text" class="input-box form-control" id="CreateUserModal-FirstName" placeholder="User's First Name">
            </div>
            <div class="inputSmRight">
                <label class="sectionLabel">Last Name</label>
                <input type="text" class="input-box form-control" id="CreateUserModal-LastName" placeholder="User's Last Name">
            </div>
            <div class="inputLg">
                <label class="sectionLabel">Occupation</label>
                <input type="text" class="input-box form-control" id="CreateUserModal-Occupation" placeholder="User's Occupation">
            </div>
            <div class="inputLg">
                <label class="sectionLabel">Description</label>
                <textarea type="textarea" class="input-box form-control" id="CreateUserModal-Description" placeholder="User's Description"></textarea>
            </div>

            <button class="btn btn-success submitBtn" type="submit">Submit</button>
            <button class="btn btn-secondary cancelBtn" type="button" @click="closeModal()">Cancel</button>
        </form>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./css/CreateUserModal.css";
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                
            }
        },

        methods: {
            openModal() {
                //Fields
                document.getElementById("CreateUserModal-Privilege").value = 0;
                document.getElementById("CreateUserModal-Email").value = '';
                document.getElementById("CreateUserModal-Username").value = '';
                document.getElementById("CreateUserModal-Password").value = '';
                document.getElementById("CreateUserModal-FirstName").value = '';
                document.getElementById("CreateUserModal-LastName").value = '';
                document.getElementById("CreateUserModal-Occupation").value = '';
                document.getElementById("CreateUserModal-Description").value = '';

                //Scroll
                document.getElementById('CreateUserModal').scrollTo(0, 0);

                document.getElementById("CreateUserModal").style.opacity = "1.0";
                document.getElementById("CreateUserModal").style.visibility = "visible";
            },
            closeModal() {                
                document.getElementById("CreateUserModal").style.opacity = "0.0";
                document.getElementById("CreateUserModal").style.visibility = "hidden";
            },
            
            createUser(event) {
                var privilege = document.getElementById("CreateUserModal-Privilege").value;
                var email = document.getElementById("CreateUserModal-Email").value;
                var username = document.getElementById("CreateUserModal-Username").value;
                var password = document.getElementById("CreateUserModal-Password").value;
                var firstName = document.getElementById("CreateUserModal-FirstName").value;
                var lastName = document.getElementById("CreateUserModal-LastName").value;
                var occupation = document.getElementById("CreateUserModal-Occupation").value;
                var description = document.getElementById("CreateUserModal-Description").value;
                
                api.admin_CreateAccount(privilege, email, username, password, firstName, lastName, occupation, description).then(createResult => {
                    if (createResult == '100') {
                        this.closeModal();
                        this.$parent.updateUsers();
                    }
                    if (createResult == '408') 
                        this.$parent.$refs.Header.logout();
                    else if (createResult == '409') 
                        alert('Email is taken');
                    else if (createResult == '410') 
                        alert('Username is taken');
                });
                
                //Prevent submit refresh
                event.preventDefault();
            }
        },

        mounted() {
            //Listen for modal submit
            document.getElementById('CreateUserModal-Form').addEventListener('submit', this.createUser);
        }
    }
</script>