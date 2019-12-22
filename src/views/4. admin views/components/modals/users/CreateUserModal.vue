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
    //Personal CSS
    @import "./UserModals.css";
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                memberLevel: 0,
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
            openModal() {
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
                api.admin_CreateAccount(this.memberLevel, this.username, this.password, this.points, this.notes, this.picture, 
                                        this.firstName, this.lastName, this.companyName, this.bio, this.email, this.phoneNumber)
                    .then(createResult => {
                        if (createResult == '100') {
                            this.close();
                            this.$parent.updateUsers();
                        }
                        if (createResult == '404') {
                            this.$parent.$refs.Header.logout();
                        }
                        else if (createResult == '405') {
                            alert('Username is taken');
                        }
                    }
                );
                
                //Prevent submit refresh
                event.preventDefault();
            },

            memberLevelChanged() {
                switch(parseInt(this.memberLevel, 10)) {
                    case 0:
                        break;
                    case 1:
                        this.points = 100;
                        break;
                    case 2:
                        this.points = 200;
                        break;
                    case 3:
                        this.points = 300;
                        break;
                    case 4:
                        this.points = 500;
                        break;
                    case 5:
                        this.points = 700;
                        break;
                }
            }
        },

        mounted() {
            //Listen for modal submit
            document.getElementById('CreateUserModal-Form').addEventListener('submit', this.createUser);
        }
    }
</script>