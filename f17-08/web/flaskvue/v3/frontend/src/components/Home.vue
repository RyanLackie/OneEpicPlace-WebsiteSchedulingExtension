<template>
  <div>
    <v-jumbotron>
      <p>Home page</p>
      <p>Random number from backend: {{ randomNumber }}</p>
      <button @click="getRandom">New random number</button>
    </v-jumbotron>
  </div>
</template>

<script>
export default {
  data() {
    return {
      randomNumber: 0
    };
  },
  methods: {
    getRandom() {
      // this.randomNumber = this.getRandomInt(1, 100)
      this.randomNumber = this.getRandomFromBackend();
    },
    getRandomFromBackend() {
      const path = `https://epic-project-mastrots1.c9users.io/api/random`;
      this.$http
        .get(path, {
        })
        .then(response => {
          this.randomNumber = response.data.randomNumber;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    this.getRandom();
  }
};
</script>
