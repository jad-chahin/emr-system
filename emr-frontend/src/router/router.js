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
      { path: 'dashboard', component: Dashboard, meta: { roles: ['doctor'] } },
      { path: 'patients', component: Patients, meta: { roles: ['doctor'] } },
      { path: 'patients/lookup', redirect: '/app/patients' },
      { path: 'calendar', component: Calendar, name: 'Calendar', meta: { roles: ['doctor'] } },
      { path: 'medicine', component: MedicineDatabase, meta: { roles: ['doctor'] } },
      { path: 'test-dashboard', component: Tests, meta: { roles: ['doctor'] } },
      { path: 'patients/:patient', name: 'PatientProfile', component: PatientProfile, meta: { roles: ['doctor', 'patient'], patientSelf: true } },
      { path: 'patients/add-treatment/:patient', name: 'AddTreatment', component: AddTreatment, meta: { roles: ['doctor'] } },
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

const readStoredUser = () => {
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const decodeRoleFromToken = (token) => {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length < 2) return null
  try {
    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
    const payload = JSON.parse(atob(padded))
    return payload?.role || null
  } catch {
    return null
  }
}

const resolveAuthedHome = (role, userId) => {
  if (role === 'patient' && userId) return `/app/patients/${userId}`
  if (role === 'patient') return '/search-patient'
  return '/app/dashboard'
}

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const storedUser = readStoredUser()
  const role = storedUser?.role || decodeRoleFromToken(token)
  const userId = storedUser?._id || storedUser?.id
  const authedHome = resolveAuthedHome(role, userId)

  if (to.path === '/' && token) {
    return { path: authedHome }
  }
  if ((to.path === '/login' || to.path === '/register') && token) {
    return { path: authedHome }
  }

  const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth)
  if (!requiresAuth) return true

  if (!token) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }

  const allowedRoles = to.matched.flatMap((record) => record.meta?.roles || [])
  if (allowedRoles.length > 0 && (!role || !allowedRoles.includes(role))) {
    return { path: authedHome }
  }

  if (role === 'patient' && to.meta?.patientSelf && userId && to.params?.patient !== userId) {
    return { path: `/app/patients/${userId}` }
  }

  return true
})

export default router
