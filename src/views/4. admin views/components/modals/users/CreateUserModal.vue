<template>
    <div class="PopUpModal CreateUserModal" id="CreateUserModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="text">Create User</div>
            
            <button type="button" class="close" aria-label="Close" @click="close()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="CreateUserModal-Form">

            <div class="label-lg">Account Info</div>

            <label class="label-sm">Member Level
                <span class="required">*</span>
            </label>
            <select id="CreateUserModal-MemberLevel" class="form-control" required>
                <option value=6>Admin</option>
                <option value=5>Tier 5 Member</option>
                <option value=4>Tier 4 Member</option>
                <option value=3>Tier 3 Member</option>
                <option value=2>Tier 2 Member</option>
                <option value=1>Tier 1 Member</option>
                <option value=0>Non-Member</option>
            </select>

            <div class="leftContainer">
                <label class="label-sm">Username
                    <span class="required">*</span>
                </label>
                <input type="text" class="input-box form-control" id="CreateUserModal-Username" placeholder="User's Username" required>
            </div>
            <div class="rightContainer">
                <label class="label-sm">Password
                    <span class="required">*</span>
                </label>
                <input type="text" class="input-box form-control" id="CreateUserModal-Password" placeholder="User's Password" required>
            </div>

            <label class="label-sm">Points
                <span class="required">*</span>
            </label>
            <input type="number" min="0" class="input-box form-control" id="CreateUserModal-Points" value="0" required>

            <label class="label-sm">Admin Notes</label>
            <textarea type="textarea" class="input-box form-control" id="CreateUserModal-Notes" placeholder="Notes"></textarea>


            <div class="sectionBreak"></div>


            <div class="label-lg">Personal Info</div>

            <div class="picture" id='picture'></div>

            <div class="leftContainer">
                <label class="label-sm">First Name</label>
                <input type="text" class="input-box form-control" id="CreateUserModal-FirstName" placeholder="John">
            </div>
            <div class="rightContainer">
                <label class="label-sm">Last Name</label>
                <input type="text" class="input-box form-control" id="CreateUserModal-LastName" placeholder="Smith">
            </div>

            <label class="label-sm">Company Name</label>
            <input type="text" class="input-box form-control" id="CreateUserModal-CompanyName" placeholder="User's Company Name">

            <label class="label-sm">Bio</label>
            <textarea type="textarea" class="input-box form-control" id="CreateUserModal-Bio" placeholder="User's Bio"></textarea>

            <label class="label-sm">Email</label>
            <input type="text" class="input-box form-control" id="CreateUserModal-Email" placeholder="exmaple@domain.com">

            <label class="label-sm">Phone Number</label>
            <input type="tel" class="input-box form-control" id="CreateUserModal-PhoneNumber" placeholder="111-222-3333">

            <button class="btn btn-success leftBtn" type="submit">Submit</button>
            <button class="btn btn-secondary rightBtn" type="button" @click="close()">Cancel</button>
        </form>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "./UserModals.css";
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
                document.getElementById("CreateUserModal-MemberLevel").value = 0;
                document.getElementById("CreateUserModal-Username").value = '';
                document.getElementById("CreateUserModal-Password").value = '';
                document.getElementById("CreateUserModal-Points").value = 0;
                document.getElementById("CreateUserModal-Notes").value = '';

                //document.getElementById("CreateUserModal-Picture").value = '';
                document.getElementById("CreateUserModal-FirstName").value = '';
                document.getElementById("CreateUserModal-LastName").value = '';
                document.getElementById("CreateUserModal-CompanyName").value = '';
                document.getElementById("CreateUserModal-Bio").value = '';
                document.getElementById("CreateUserModal-Email").value = '';
                document.getElementById("CreateUserModal-PhoneNumber").value = '';

                //Scroll
                document.getElementById('CreateUserModal').scrollTo(0, 0);

                document.getElementById("CreateUserModal").style.opacity = "1.0";
                document.getElementById("CreateUserModal").style.visibility = "visible";
            },
            closeModal() {                
                document.getElementById("CreateUserModal").style.opacity = "0.0";
                document.getElementById("CreateUserModal").style.visibility = "hidden";
            },
            close() {
                this.closeModal();
                this.$parent.closeDimmer();
            },
            
            createUser(event) {
                var memberLevel = document.getElementById("CreateUserModal-MemberLevel").value;
                var username = document.getElementById("CreateUserModal-Username").value;
                var password = document.getElementById("CreateUserModal-Password").value;
                var points = document.getElementById("CreateUserModal-Points").value;
                var notes = document.getElementById("CreateUserModal-Notes").value;

                var picture = "";//document.getElementById("CreateUserModal-Picture").value;
                var firstName = document.getElementById("CreateUserModal-FirstName").value;
                var lastName = document.getElementById("CreateUserModal-LastName").value;
                var companyName = document.getElementById("CreateUserModal-CompanyName").value;
                var bio = document.getElementById("CreateUserModal-Bio").value;
                var email = document.getElementById("CreateUserModal-Email").value;
                var phoneNumber = document.getElementById("CreateUserModal-PhoneNumber").value;
                
                api.admin_CreateAccount(memberLevel, username, password, points, notes, picture, firstName, lastName, companyName, bio, email, phoneNumber).then(createResult => {
                    if (createResult == '100') {
                        this.close();
                        this.$parent.updateUsers();
                    }
                    if (createResult == '404') 
                        this.$parent.$refs.Header.logout();
                    else if (createResult == '405') 
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