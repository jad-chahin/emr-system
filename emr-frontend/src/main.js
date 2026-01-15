import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import { useAuth } from './composables/useAuth'
import './style.css'

// Apply theme class so CSS variables exist
const savedTheme = localStorage.getItem('emr_theme') || 'dark'
document.documentElement.classList.remove('theme-dark', 'theme-light')
document.documentElement.classList.add(savedTheme === 'light' ? 'theme-light' : 'theme-dark')

const app = createApp(App)
app.use(router)
app.mount('#app')

const { loadMe } = useAuth()
loadMe()
