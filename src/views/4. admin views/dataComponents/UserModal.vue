<template>
    <div class="PopUpModal UserModal" id="UserModal" aria-hidden="true">
                
        <div class="modal-header">
            <div v-if="modalType === 'create'" class="text">Create User</div>
            <div v-if="modalType === 'update'" class="text">Update User</div>
            
            <button type="button" class="close" aria-label="Close" @click="close()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <form id="UserModal-Form">

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

            <div class="leftContainer">
                <label class="label-sm">This Month's Points
                    <span class="required">*</span>
                </label>
                <input type="number" min="0" class="input-box form-control" v-model="points_1" required>
            </div>
            <div class="rightContainer">
                <div class="label-sm">{{getMonthName(pointsLastUpdated.split('-')[1], 0)}}</div>
            </div>

            <div class="leftContainer">
                <label class="label-sm">1 Month Old Points
                    <span class="required">*</span>
                </label>
                <input type="number" min="0" class="input-box form-control" v-model="points_2" required>
            </div>
            <div class="rightContainer">
                <div class="label-sm">{{getMonthName(pointsLastUpdated.split('-')[1], -1)}}</div>
            </div>

            <div class="leftContainer">
                <label class="label-sm">2 Month Old Points
                    <span class="required">*</span>
                </label>
                <input type="number" min="0" class="input-box form-control" v-model="points_3" required>
            </div>
            <div class="rightContainer">
                <div class="label-sm">{{getMonthName(pointsLastUpdated.split('-')[1], -2)}}</div>
            </div>

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
    .userModal {
        height: 90%;
        max-height: 1040px;
    }
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        data() {
            return {
                modalType: null,

                id: null,                // For update
                memberLevel: 0,
                previousUsername: null,  // For update
                username: null,
                password: null,
                points_1: 0,
                points_2: 0,
                points_3: 0,
                pointsLastUpdated: new Date().toJSON().slice(0, 10),
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
            openModal(modalType, user) {
                this.modalType = modalType;

                // For update
                if (this.modalType === 'update') {
                    this.id = user.id;
                    this.memberLevel = user.memberLevel;
                    this.previousUsername = user.username;
                    this.username = user.username;
                    this.password = user.password;
                    this.points_1 = user.points_1;
                    this.points_2 = user.points_2;
                    this.points_3 = user.points_3;
                    this.pointsLastUpdated = user.pointsLastUpdated;
                    this.notes = user.notes;

                    this.picture = user.picture;
                    this.firstName = user.firstName;
                    this.lastName = user.lastName;
                    this.companyName = user.companyName;
                    this.bio = user.bio;
                    this.email = user.email;
                    this.phoneNumber = user.phoneNumber;
                }
                // For create
                else {
                    this.memberLevel = 0;
                    this.username = null;
                    this.password = null;
                    this.points_1 = 0;
                    this.points_2 = 0;
                    this.points_3 = 0;
                    this.pointsLastUpdated = new Date().toJSON().slice(0, 10);
                    this.notes = '';

                    this.picture = '';
                    this.firstName = '';
                    this.lastName = '';
                    this.companyName = '';
                    this.bio = '';
                    this.email = '';
                    this.phoneNumber = '';
                }

                //Scroll
                document.getElementById('UserModal').scrollTo(0, 0);

                document.getElementById("UserModal").style.opacity = "1.0";
                document.getElementById("UserModal").style.visibility = "visible";
            },
            closeModal() {                
                document.getElementById("UserModal").style.opacity = "0.0";
                document.getElementById("UserModal").style.visibility = "hidden";
            },
            close() {
                this.closeModal();
                this.$parent.closeDimmer();
            },

            handelSubmit(event) {
                if (this.modalType === 'create') {
                    this.createUser();
                }
                else if (this.modalType === 'update') {
                    this.updateAccount();
                }

                //Prevent submit refresh
                event.preventDefault();
            },
            
            createUser() {
                api.admin_CreateAccount(this.memberLevel, this.username, this.password, this.points_1, this.points_2, this.points_3, this.pointsLastUpdated,
                                        this.notes, this.picture, this.firstName, this.lastName, this.companyName, this.bio, this.email, 
                                        this.phoneNumber)
                .then(
                    createResult => {
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
            },

            updateAccount() {
                api.admin_UpdateAccount(this.id, this.memberLevel, this.previousUsername, this.username, this.password, this.points_1, this.points_2, this.points_3, this.pointsLastUpdated,
                                        this.notes, this.picture, this.firstName, this.lastName, this.companyName, this.bio, this.email, this.phoneNumber)
                .then(
                    updateResult => {
                        if (updateResult == '404') 
                            this.$parent.$refs.Header.logout();
                        else {
                            if (this.username != updateResult.username) {
                                alert('Username is taken');
                            }
                            else {
                                this.close();
                                this.$parent.updateUsers();
                            }
                        }
                    }
                );
            },

            memberLevelChanged() {
                switch(parseInt(this.memberLevel, 10)) {
                    case 0:
                        break;
                    case 1:
                        this.points_1 = 100;
                        break;
                    case 2:
                        this.points_1 = 200;
                        break;
                    case 3:
                        this.points_1 = 300;
                        break;
                    case 4:
                        this.points_1 = 500;
                        break;
                    case 5:
                        this.points_1 = 700;
                        break;
                }
            },

            getMonthName(month, offset) {
                switch(parseInt(month, 10) + parseInt(offset, 10)) {
                    case -2: return 'October';
                    case -1: return 'November';
                    case 0: return 'December';
                    case 1: return 'January';
                    case 2: return 'February';
                    case 3: return 'March';
                    case 4: return 'April';
                    case 5: return 'May';
                    case 6: return 'June';
                    case 7: return 'July';
                    case 8: return 'August';
                    case 9: return 'September';
                    case 10: return 'October';
                    case 11: return 'November';
                    case 12: return 'December';
                }
            },
        },

        mounted() {
            //Listen for modal submit
            document.getElementById('UserModal-Form').addEventListener('submit', this.handelSubmit);
        }
    }
</script>