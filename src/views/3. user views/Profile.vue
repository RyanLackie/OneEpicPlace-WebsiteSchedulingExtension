<template>
    <div class="Profile">

        <form class="form-container" id="profileForm">

            <div class="picture" id='picture'></div>
            
            <div class="label-lg">ABOUT</div>
            <div class="leftContainer">
                <div class="label">First Name</div>
                <input type="text" class="input-box form-control" id="firstName" placeholder="John">
            </div>
            <div class="rightContainer">
                <div class="label">Last Name</div>
                <input type="text" class="input-box form-control" id="lastName" placeholder="Smith">
            </div>

            <div class="label">Company Name</div>
            <input type="text" class="input-box form-control" id="companyName" placeholder="What do you do / Who do you work for?">

            <div class="label">Bio</div>
            <textarea type="text" class="input-box form-control" id="bio" placeholder="Tell Us About yourself!"></textarea>

            <div class="sectionBreak"></div>

            <div class="label-lg">CONTACT INFO</div>
            <div class="leftContainer">
                <div class="label">Email</div>
                <input type="email" class="input-box form-control" id="email" placeholder="exmaple@domain.com">
            </div>
            <div class="rightContainer">
                <div class="label">Phone Number</div>
                <input type="text" class="input-box form-control" id="phoneNumber" placeholder="111-222-3333">
            </div>

            <div class="sectionBreak"></div>

            <div class="label-lg">ACCOUNT INFO</div>
            <div class="leftContainer">
                <div class="label">Username
                    <span class="required">*</span>
                </div>
                <input type="text" class="input-box form-control" id="username" required>
            </div>
            <div class="rightContainer">
                <div class="label">Password
                    <span class="required">*</span>
                </div>
                <input type="text" class="input-box form-control" id="password" required>
            </div>

            <button class="btn btn-outline-primary formButton" type='submit'>Submit</button>

        </form>
        
    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "css/Profile.css";
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        methods: {
            fillProfile() {
                api.getAccount_local().then(
                    user => {
                        if (user == '404')
                            this.$parent.$refs.Header.logout();
                        else {
                            //document.getElementById('picture').value = user.picture;
                            document.getElementById('firstName').value = user.firstName;
                            document.getElementById('lastName').value = user.lastName;
                            document.getElementById("companyName").value = user.companyName;
                            document.getElementById('bio').value = user.bio;
                            document.getElementById('email').value = user.email;
                            document.getElementById('phoneNumber').value = user.phoneNumber;
                            document.getElementById('username').value = user.username;
                            document.getElementById('password').value = user.password;
                        }
                    }
                );
            },

            updateProfile(event) {
                var picture = "";// = document.getElementById('picture').value;
                var firstName = document.getElementById('firstName').value;
                var lastName = document.getElementById('lastName').value;
                var companyName = document.getElementById("companyName").value;
                var bio = document.getElementById('bio').value;
                var email = document.getElementById('email').value;
                var phoneNumber = document.getElementById('phoneNumber').value;
                var username = document.getElementById('username').value;
                var password = document.getElementById('password').value;
                
                api.updateAccount(picture, firstName, lastName, companyName, bio, email, phoneNumber, username, password).then(
                    updateResult => {
                        if (updateResult == '409')
                            this.$parent.$refs.Header.logout();
                        else {
                            this.fillProfile();
                            alert('Profile updated');

                            if (username != updateResult.username)
                                alert('Username is taken');
                        }
                    }
                );

                event.preventDefault();
            }
        },

        mounted() {
            this.fillProfile();
            document.getElementById('profileForm').addEventListener('submit', this.updateProfile);
        }
    }

</script>
