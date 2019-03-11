<template>
    <div class="SignUp">

        <form id="signUpForm">

            <div class="formGroup">
                <label class="register-section-label">Email</label>
                <input type="email" id="email" class="form-control" placeholder="Enter Your Email" required autofocus>
            </div>

            <div class="formGroup">
                <label class="register-section-label">Username</label>
                <input type="username" id="username" class="form-control" placeholder="Enter A Username" required autofocus>
            </div>
            
            <div class="formGroup">
                <label class="register-section-label">Password</label>
                <input type="password" id="password" class="form-control" placeholder="Enter A Password" required>
            </div>
            
            <div class="formGroup">
                <label class="register-section-label">First Name</label>
                <input id="firstName" class="form-control" placeholder="Enter Your First Name" required>
            </div>

            <div class="formGroup">
                <label class="register-section-label">Last Name</label>
                <input id="lastName" class="form-control" placeholder="Enter Your Last Name" required>
            </div>

            <div class="formGroup">
                <label class="register-section-label">Occupation</label>
                <input id="occupation" class="form-control" placeholder="Enter What You Do" required>
            </div>

            <div class="formGroup">
                <label class="register-section-label">Description</label>
                <textarea id="description" class="form-control" placeholder="Tell Us About Yourself" required></textarea>
            </div>

            <button class="btn btn-outline-primary formButton" type="submit">Sign Up</button>

        </form>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "css/SignUp.css";
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
        methods: {
            signUpUser(event) {
                //Handle Signup Submit
                var email = document.getElementById("email").value;
                var username = document.getElementById("username").value;
                var password = document.getElementById("password").value;
                var firstName = document.getElementById("firstName").value;
                var lastName = document.getElementById("lastName").value;
                var occupation = document.getElementById("occupation").value;
                var description = document.getElementById("description").value;
                    
                //SignUp user
                api.createAccount(email, username, password, firstName, lastName, occupation, description).then(
                    fetchedUser => {
                        if (fetchedUser == "409")
                            alert("Email is already in use");
                        else if (fetchedUser == "410")
                            alert("Username is already in use");
                        else {
                            this.$parent.$refs.Header.privilegeLevel = fetchedUser.privilege;
                            this.$router.push('/');
                        }
                    }
                );
                
                //Prevent form submit refresh
                event.preventDefault();
            }
        },

        mounted() {
            document.getElementById('signUpForm').addEventListener('submit', this.signUpUser);
        }
    }
</script>
