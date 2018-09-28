<template>
    <v-app dark>
        <v-layout justify-center align-center>
                <v-card style="padding: 0px 50px" color="gray">
                    <v-layout justify-center>
                        <form method="post" action="/login">
                            <v-text-field label="Username" v-model="username" :rules="usernameRules" required></v-text-field>
                            <v-text-field label="Password" v-model="password" :rules="passwordRules" :append-icon="passvis ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (passvis = !passvis)" :type="passvis ? 'text' : 'password'" required></v-text-field>
                            <v-btn @click.prevent="login">login</v-btn>
                            <v-btn @click.stop="clear">clear</v-btn>
                        </form>
                    </v-layout>
                </v-card>
                <v-alert v-if="errorMessage != ''" type="error" :value="true">
                    {{ errorMessage }}
                </v-alert>
        </v-layout>
    </v-app>
</template>

<script>
export default {
  data: () => ({
    passvis: false,
    username: "",
    usernameRules: [ v => !!v || 'Username is required' ],
    password: "",
    passwordRules: [ v => !!v || 'Password is required' ],
    errorMessage: "",
    userreturn: "",
    passreturn: ""
  }),
  methods: {
    login() {
      const path = `https://epic-project-mastrots1.c9users.io/api/login`;
      this.$http
        .post(path, {
          username: this.username,
          password: this.password
        })
        .then(response => {
          if (response.data.success == true) {
            this.$router.push({ path: "/member", props: response.data });
            sessionStorage.setItem("loginInfo", {
              username: response.data.username,
              hashedPassword: response.data.password
            });
            this.$store.state.isLoggedin = true;

            // sessionStorage.clear

            // sessionStorage.getItem('loginInfo').username
            // this.userreturn = response.data.username;
            // this.passreturn = response.data.password;
          } else {
            this.errorMessage = response.data.error;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style>

</style>