<template>
    <div class="Profile">

        <div class="form-container" id="profileForm">
            
            <div class="label">
                Name
            </div>
            <div class="form-inline">
                <input type="text" class="input-box-sm-left form-control" id="firstName" placeholder="First Name">
                <input type="text" class="input-box-sm-right form-control" id="lastName" placeholder="Last Name">
            </div>

            <div class="label">
                Occupation
            </div>
           <input type="text" class="input-box form-control" id="occupation" placeholder="What do you do?">

            <div class="label">
                Description
            </div>
           <textarea type="text" class="input-box form-control" id="description" placeholder="Tell Everyone About yourself!"></textarea>

            <div class="label">
                Account Info
            </div>
            <div class="form-inline">
                <input type="text" class="input-box-sm-left form-control" id="email" placeholder="Email">
                <input type="text" class="input-box-sm-right form-control" id="password" placeholder="Password">
            </div>

            <button class="btn btn-outline-primary formButton" @click="updateProfile()">Submit</button>

        </div>
        
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
                var user = api.getUser()

                document.getElementById('firstName').value = user.firstName;
                document.getElementById('lastName').value = user.lastName;
                document.getElementById("occupation").value = user.occupation;
                document.getElementById('description').value = user.description;
                document.getElementById('email').value = user.email;
                document.getElementById('password').value = user.password;
            },

            updateProfile() {
                //Handle Update Submit
                var firstName = document.getElementById("firstName").value;
                var lastName = document.getElementById("lastName").value;
                var occupation = document.getElementById("occupation").value;
                var description = document.getElementById("description").value;
                var newEmail = document.getElementById("email").value;
                var newPassword = document.getElementById("password").value;
                
                //Update user
                api.updateProfile(newEmail, newPassword, firstName, lastName, occupation, description).then(updateResult => {
                    if (updateResult == '408') {
                        console.log("Null user");
                    }
                    else if (updateResult == '409') {
                        alert("Incorrect username or password");
                    }
                    else if (updateResult == '410') {
                        alert("New email was already in use");
                    }
                    else {
                        alert("Profile updated");
                        api.setUser(updateResult);
                    }
                });
            }
        },

        mounted() {
            this.fillProfile();
        }
    }

</script>
