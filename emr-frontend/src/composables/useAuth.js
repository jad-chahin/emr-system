import { computed, ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL

const token = ref(localStorage.getItem('token'))
const user = ref(null)
const loading = ref(false)

const storedUser = localStorage.getItem('user')
if (storedUser) {
  try {
    user.value = JSON.parse(storedUser)
  } catch {
    user.value = null
  }
}

const isAuthed = computed(() => !!token.value)

const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  token.value = null
  user.value = null
}

const loadMe = async () => {
  const currentToken = localStorage.getItem('token')
  token.value = currentToken

  if (!currentToken) {
    user.value = null
    localStorage.removeItem('user')
    return null
  }

  loading.value = true
  try {
    const response = await fetch(`${API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    })

    if (response.status === 401 || response.status === 403) {
      clearAuth()
      return null
    }

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    user.value = data?.user ?? data
    localStorage.setItem('user', JSON.stringify(user.value))
    return user.value
  } catch {
    return null
  } finally {
    loading.value = false
  }
}

const logout = () => {
  clearAuth()
}

export const useAuth = () => ({
  isAuthed,
  token,
  user,
  loading,
  loadMe,
  logout,
})
