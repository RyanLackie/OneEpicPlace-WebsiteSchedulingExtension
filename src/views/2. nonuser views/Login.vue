<template>
    <div class="Login">

        <form id="loginForm">

            <div class="formGroup">
                <label class="register-section-label">Username</label>
                <input type="text" id="username" class="form-control" placeholder='Enter Your Username' required autofocus>
            </div>
            
            <div class="formGroup">
                <label class="register-section-label">Password</label>
                <input type='password' id='password' class="form-control" placeholder='Enter Your Password' required>
            </div>

            <button class="btn btn-outline-primary formButton" type='submit'>Login</button>

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
                var identity = document.getElementById('username').value;
                var password = document.getElementById('password').value;
                
                //Login user
                api.getAccount(identity, password).then(
                    fetchedUser => {
                        if (fetchedUser == '404')
                            alert('Username or Password is incorrect');
                        else {
                            this.$parent.$refs.Header.memberLevel = fetchedUser.memberLevel;
                            this.$router.push('/');
                        }
                    }
                );
                
                //Prevent form submit refresh
                event.preventDefault();
            }
        },

        mounted() {
            document.getElementById('loginForm').addEventListener('submit', this.loginUser);
        }
    }
</script>
