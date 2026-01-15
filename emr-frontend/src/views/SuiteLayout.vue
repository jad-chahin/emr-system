<template>
  <div class="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
    <div
      v-if="mobileSidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      role="presentation"
      @click="mobileSidebarOpen = false"
    ></div>

    <aside
      class="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-[color:var(--border)] bg-[color:var(--surface-1)] transition-transform duration-200 ease-out lg:translate-x-0"
      :class="mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      aria-label="Suite navigation"
    >
      <div class="flex h-full flex-col">
        <div class="flex items-center gap-3 border-b border-[color:var(--border)] px-4 py-5">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--accent)]/15 ring-1 ring-[color:var(--accent)]/30">
            <svg class="h-5 w-5 text-[color:var(--accent)]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </span>
          <div>
            <div class="text-sm font-semibold">EMR Suite</div>
            <div class="text-xs text-[color:var(--muted)]">Secure clinical workspace</div>
          </div>
        </div>

        <nav class="flex-1 overflow-auto px-3 py-4">
          <div class="space-y-1">
            <RouterLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition"
              :class="isActive(item.path)
                ? 'border border-[color:var(--border)] bg-white/5 text-[color:var(--text)]'
                : 'text-[color:var(--muted)] hover:bg-white/5 hover:text-[color:var(--text)]'"
            >
              <span
                class="flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--muted)]"
              >
                <component :is="item.icon" class="h-5 w-5" />
              </span>
              <span>{{ item.label }}</span>
            </RouterLink>
          </div>
        </nav>

        <div class="border-t border-[color:var(--border)] p-4">
          <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3">
            <div class="text-xs text-[color:var(--muted)]">Workspace</div>
            <div class="mt-1 text-sm font-semibold">Clinical Operations</div>
          </div>
        </div>
      </div>
    </aside>

    <div class="min-h-screen lg:pl-[280px]">
      <header class="sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:var(--bg)]/90 backdrop-blur">
        <div class="flex h-16 items-center gap-3 px-4 sm:px-6">
          <button
            class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] text-[color:var(--muted)]
                   hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] lg:hidden"
            @click="mobileSidebarOpen = true"
            aria-label="Open navigation"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>

          <div class="flex-1">
            <div class="text-sm font-semibold">Suite Console</div>
            <div class="text-xs text-[color:var(--muted)]">Operational overview</div>
          </div>

          <div class="hidden items-center gap-3 sm:flex">
            <div class="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 py-1 text-xs text-[color:var(--muted)]">
              <span class="h-2 w-2 rounded-full bg-[color:var(--accent)]"></span>
              Signed in
            </div>
            <div class="text-sm font-semibold">{{ displayName }}</div>
            <button
              class="inline-flex h-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-4 text-sm font-semibold text-[color:var(--error)]
                     hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              type="button"
              @click="handleLogout"
            >
              Log out
            </button>
            <button
              class="inline-flex h-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-4 text-sm font-semibold text-[color:var(--text)]
                     hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              type="button"
              @click="toggleTheme"
            >
              {{ isDark ? 'Light mode' : 'Dark mode' }}
            </button>
          </div>
        </div>
      </header>

      <main class="px-4 pb-10 pt-6 sm:px-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, h, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const mobileSidebarOpen = ref(false)
const { user, logout } = useAuth()
const isDark = ref(true)

const displayName = computed(() => {
  const details = user.value || {}
  const composedName = [details.firstName, details.lastName].filter(Boolean).join(' ')
  return details.displayName || details.name || composedName || details.email || 'Account'
})

const handleLogout = () => {
  logout()
  router.push('/login')
}

const applyThemeClass = () => {
  const value = isDark.value ? 'dark' : 'light'
  localStorage.setItem('emr_theme', value)
  document.documentElement.classList.remove('theme-dark', 'theme-light')
  document.documentElement.classList.add(value === 'dark' ? 'theme-dark' : 'theme-light')
  window.dispatchEvent(new Event('emr-theme-change'))
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  applyThemeClass()
}

const navItems = computed(() => [
  {
    label: 'Dashboard',
    path: '/app/dashboard',
    icon: () =>
      h('svg', { class: 'h-5 w-5', viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' }, [
        h('path', {
          d: 'M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-11h7V4h-7v5Z',
          fill: 'currentColor',
          opacity: '0.9',
        }),
      ]),
  },
  {
    label: 'Patients',
    path: '/app/patients',
    icon: () =>
      h('svg', { class: 'h-5 w-5', viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' }, [
        h('path', { d: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z', fill: 'currentColor', opacity: '0.9' }),
        h('path', { d: 'M4 20a8 8 0 0 1 16 0', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round' }),
      ]),
  },
  {
    label: 'Appointments',
    path: '/app/calendar',
    icon: () =>
      h('svg', { class: 'h-5 w-5', viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' }, [
        h('path', { d: 'M7 3v3M17 3v3', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round' }),
        h('path', { d: 'M4 8h16', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round' }),
        h('path', {
          d: 'M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z',
          stroke: 'currentColor',
          'stroke-width': '2',
        }),
      ]),
  },
  {
    label: 'Medicine DB',
    path: '/app/medicine',
    icon: () =>
      h('svg', { class: 'h-5 w-5', viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' }, [
        h('path', { d: 'M8 7h8M8 11h8M8 15h5', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round' }),
        h('path', {
          d: 'M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
          stroke: 'currentColor',
          'stroke-width': '2',
        }),
      ]),
  },
])

const isActive = (path) => route.path === path || route.path.startsWith(`${path}/`)

const savedTheme = localStorage.getItem('emr_theme')
if (savedTheme) {
  isDark.value = savedTheme === 'dark'
}
applyThemeClass()
</script>
