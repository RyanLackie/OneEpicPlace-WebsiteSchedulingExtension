<template>
    <div class="Login">

        <form id="loginForm">

            <div class="formGroup">
                <label for="email" class="register-section-label">Email</label>
                <input type="email" id="email" class="form-control" placeholder="Enter Your Email" required autofocus>
            </div>
            
            <div class="formGroup">
                <label for="password" class="register-section-label">Password</label>
                <input type="password" id="password" class="form-control" placeholder="Enter Your Password" required>
            </div>

            <button class="btn btn-outline-primary formButton" type="submit">Login</button>

        </form>

    </div>
</template>

<style scoped lang="scss">
    //Personal CSS
    @import "css/Login.css";
</style>

<script>
    import * as api from '@/services/api_access';

    export default {
         methods: {
            loginUser(event) {
                //Handle Login Submit
                var email = document.getElementById("email").value;
                var password = document.getElementById("password").value;
                
                //Login user
                api.loginUser(email, password).then(user => {
                    console.log(user);
                    if (user == "409")
                        alert("Incorrect username or password");
                    else {
                        this.$parent.$refs.Header.getLoggedInStatus();
                        this.$router.push('/');
                    }
                });
                
                //Prevent form submit refresh
                event.preventDefault();
            }
        },

        mounted() {
            document.getElementById('loginForm').addEventListener('submit', this.loginUser);
        }
    }
</script>
