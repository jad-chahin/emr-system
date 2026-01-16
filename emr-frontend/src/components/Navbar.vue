<template>
  <header
    class="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--bg)]/80 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--bg)]/70"
  >
    <nav class="mx-auto max-w-[1320px] px-4 sm:px-6" aria-label="Main navigation">
      <div class="flex h-16 items-center justify-between gap-3">
        <!-- Left: Brand -->
        <div class="flex items-center gap-3">
          <!-- Mobile menu button -->
          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] text-[color:var(--muted)]
                   hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]
                   md:hidden"
            @click="toggleMenu"
            :aria-expanded="isOpen ? 'true' : 'false'"
            aria-controls="nav-menu"
            aria-label="Toggle navigation menu"
          >
            <svg v-if="!isOpen" class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>

          <RouterLink
            :to="homeLink"
            class="group inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            aria-label="Go to home"
            @click="closeMenu"
          >
            <span
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--accent)]/15 ring-1 ring-[color:var(--accent)]/25"
              aria-hidden="true"
            >
              <img src="../img/LogoCropped.png" alt="" class="h-6 w-6 object-contain opacity-95" />
            </span>

            <div class="hidden sm:block">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold tracking-tight text-[color:var(--text)]">EMR Suite</span>
                <span
                  class="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-2 py-0.5 text-[12px] text-[color:var(--muted)]"
                >
                  Clinical
                </span>
              </div>
              <div class="mt-0.5 text-[12px] text-[color:var(--muted)]">Secure clinical workspace</div>
            </div>
          </RouterLink>
        </div>

        <!-- Center: Primary links (desktop) -->
        <div class="hidden md:flex items-center gap-1">
          <NavLink v-if="isDoctor" to="/app/dashboard">Dashboard</NavLink>
          <NavLink v-if="!isAuthed" to="/search-patient">Patient Login</NavLink>
          <NavLink v-if="isDoctor" to="/patients">Patients</NavLink>
          <NavLink v-if="isDoctor" to="/calendar">Appointments</NavLink>
          <NavLink v-if="isPatient" :to="patientHome">My Profile</NavLink>
        </div>

        <!-- Right: Auth actions -->
        <div class="flex items-center gap-2">
          <!-- Signed-in status pill -->
          <span
            class="hidden sm:inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-1)] px-2.5 py-1 text-[12px]"
            :class="isAuthed ? 'text-[color:var(--success)]' : 'text-[color:var(--muted)]'"
          >
            {{ isAuthed ? 'Signed in' : 'Signed out' }}
          </span>

          <div class="hidden sm:flex items-center gap-2">
            <RouterLink
              v-if="!isAuthed"
              to="/register"
              class="inline-flex h-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                     px-4 text-sm font-semibold text-[color:var(--text)]
                     hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            >
              Doctor Register
            </RouterLink>

            <RouterLink
              v-if="!isAuthed"
              to="/login"
              class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:var(--accent)]
                     px-4 text-sm font-semibold text-[#06201B]
                     hover:brightness-110 active:brightness-95
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
            >
              Doctor Log in
            </RouterLink>

            <button
              v-if="isAuthed"
              type="button"
              @click="logout"
              class="inline-flex h-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                     px-4 text-sm font-semibold text-[color:var(--error)]
                     hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            >
              Log out
            </button>
          </div>

          <!-- Compact mobile auth button -->
          <button
            v-if="isAuthed"
            type="button"
            @click="logout"
            class="sm:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                   text-[color:var(--error)] hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            aria-label="Log out"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M10 7V5a2 2 0 0 1 2-2h7v18h-7a2 2 0 0 1-2-2v-2" stroke="currentColor" stroke-width="2" />
              <path
                d="M13 12H3m0 0 3-3m-3 3 3 3"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu panel -->
      <div
        id="nav-menu"
        class="md:hidden overflow-hidden transition-[max-height] duration-200 ease-out"
        :style="{ maxHeight: isOpen ? '420px' : '0px' }"
      >
        <div class="pb-4 pt-2">
          <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-2">
            <div class="grid gap-1">
              <MobileNavLink v-if="isDoctor" to="/app/dashboard" @click="closeMenu">Dashboard</MobileNavLink>
              <MobileNavLink v-if="!isAuthed" to="/search-patient" @click="closeMenu">Patient Login</MobileNavLink>
              <MobileNavLink v-if="isDoctor" to="/patients" @click="closeMenu">Patients</MobileNavLink>
              <MobileNavLink v-if="isDoctor" to="/calendar" @click="closeMenu">Appointments</MobileNavLink>
              <MobileNavLink v-if="isPatient" :to="patientHome" @click="closeMenu">My Profile</MobileNavLink>
            </div>

            <div class="my-2 border-t border-[color:var(--border)]"></div>

            <div class="grid gap-2 p-2">
              <RouterLink
                v-if="!isAuthed"
                to="/register"
                class="inline-flex h-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                       px-4 text-sm font-semibold text-[color:var(--text)]
                       hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                @click="closeMenu"
              >
                Doctor Register
              </RouterLink>

              <RouterLink
                v-if="!isAuthed"
                to="/login"
                class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:var(--accent)]
                       px-4 text-sm font-semibold text-[#06201B]
                       hover:brightness-110 active:brightness-95
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-1)]"
                @click="closeMenu"
              >
                Doctor Log in
              </RouterLink>

              <button
                v-if="isAuthed"
                type="button"
                @click="logout"
                class="inline-flex h-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                       px-4 text-sm font-semibold text-[color:var(--error)]
                       hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              >
                Log out
              </button>

              <div class="pt-1 text-center text-[12px] text-[color:var(--muted)]">
                {{ isAuthed ? 'Signed in' : 'Signed out' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed, defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isOpen = ref(false)
const token = ref(localStorage.getItem('token'))
const storedUser = ref(null)
const isAuthed = computed(() => !!token.value)
const decodeRoleFromToken = () => {
  const current = token.value
  if (!current) return null
  const parts = current.split('.')
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

const role = computed(() => storedUser.value?.role || decodeRoleFromToken())
const isDoctor = computed(() => isAuthed.value && role.value === 'doctor')
const isPatient = computed(() => role.value === 'patient')
const patientHome = computed(() => {
  const id = storedUser.value?._id || storedUser.value?.id
  return id ? `/app/patients/${id}` : '/search-patient'
})
const homeLink = computed(() => {
  if (!isAuthed.value) return '/'
  return isPatient.value ? patientHome.value : '/app/dashboard'
})

function toggleMenu() {
  isOpen.value = !isOpen.value
}
function closeMenu() {
  isOpen.value = false
}

function syncToken() {
  token.value = localStorage.getItem('token')
  const raw = localStorage.getItem('user')
  if (!raw) {
    storedUser.value = null
    return
  }
  try {
    storedUser.value = JSON.parse(raw)
  } catch {
    storedUser.value = null
  }
}

function logout() {
  localStorage.clear()
  syncToken()
  isOpen.value = false
  router.push('/')
}

onMounted(() => {
  syncToken()
  window.addEventListener('storage', syncToken)
})
onBeforeUnmount(() => {
  window.removeEventListener('storage', syncToken)
})

// Close mobile menu on navigation
watch(
  () => route.path,
  () => {
    isOpen.value = false
    syncToken()
  }
)

// Local link components
const NavLink = defineComponent({
  name: 'NavLink',
  props: { to: { type: String, required: true } },
  setup(props, { slots }) {
    return () =>
      h(
        RouterLink,
        {
          to: props.to,
          class:
            'inline-flex h-11 items-center rounded-xl px-3 text-sm font-semibold ' +
            'text-[color:var(--muted)] hover:text-[color:var(--text)] hover:bg-white/5 ' +
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]',
          'aria-current': route.path === props.to ? 'page' : null,
          onClick: closeMenu,
        },
        slots.default?.()
      )
  },
})

const MobileNavLink = defineComponent({
  name: 'MobileNavLink',
  props: { to: { type: String, required: true } },
  emits: ['click'],
  setup(props, { slots, emit }) {
    return () =>
      h(
        RouterLink,
        {
          to: props.to,
          class:
            'flex h-11 items-center rounded-xl px-3 text-sm font-semibold ' +
            (route.path === props.to
              ? 'bg-white/7 text-[color:var(--text)] border border-[color:var(--border)]'
              : 'text-[color:var(--muted)] hover:bg-white/5 hover:text-[color:var(--text)]'),
          onClick: () => emit('click'),
        },
        slots.default?.()
      )
  },
})
</script>

<style scoped>
img {
  display: block;
}
</style>
