<template>
    <div class="Login">

        <form id="loginForm">

            <div class="formGroup">
                <label class="register-section-label">Username or Email</label>
                <input type="text" id="usernameOrEmail" class="form-control" placeholder='Enter Your Username Or Email' required autofocus>
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
                var identity = document.getElementById('usernameOrEmail').value;
                var password = document.getElementById('password').value;
                
                //Login user
                api.getAccount(identity, password).then(
                    fetchedUser => {
                        if (fetchedUser == '409')
                            alert('Incorrect identification');
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
            document.getElementById('loginForm').addEventListener('submit', this.loginUser);
        }
    }
</script>
