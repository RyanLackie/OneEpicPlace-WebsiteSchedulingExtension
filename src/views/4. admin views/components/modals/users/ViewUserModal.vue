<template>
    <div class="PopUpModal ViewUserModal" id="ViewUserModal" aria-hidden="true">
                
        <div class="modal-header">
            <div class="text">Edit User</div>
            
            <button type="button" class="close" aria-label="Close" @click="close()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="ViewUserModal-Form">

            <div class="label-lg">Account Info</div>

            <div class="inputLg">
                <label class="label-sm">Member Level
                    <span class="required">*</span>
                </label>
                <select id="ViewUserModal-MemberLevel" class="form-control" required>
                    <option value=6>Admin</option>
                    <option value=5>Tier 5 Member</option>
                    <option value=4>Tier 4 Member</option>
                    <option value=3>Tier 3 Member</option>
                    <option value=2>Tier 2 Member</option>
                    <option value=1>Tier 1 Member</option>
                    <option value=0>Non-Member</option>
                </select>
            </div>

            <div class="leftContainer">
                <label class="label-sm">Username
                    <span class="required">*</span>
                </label>
                <input type="text" class="input-box form-control" id="ViewUserModal-Username" placeholder="User's Username" required>
            </div>
            <div class="rightContainer">
                <label class="label-sm">Password
                    <span class="required">*</span>
                </label>
                <input type="text" class="input-box form-control" id="ViewUserModal-Password" placeholder="User's Password" required>
            </div>

            <label class="label-sm">Points
                <span class="required">*</span>
            </label>
            <input type="number" min="0" class="input-box form-control" id="ViewUserModal-Points" value="0" required>

            <label class="label-sm">Admin Notes</label>
            <textarea type="textarea" class="input-box form-control" id="ViewUserModal-Notes" placeholder="Notes"></textarea>


            <div class="sectionBreak"></div>


            <div class="label-lg">Personal Info</div>

            <div class="picture" id='picture'></div>

            <div class="leftContainer">
                <label class="label-sm">First Name</label>
                <input type="text" class="input-box form-control" id="ViewUserModal-FirstName" placeholder="John">
            </div>
            <div class="rightContainer">
                <label class="label-sm">Last Name</label>
                <input type="text" class="input-box form-control" id="ViewUserModal-LastName" placeholder="Smith">
            </div>

            <label class="label-sm">Company Name</label>
            <input type="text" class="input-box form-control" id="ViewUserModal-CompanyName" placeholder="User's Company Name">

            <label class="label-sm">Bio</label>
            <textarea type="textarea" class="input-box form-control" id="ViewUserModal-Bio" placeholder="User's Bio"></textarea>

            <label class="label-sm">Email</label>
            <input type="text" class="input-box form-control" id="ViewUserModal-Email" placeholder="exmaple@domain.com">

            <label class="label-sm">Phone Number</label>
            <input type="tel" class="input-box form-control" id="ViewUserModal-PhoneNumber" placeholder="111-222-3333">

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
                user: null
            }
        },

        methods: {
            openModal(user) {
                //Data
                this.user = user;

                //Fields
                document.getElementById("ViewUserModal-MemberLevel").value = user.memberLevel;
                document.getElementById("ViewUserModal-Username").value = user.username;
                document.getElementById("ViewUserModal-Password").value = user.password;
                document.getElementById("ViewUserModal-Points").value = user.points;
                document.getElementById("ViewUserModal-Notes").value = user.notes;

                //document.getElementById("ViewUserModal-Picture").value = user.picture;
                document.getElementById("ViewUserModal-FirstName").value = user.firstName;
                document.getElementById("ViewUserModal-LastName").value = user.lastName;
                document.getElementById("ViewUserModal-CompanyName").value = user.companyName;
                document.getElementById("ViewUserModal-Bio").value = user.bio;
                document.getElementById("ViewUserModal-Email").value = user.email;
                document.getElementById("ViewUserModal-PhoneNumber").value = user.phoneNumber;

                //Scroll
                document.getElementById('ViewUserModal').scrollTo(0, 0);

                document.getElementById("ViewUserModal").style.opacity = "1.0";
                document.getElementById("ViewUserModal").style.visibility = "visible";
            },
            closeModal() {
                //Data
                this.user = null;

                document.getElementById("ViewUserModal").style.opacity = "0.0";
                document.getElementById("ViewUserModal").style.visibility = "hidden";
            },
            close() {
                this.closeModal();
                this.$parent.closeDimmer();
            },
            
            updateAccount(event) {
                var id = this.user.id;
                var memberLevel = document.getElementById("ViewUserModal-MemberLevel").value;
                var previousUsername = this.user.username;
                var username = document.getElementById("ViewUserModal-Username").value;
                var password = document.getElementById("ViewUserModal-Password").value;
                var points = document.getElementById("ViewUserModal-Points").value;
                var notes = document.getElementById("ViewUserModal-Notes").value;
                var picture = "";
                var firstName = document.getElementById("ViewUserModal-FirstName").value;
                var lastName = document.getElementById("ViewUserModal-LastName").value;
                var companyName = document.getElementById("ViewUserModal-CompanyName").value;
                var bio = document.getElementById("ViewUserModal-Bio").value;
                var email = document.getElementById("ViewUserModal-Email").value;
                var phoneNumber = document.getElementById("ViewUserModal-PhoneNumber").value;
                
                api.admin_UpdateAccount(id, memberLevel, previousUsername, username, password, points, notes, picture, firstName, lastName, companyName, bio, email, phoneNumber).then(
                    updateResult => {
                        if (updateResult == '404') 
                            this.$parent.$refs.Header.logout();
                        else {
                            if (username != updateResult.username)
                                alert('Username is taken');
                            else {
                                this.close();
                                this.$parent.updateUsers();
                            }
                        }
                    }
                );
                
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