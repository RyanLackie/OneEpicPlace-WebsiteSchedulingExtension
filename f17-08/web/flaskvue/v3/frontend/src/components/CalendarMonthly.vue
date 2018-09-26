<template>
    <vue-event-calendar
      :events="demoEvents"
      @day-changed="handleDayChanged"
      @month-changed="handleMonthChanged"
    ></vue-event-calendar>
</template>

<script>
let today = new Date();
export default {
  data() {
    return {
    };
  },
  methods: {
    showAddEventForm() {
      //add an event form
    },
    handleDayChanged(data) {},
    handleMonthChanged(data) {}
  },
  computed: {
    demoEvents() {
      return this.$store.state.demoEvents;
    }
  }
};
</script>
