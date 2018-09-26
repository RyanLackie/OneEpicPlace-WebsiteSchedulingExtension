import Vue from 'vue'
import Router from 'vue-router'

// Adds each component to the router
// These components were unused therefore commented out

import Profile from '@/components/Profile.vue'
import ProfileEdit from '@/components/ProfileEdit.vue'
import CalendarMonthly from '@/components/CalendarMonthly.vue'
import CalendarWeekly from '@/components/CalendarWeekly.vue'
import CalendarDaily from '@/components/CalendarDaily.vue'
import FullCalendar from '@/components/FullCalendar.vue'

const routerOptions = [
  { path: '/', component: 'Home' },
  { path: '/about', component: 'About' },
  { path: '/login', component: 'Login' },
  { path: '/member', component: 'Member' },
  { path: '/admin', component: 'Admin' },
  { path: '*', component: 'NotFound' }
]

// Imports all of the components and their locations
const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/components/${route.component}.vue`)
  }
})

Vue.use(Router)

export default new Router({
  routes,
  mode: 'history'
})
