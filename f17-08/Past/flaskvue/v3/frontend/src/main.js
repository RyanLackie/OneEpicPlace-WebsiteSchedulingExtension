// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './App'
import router from './router'
import Axios from 'axios'
import { store } from './store/store'

import DaySpanVuetify from 'dayspan-vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'dayspan-vuetify/dist/lib/dayspan-vuetify.min.css'

import fullCalendar from 'vue-fullcalendar'
import 'vue-event-calendar/dist/style.css'
import vueEventCalendar from 'vue-event-calendar'

Vue.config.productionTip = false

Vue.use(Vuetify)

Vue.use(DaySpanVuetify, {
  methods: {
    getDefaultEventColor: () => '#303030'
  }
});

Vue.use(vueEventCalendar, {
  locale: 'en',
  color: '#1976d2'
});

Vue.prototype.$http = Axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store: store,
  router,
  components: { App },
  template: '<App/>'
})
