<template>
    <div class="Profile">

        <form class="form-container" id="profileForm">

            <div class="label">Username</div>
            <input type="text" class="input-box form-control" id="username" placeholder="What would you like to be called?" required>
            
            <div class="label">Name</div>
            <div class="form-inline">
                <input type="text" class="input-box-sm-left form-control" id="firstName" placeholder="First Name">
                <input type="text" class="input-box-sm-right form-control" id="lastName" placeholder="Last Name">
            </div>

            <div class="label">Occupation</div>
            <input type="text" class="input-box form-control" id="occupation" placeholder="What do you do?">

            <div class="label">Description</div>
            <textarea type="text" class="input-box form-control" id="description" placeholder="Tell Everyone About yourself!"></textarea>

            <div class="label">Account Info</div>
            <div class="form-inline">
                <input type="text" class="input-box-sm-left form-control" id="email" placeholder="Email" required>
                <input type="text" class="input-box-sm-right form-control" id="password" placeholder="Password" required>
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
                api.getThisAccount().then(user => {
                    if (user == '409')
                        this.$parent.$refs.Header.logout();
                    else
                        document.getElementById('username').value = user.username;
                        document.getElementById('firstName').value = user.firstName;
                        document.getElementById('lastName').value = user.lastName;
                        document.getElementById("occupation").value = user.occupation;
                        document.getElementById('description').value = user.description;
                        document.getElementById('email').value = user.email;
                        document.getElementById('password').value = user.password;
                });
            },

            updateProfile(event) {
                //Handle Update Submit
                var username = document.getElementById('username').value;
                var firstName = document.getElementById('firstName').value;
                var lastName = document.getElementById('lastName').value;
                var occupation = document.getElementById('occupation').value;
                var description = document.getElementById('description').value;
                var email = document.getElementById('email').value;
                var password = document.getElementById('password').value;
                
                //Update user
                api.updateProfile(email, username, password, firstName, lastName, occupation, description).then(
                    updateResult => {
                        if (updateResult == '409')
                            this.$parent.$refs.Header.logout();
                        else {
                            this.fillProfile();
                            alert('Profile updated');

                            if (email != updateResult.email)
                                alert('Email is taken');
                            if (username != updateResult.username)
                                alert('Username is taken');
                        }
                    }
                );

                //Prevent form submit refresh
                event.preventDefault();
            }
        },

        mounted() {
            this.fillProfile();
            document.getElementById('profileForm').addEventListener('submit', this.updateProfile);
        }
    }

</script>
