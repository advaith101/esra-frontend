import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomePage from '../components/HomePage'
// import DashboardLayout from '../components/DashboardLayout'
import Login from '../components/Login'
// import Profile from '../components/ProfilePage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: "/signup/:roleID?",
    name: "signup",
    component:() => import('../components/SignUp')      
  },
  {
    path: '/home',
    name: 'Home',
    component:() => import('../components/HomePage'),
    children: [
      {
        path: '',
        name: "dashboard",
        component:() => import('../components/DashboardLayout')
      },
      {
        path:'profile',
        name:"profile",
        component:() => import('../components/ProfilePage')
      }
    ]
  },
  
]

const router = new VueRouter({
  routes
})

export default router
