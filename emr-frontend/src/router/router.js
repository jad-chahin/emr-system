import { createRouter, createWebHistory } from 'vue-router'

import LandingView from '../views/LandingView.vue'
import SuiteLayout from '../views/SuiteLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import SearchPatient from '../views/SearchPatient.vue'
import Patients from '../views/PatientsSearch.vue'
import PatientProfile from '../views/PatientProfile.vue'
import AddTreatment from '../views/AddTreatmentView.vue'
import Calendar from '../views/CalenderView.vue'
import MedicineDatabase from '../views/MedicineDatabaseView.vue'
import Login from '../views/LoginView.vue'
import Register from '../views/DoctorRegisterView.vue'

// If this is just a duplicate route for testing, keep it - but it should also hide navbar if it's the dashboard shell
import Tests from '../views/Dashboard.vue'

const routes = [
  // Public routes (show Navbar)
  { path: '/', component: LandingView },
  { path: '/search-patient', component: SearchPatient },
  { path: '/login', component: Login },
  { path: '/register', component: Register },

  // Suite routes (nested under /app)
  {
    path: '/app',
    component: SuiteLayout,
    meta: { layout: 'suite', requiresAuth: true },
    children: [
      { path: '', redirect: '/app/dashboard' },
      { path: 'dashboard', component: Dashboard },
      { path: 'patients', component: Patients },
      { path: 'patients/lookup', redirect: '/app/patients' },
      { path: 'calendar', component: Calendar, name: 'Calendar' },
      { path: 'medicine', component: MedicineDatabase },
      { path: 'test-dashboard', component: Tests },
      { path: 'patients/:patient', name: 'PatientProfile', component: PatientProfile },
      { path: 'patients/add-treatment/:patient', name: 'AddTreatment', component: AddTreatment },
    ],
  },

  // Legacy redirects (keep old paths working)
  { path: '/dashboard', redirect: '/app/dashboard' },
  { path: '/patients', redirect: '/app/patients' },
  { path: '/patients/lookup', redirect: '/app/patients' },
  { path: '/medicine', redirect: '/app/medicine' },
  { path: '/calendar', redirect: '/app/calendar' },
  { path: '/test-dashboard', redirect: '/app/test-dashboard' },
  { path: '/patients/:patient', redirect: (to) => `/app/patients/${to.params.patient}` },
  { path: '/patients/add-treatment/:patient', redirect: (to) => `/app/patients/add-treatment/${to.params.patient}` },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const hasToken = localStorage.getItem('token')
  if (to.path === '/' && hasToken) {
    return { path: '/app/dashboard' }
  }
  if ((to.path === '/login' || to.path === '/register') && hasToken) {
    return { path: '/app/dashboard' }
  }

  const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth)
  if (!requiresAuth) return true

  const token = localStorage.getItem('token')
  if (token) return true

  return {
    path: '/login',
    query: { redirect: to.fullPath },
  }
})

export default router
