import Vue from 'vue'
import Router from 'vue-router'

//1. shaired views
import Home from './views/1. shaired views/Home.vue'
import About from './views/1. shaired views/About.vue'

//2. nonuser views
import SignUp from './views/2. nonuser views/SignUp.vue'
import Login from './views/2. nonuser views/Login.vue'

//3. user views
import Profile from './views/3. user views/Profile.vue'
import Reserve from './views/3. user views/Reserve.vue'
import Schedule from './views/3. user views/Schedule.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        //1. shaired views
        {
            path: '/', name: 'home', component: Home
        },
        {
            path: '/about', name: 'about', component: About
        },

        //2. nonuser views
        {
            path: '/signup', name: 'signup', component: SignUp
        },
        {
            path: '/login', name: 'login', component: Login
        },

        //3. user views
        {
            path: '/profile', name: 'profile', component: Profile
        },
        {
            path: '/reserve', name: 'reserve', component: Reserve
        },
        {
            path: '/schedule', name: 'schedule', component: Schedule
        }
    ]
})
