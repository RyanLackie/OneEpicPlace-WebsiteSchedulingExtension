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

            <label class="label-sm">Member Level
                <span class="required">*</span>
            </label>
            <select class="form-control" 
            v-model="memberLevel" @change="memberLevelChanged()" required>
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
                <input type="text" class="input-box form-control" placeholder="User's Username" v-model="username" required>
            </div>
            <div class="rightContainer">
                <label class="label-sm">Password
                    <span class="required">*</span>
                </label>
                <input type="text" class="input-box form-control" placeholder="User's Password" v-model="password" required>
            </div>

            <label class="label-sm">Points
                <span class="required">*</span>
            </label>
            <input type="number" min="0" class="input-box form-control" v-model="points" required>

            <label class="label-sm">Admin Notes</label>
            <textarea type="textarea" class="input-box form-control" placeholder="Notes" v-model="notes"></textarea>


            <div class="sectionBreak"></div>


            <div class="label-lg">Personal Info</div>

            <div class="picture" id='picture'></div>

            <div class="leftContainer">
                <label class="label-sm">First Name</label>
                <input type="text" class="input-box form-control" placeholder="John" v-model="firstName">
            </div>
            <div class="rightContainer">
                <label class="label-sm">Last Name</label>
                <input type="text" class="input-box form-control" placeholder="Smith" v-model="lastName">
            </div>

            <label class="label-sm">Company Name</label>
            <input type="text" class="input-box form-control" placeholder="User's Company Name" v-model="companyName">

            <label class="label-sm">Bio</label>
            <textarea type="textarea" class="input-box form-control" placeholder="User's Bio" v-model="bio"></textarea>

            <label class="label-sm">Email</label>
            <input type="text" class="input-box form-control" placeholder="exmaple@domain.com" v-model="email">

            <label class="label-sm">Phone Number</label>
            <input type="tel" class="input-box form-control" placeholder="111-222-3333" v-model="phoneNumber">

            <button class="btn btn-success leftBtn" type="submit">Submit</button>
            <button class="btn btn-secondary rightBtn" type="button" @click="close()">Cancel</button>
        </form>

    </div>
</template>

<style scoped lang="scss">
    // Personal CSS
    @import "./UserModals.css";
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                id: 0,
                memberLevel: 0,
                previousUsername: '',
                username: '',
                password: '',
                points: 0,
                notes: '',

                picture: '',
                firstName: '',
                lastName: '',
                companyName: '',
                bio: '',
                email: '',
                phoneNumber: ''
            }
        },

        methods: {
            openModal(user) {
                // Data
                this.id = user.id;
                this.memberLevel = user.memberLevel;
                this.previousUsername = user.username;
                this.username = user.username;
                this.password = user.password;
                this.points = user.points;
                this.notes = user.notes;

                this.picture = user.picture;
                this.firstName = user.firstName;
                this.lastName = user.lastName;
                this.companyName = user.companyName;
                this.bio = user.bio;
                this.email = user.email;
                this.phoneNumber = user.phoneNumber;

                // Scroll
                document.getElementById('ViewUserModal').scrollTo(0, 0);

                document.getElementById("ViewUserModal").style.opacity = "1.0";
                document.getElementById("ViewUserModal").style.visibility = "visible";
            },
            closeModal() {
                // Data
                // this.user = null;

                document.getElementById("ViewUserModal").style.opacity = "0.0";
                document.getElementById("ViewUserModal").style.visibility = "hidden";
            },
            close() {
                this.closeModal();
                this.$parent.closeDimmer();
            },
            
            updateAccount(event) {
                api.admin_UpdateAccount(this.id, this.memberLevel, this.previousUsername, this.username, this.password, this.points, this.notes, 
                                        this.picture, this.firstName, this.lastName, this.companyName, this.bio, this.email, this.phoneNumber)
                .then(
                    updateResult => {
                        if (updateResult == '404') 
                            this.$parent.$refs.Header.logout();
                        else {
                            if (username != updateResult.username) {
                                alert('Username is taken');
                            }
                            else {
                                this.close();
                                this.$parent.updateUsers();
                            }
                        }
                    }
                );
                
                // Prevent submit refresh
                event.preventDefault();
            }
        },

        mounted() {
            // Listen for modal submit
            document.getElementById('ViewUserModal-Form').addEventListener('submit', this.updateAccount);
        }
    }
</script>