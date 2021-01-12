import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../components/HomePage'
import DashboardLayout from '../components/DashboardLayout'
import Login from '../components/Login'
import Profile from '../components/ProfilePage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    children: [
      {
        path: '',
        name: "dashboard",
        component: DashboardLayout
      },
      {
        path:'profile',
        name:"profile",
        component: Profile
      }
    ]
  },
  
]

const router = new VueRouter({
  routes
})

export default router
