<template>
  <v-container fluid>
    <v-layout row>
      <v-flex xs4>
        <v-subheader>First Name:</v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-text-field
          name="input-1"
          label="First Name"
          v-model="firstName"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs4>
        <v-subheader>Last Name:</v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-text-field
          name="input-1"
          label="Last Name"
          v-model="lastName"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs4>
        <v-subheader>Phone:</v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-text-field
          name="input-1"
          label="Phone Number"
          v-model="phoneNumber"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs4>
        <v-subheader>Email:</v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-text-field
          name="input-1"
          label="Email Address"
          v-model="email"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs4>
        <v-subheader>Website:</v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-text-field
          name="input-1"
          label="Website URL"
          v-model="website"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs4>
        <v-subheader>Profile Picture:</v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-text-field
          name="input-1"
          label="Image URL"
          v-model="pictureLink"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-btn @click="profileSubmit">
      Submit Changes
    </v-btn>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    website: '',
    pictureLink: ''
  }),
  methods: {
    profileSubmit() {
      this.$store.commit("profileSubmit", {
        firstName: this.firstName,
        lastName: this.lastName,
        phoneNumber: this.phoneNumber,
        email: this.email,
        website: this.website,
        pictureLink: this.pictureLink
      });
    }
  }
};
</script>

<style>

</style>
