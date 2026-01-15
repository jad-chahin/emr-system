<template>
  <div class="min-h-screen" :class="rootThemeClass">
    <!-- App background (calm, minimal) -->
    <div class="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
      <!-- Mobile sidebar backdrop -->
      <div
        v-if="!embedded && mobileSidebarOpen"
        class="fixed inset-0 z-40 bg-black/50"
        role="presentation"
        @click="mobileSidebarOpen = false"
      />

      <!-- Sidebar -->
      <aside
        v-if="!embedded"
        class="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-[color:var(--border)] bg-[color:var(--surface-1)]"
        :class="[
          sidebarCollapsed ? 'lg:w-[88px]' : 'lg:w-[280px]',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'transform transition-transform duration-200 ease-out lg:translate-x-0'
        ]"
        aria-label="Primary navigation"
      >
        <div class="h-full flex flex-col">
          <!-- Brand -->
          <div class="px-4 py-4 border-b border-[color:var(--border)]">
            <div class="flex items-center gap-3">
              <div class="h-9 w-9 rounded-xl bg-[color:var(--accent)]/15 ring-1 ring-[color:var(--accent)]/30 flex items-center justify-center">
                <!-- simple logo mark -->
                <svg class="h-5 w-5 text-[color:var(--accent)]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>

              <div class="min-w-0" v-if="!sidebarCollapsed">
                <div class="flex items-center gap-2">
                  <span class="font-semibold tracking-tight">EMR Suite</span>
                  <span class="text-[12px] px-2 py-0.5 rounded-full bg-[color:var(--surface-2)] border border-[color:var(--border)] text-[color:var(--muted)]">
                    Clinical
                  </span>
                </div>
                <p class="text-[12px] text-[color:var(--muted)] truncate">Secure clinical workspace</p>
              </div>
            </div>
          </div>

          <!-- New button -->
          <div class="px-3 py-3">
            <div class="relative">
              <button
                class="w-full h-11 rounded-xl bg-[color:var(--accent)] text-[#06201B] font-semibold
                       hover:brightness-110 active:brightness-95
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-1)]
                       flex items-center justify-center gap-2"
                @click="toggleNewMenu"
                :aria-expanded="newMenuOpen ? 'true' : 'false'"
                aria-haspopup="menu"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span v-if="!sidebarCollapsed">New</span>
              </button>

              <div
                v-if="newMenuOpen && !sidebarCollapsed"
                class="absolute left-0 right-0 mt-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] shadow-[0_8px_24px_rgba(0,0,0,0.18)] overflow-hidden"
                role="menu"
                aria-label="Create new"
              >
                <button class="w-full px-4 py-3 text-left hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                        role="menuitem"
                        @click="createNew('patient')">
                  New Patient
                  <span class="block text-[12px] text-[color:var(--muted)]">Create a new patient profile</span>
                </button>
                <button class="w-full px-4 py-3 text-left hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                        role="menuitem"
                        @click="createNew('appointment')">
                  New Appointment
                  <span class="block text-[12px] text-[color:var(--muted)]">Schedule a new appointment</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Nav -->
          <nav class="flex-1 px-2 pb-3 overflow-auto">
            <div class="space-y-1">
              <NavItem
                label="Dashboard"
                :collapsed="sidebarCollapsed"
                :active="routePath === '/' || routePath === '/dashboard'"
                @click="navigate('/dashboard')"
              >
                <template #icon>
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-11h7V4h-7v5Z" fill="currentColor" opacity="0.9"/>
                  </svg>
                </template>
              </NavItem>

              <NavItem
                label="Patients"
                :collapsed="sidebarCollapsed"
                :active="routePath.startsWith('/patients')"
                @click="navigate('/patients')"
              >
                <template #icon>
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" fill="currentColor" opacity="0.9"/>
                    <path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </template>
              </NavItem>

              <NavItem
                label="Appointments"
                :collapsed="sidebarCollapsed"
                :active="routePath.startsWith('/calendar') || routePath.startsWith('/appointments')"
                @click="navigate('/calendar')"
              >
                <template #icon>
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M7 3v3M17 3v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M4 8h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 12h4M8 16h7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </template>
              </NavItem>

              <NavItem label="Tasks" :collapsed="sidebarCollapsed" :active="routePath.startsWith('/tasks')" @click="softToast('Tasks opening soon', 'info')">
                <template #icon>
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 11l2 2 4-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7 4h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </template>
              </NavItem>

              <NavItem label="Messages" :collapsed="sidebarCollapsed" :active="routePath.startsWith('/messages')" @click="softToast('Messages opening soon', 'info')">
                <template #icon>
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 6h16v10H7l-3 3V6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  </svg>
                </template>
              </NavItem>

              <div class="pt-2 mt-2 border-t border-[color:var(--border)] opacity-90"></div>

              <NavItem label="Billing / Claims" :collapsed="sidebarCollapsed" :active="routePath.startsWith('/billing')" @click="softToast('Billing/Claims opening soon', 'info')">
                <template #icon>
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M7 7h10v14l-2-1-3 1-3-1-2 1V7Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M9 3h6v4H9V3Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </template>
              </NavItem>

              <NavItem label="Reports / Analytics" :collapsed="sidebarCollapsed" :active="routePath.startsWith('/reports')" @click="softToast('Reports opening soon', 'info')">
                <template #icon>
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M4 19h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M8 15v-5M12 15V7M16 15v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </template>
              </NavItem>

              <NavItem label="Settings" :collapsed="sidebarCollapsed" :active="routePath.startsWith('/settings')" @click="softToast('Settings opening soon', 'info')">
                <template #icon>
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M19.4 15a7.7 7.7 0 0 0 .1-2l2-1.2-2-3.4-2.3.7a7.7 7.7 0 0 0-1.7-1L15 4H9l-.5 3a7.7 7.7 0 0 0-1.7 1L4.5 7.4l-2 3.4 2 1.2a7.7 7.7 0 0 0 .1 2l-2 1.2 2 3.4 2.3-.7a7.7 7.7 0 0 0 1.7 1L9 20h6l.5-3a7.7 7.7 0 0 0 1.7-1l2.3.7 2-3.4-2-1.2Z"
                          stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  </svg>
                </template>
              </NavItem>
            </div>
          </nav>

          <!-- Sidebar footer -->
          <div class="p-3 border-t border-[color:var(--border)]">
            <button
              class="w-full h-11 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                     hover:bg-white/5
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              @click="sidebarCollapsed = !sidebarCollapsed"
              :aria-label="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
            >
              <div class="flex items-center justify-center gap-2 text-[color:var(--muted)]">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path :d="sidebarCollapsed ? 'M10 7l5 5-5 5' : 'M14 7l-5 5 5 5'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span v-if="!sidebarCollapsed" class="text-sm">Collapse</span>
              </div>
            </button>
          </div>
        </div>
      </aside>

      <!-- Content wrapper -->
      <div :class="embedded ? '' : (sidebarCollapsed ? 'lg:pl-[88px]' : 'lg:pl-[280px]')" class="min-h-screen">
        <!-- Top bar -->
        <header
          v-if="!embedded"
          class="sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:var(--bg)]/80 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--bg)]/70"
        >
          <div class="h-16 px-4 sm:px-6 flex items-center gap-3">
            <!-- Mobile menu -->
            <button
              class="lg:hidden h-11 w-11 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                     hover:bg-white/5
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              @click="mobileSidebarOpen = true"
              aria-label="Open navigation menu"
            >
              <svg class="h-5 w-5 mx-auto text-[color:var(--muted)]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>

            <!-- Brand (compact for topbar) -->
            <div class="hidden md:flex items-center gap-2 min-w-[220px]">
              <span class="font-semibold tracking-tight">EMR Suite</span>
              <span class="text-[12px] px-2 py-0.5 rounded-full bg-[color:var(--surface-1)] border border-[color:var(--border)] text-[color:var(--muted)]">
                Clinical
              </span>
            </div>

            <!-- Global search -->
            <div class="flex-1 max-w-[720px] relative">
              <label class="sr-only" for="global-search">Search</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M21 21l-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </span>
                <input
                  id="global-search"
                  v-model="searchQuery"
                  @focus="searchOpen = true"
                  @keydown.down.prevent="searchMove(1)"
                  @keydown.up.prevent="searchMove(-1)"
                  @keydown.enter.prevent="searchSelectActive()"
                  @keydown.esc.prevent="closeSearch()"
                  type="text"
                  placeholder="Search patients, appointments, tasks"
                  class="w-full h-11 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                         pl-11 pr-28 text-sm placeholder:text-[color:var(--muted)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                  autocomplete="off"
                  aria-autocomplete="list"
                  aria-expanded="true"
                />
                <div class="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[color:var(--muted)] hidden sm:flex items-center gap-2">
                  <span class="px-2 py-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-2)]">Ctrl+K</span>
                </div>
              </div>

              <!-- Typeahead -->
              <div
                v-if="searchOpen && (searchQuery.trim().length > 0 || recentSearches.length > 0)"
                class="absolute mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                       shadow-[0_8px_24px_rgba(0,0,0,0.18)] overflow-hidden"
                role="listbox"
                aria-label="Search suggestions"
              >
                <div class="px-4 py-2 text-[12px] text-[color:var(--muted)] border-b border-[color:var(--border)]">
                  {{ searchQuery.trim().length ? 'Results' : 'Recent searches' }}
                </div>

                <div v-if="isSearchLoading" class="p-4 space-y-3">
                  <SkeletonLine />
                  <SkeletonLine />
                  <SkeletonLine class="w-2/3" />
                </div>

                <template v-else>
                  <button
                    v-for="(item, idx) in displayedSearchItems"
                    :key="item.id"
                    class="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center justify-between gap-4
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                    :class="idx === activeSearchIndex ? 'bg-white/5' : ''"
                    role="option"
                    @mousedown.prevent="selectSearchItem(item)"
                  >
                    <div class="min-w-0">
                      <div class="text-sm font-medium truncate">{{ item.title }}</div>
                      <div class="text-[12px] text-[color:var(--muted)] truncate">{{ item.subtitle }}</div>
                    </div>
                    <span class="text-[12px] px-2 py-0.5 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--muted)]">
                      {{ item.type }}
                    </span>
                  </button>

                  <div v-if="displayedSearchItems.length === 0" class="p-6 text-center">
                    <div class="text-sm font-medium">No matches</div>
                    <p class="text-[12px] text-[color:var(--muted)] mt-1">
                      Try a different keyword (no PHI is indexed in this demo).
                    </p>
                  </div>
                </template>
              </div>
            </div>

            <!-- Right actions -->
            <div class="flex items-center gap-2">
              <!-- Command palette -->
              <button
                class="h-11 px-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                       hover:bg-white/5
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] hidden sm:flex items-center gap-2"
                @click="openCommandPalette()"
                aria-label="Open command palette"
              >
                <svg class="h-5 w-5 text-[color:var(--muted)]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 6a3 3 0 0 0 0 6h6a3 3 0 0 0 0-6H9Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M9 12v6M15 12v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span class="text-sm text-[color:var(--muted)]">Ctrl+K</span>
              </button>

              <!-- Notifications -->
              <button
                class="h-11 w-11 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                       hover:bg-white/5
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] relative"
                @click="notificationsOpen = true"
                aria-label="Open notifications"
              >
                <svg class="h-5 w-5 mx-auto text-[color:var(--muted)]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Z" fill="currentColor" opacity="0.85"/>
                  <path d="M18 16V11a6 6 0 1 0-12 0v5l-2 2h16l-2-2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                </svg>
                <span
                  v-if="unreadNotifications > 0"
                  class="absolute top-2 right-2 h-2 w-2 rounded-full bg-[color:var(--accent)]"
                  aria-hidden="true"
                />
              </button>

              <!-- Help -->
              <button
                class="h-11 w-11 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                       hover:bg-white/5
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                @click="softToast('Help center opening soon', 'info')"
                aria-label="Help"
              >
                <svg class="h-5 w-5 mx-auto text-[color:var(--muted)]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.9.7-1.2 1.1-1.2 2.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>

              <!-- Theme toggle -->
              <button
                class="h-11 w-11 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                       hover:bg-white/5
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                @click="toggleTheme()"
                :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
              >
                <svg v-if="isDark" class="h-5 w-5 mx-auto text-[color:var(--muted)]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5Z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <svg v-else class="h-5 w-5 mx-auto text-[color:var(--muted)]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>

              <!-- Signed in pill + avatar -->
              <div class="hidden sm:flex items-center gap-2 pl-2">
                <span
                  class="text-[12px] px-2.5 py-1 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-1)]"
                  :class="isSignedIn ? 'text-[color:var(--success)]' : 'text-[color:var(--warn)]'"
                >
                  {{ isSignedIn ? 'Signed in' : 'Not signed in' }}
                </span>
                <button
                  class="h-11 w-11 rounded-xl bg-[color:var(--surface-1)] border border-[color:var(--border)]
                         hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                  @click="softToast('User menu opening soon', 'info')"
                  aria-label="User menu"
                >
                  <div class="h-7 w-7 rounded-full bg-[color:var(--accent)]/20 ring-1 ring-[color:var(--accent)]/25 mx-auto" aria-hidden="true"></div>
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Main -->
        <main class="px-4 sm:px-6 py-6" aria-label="Dashboard content">
          <!-- Error banner (example state) -->
          <div v-if="errorBanner" class="mb-6 rounded-2xl border border-[color:var(--error)]/40 bg-[color:var(--error)]/10 p-4">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="font-semibold">Connection issue</p>
                <p class="text-sm text-[color:var(--muted)] mt-1">
                  Some data may be stale. Retry when available.
                </p>
              </div>
              <button
                class="h-10 px-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                       hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                @click="errorBanner = false"
              >
                Dismiss
              </button>
            </div>
          </div>

          <!-- Row A -->
          <section class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6" aria-label="Dashboard header">
            <div>
              <h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1>
              <p class="text-sm text-[color:var(--muted)] mt-1">Welcome back. Review your workspace and todays queue.</p>
            </div>

          </section>

          <!-- Grid -->
          <div class="grid grid-cols-12 gap-4 lg:gap-6">
            <!-- Row B: Primary panels -->
            <section class="col-span-12 lg:col-span-6">
              <div class="Card h-full flex flex-col">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h2 class="text-lg font-semibold tracking-tight">Upcoming Appointments</h2>
                    <p class="text-sm text-[color:var(--muted)] mt-1">View near-term schedule. No PHI shown.</p>
                  </div>

                  <div class="flex items-center gap-2">
                    <Pill tone="info">{{ upcomingAppointmentsCount }} upcoming</Pill>
                    <span class="inline-flex h-9 items-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 text-sm text-[color:var(--muted)]">
                      Next 7 days
                    </span>

                    <RouterLink
                      to="/calendar"
                      class="h-10 px-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                             hover:bg-white/5
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]
                             inline-flex items-center gap-2"
                    >
                      Open
                    </RouterLink>
                  </div>
                </div>

                <div class="mt-4">
                  <!-- Loading -->
                  <div v-if="isLoading" class="space-y-3">
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </div>

                  <!-- Empty -->
                  <div v-else-if="displayedAppointments.length === 0" class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6 text-center">
                    <p class="font-semibold">No appointments in this view</p>
                    <p class="text-sm text-[color:var(--muted)] mt-1">Schedule a new appointment to get started.</p>
                    <RouterLink
                      to="/calendar"
                      class="mt-4 inline-flex h-11 items-center justify-center px-4 rounded-xl bg-[color:var(--accent)] text-[#06201B] font-semibold
                             hover:brightness-110 active:brightness-95
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-2)]"
                    >
                      New Appointment
                    </RouterLink>
                  </div>

                  <!-- Table -->
                  <div v-else class="rounded-2xl border border-[color:var(--border)] overflow-hidden">
                    <div class="max-h-[320px] overflow-auto">
                      <table class="w-full text-sm" role="table" aria-label="Upcoming appointments">
                        <thead class="sticky top-0 bg-[color:var(--surface-1)] border-b border-[color:var(--border)]">
                          <tr class="text-left text-[12px] uppercase tracking-wide text-[color:var(--muted)]">
                            <th class="px-4 py-3 font-medium">Date</th>
                            <th class="px-4 py-3 font-medium">Time</th>
                            <th class="px-4 py-3 font-medium">Patient ID</th>
                            <th class="px-4 py-3 font-medium">Notes</th>
                            <th class="px-4 py-3 font-medium text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-[color:var(--border)]">
                          <tr
                            v-for="(appt, idx) in displayedAppointments"
                            :key="appt._id || appt.id"
                            class="hover:bg-white/5"
                            :class="idx % 2 === 1 ? 'bg-white/[0.02]' : ''"
                          >
                            <td class="px-4 py-3 font-medium">{{ appt.date }}</td>
                            <td class="px-4 py-3 text-[color:var(--muted)]">{{ appt.time }}</td>
                            <td class="px-4 py-3 text-[color:var(--muted)]">{{ appt.patient }}</td>
                            <td class="px-4 py-3 text-[color:var(--muted)]">{{ appt.notes }}</td>
                            <td class="px-4 py-3 text-right">
                              <button
                                class="h-9 px-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                                       hover:bg-white/5
                                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                                @click="softToast('Appointment details opening soon', 'info')"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <p class="text-[12px] text-[color:var(--muted)] mt-3">
                    Tip: Use <span class="px-2 py-0.5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-2)]">Ctrl+K</span> for quick navigation.
                  </p>
                </div>
              </div>
            </section>

            <!-- Row B Right: Recent Activity -->
            <section class="col-span-12 lg:col-span-6 space-y-4 lg:space-y-6">
              <!-- Recent Activity -->
              <div class="Card h-full flex flex-col">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h2 class="text-lg font-semibold tracking-tight">Recent Activity</h2>
                    <p class="text-sm text-[color:var(--muted)] mt-1">Latest patient and appointment updates.</p>
                  </div>
                  <Pill tone="neutral">{{ recentActivityCount }} updates</Pill>
                </div>

                  <div class="mt-4 flex-1">
                    <div v-if="isLoading" class="space-y-3">
                      <SkeletonLine />
                      <SkeletonLine class="w-5/6" />
                      <SkeletonLine class="w-2/3" />
                    </div>

                    <div v-else-if="recentActivity.length === 0" class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6 text-center">
                      <p class="font-semibold">No recent activity</p>
                      <p class="text-sm text-[color:var(--muted)] mt-1">Updates will appear once data is available.</p>
                    </div>

                    <ul v-else class="space-y-3 max-h-[320px] overflow-auto pr-1">
                      <li v-for="a in recentActivity" :key="a.id" class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
                        <div class="flex items-center justify-between gap-3">
                          <p class="text-sm font-medium">{{ a.title }}</p>
                          <span v-if="a.time" class="text-[12px] text-[color:var(--muted)]">{{ a.time }}</span>
                      </div>
                      <p class="text-[12px] text-[color:var(--muted)] mt-1">{{ a.detail }}</p>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Row D: Workspace details (preserved content) -->
            <section class="col-span-12">
              <div class="Card">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 class="text-lg font-semibold tracking-tight">Workspace</h2>
                    <p class="text-sm text-[color:var(--muted)] mt-1">
                      Current operational context.
                    </p>
                  </div>

                  <div class="flex flex-wrap items-center gap-2">
                    <Pill tone="success">Status: {{ workspace.status }}</Pill>
                    <Pill tone="neutral">Workspace: {{ workspace.workspace }}</Pill>
                    <Pill tone="info">Mode: {{ workspace.mode }}</Pill>
                    <span
                      class="text-[12px] px-2.5 py-1 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)]
                             text-[color:var(--muted)]"
                    >
                      {{ isSignedIn ? 'Signed in' : 'Not signed in' }}
                    </span>
                  </div>
                </div>

                <!-- Primary modules (preserved actions) -->
                <div class="mt-5 grid grid-cols-12 gap-4 lg:gap-6">
                  <RouterLink
                    to="/patients"
                    class="col-span-12 md:col-span-6 block rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)]
                           hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                  >
                    <div class="p-5 flex items-start justify-between gap-4">
                      <div>
                        <div class="flex items-center gap-2">
                          <h3 class="text-base font-semibold">Patients</h3>
                          <Pill tone="success">Open</Pill>
                        </div>
                        <p class="text-sm text-[color:var(--muted)] mt-1">View and manage patient records.</p>
                      </div>
                      <div class="h-11 w-11 rounded-xl bg-[color:var(--accent)]/12 ring-1 ring-[color:var(--accent)]/20 flex items-center justify-center">
                        <svg class="h-5 w-5 text-[color:var(--accent)]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" fill="currentColor" opacity="0.9"/>
                          <path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                      </div>
                    </div>
                  </RouterLink>

                  <RouterLink
                    to="/calendar"
                    class="col-span-12 md:col-span-6 block rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)]
                           hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                  >
                    <div class="p-5 flex items-start justify-between gap-4">
                      <div>
                        <div class="flex items-center gap-2">
                          <h3 class="text-base font-semibold">Appointments</h3>
                          <Pill tone="success">Open</Pill>
                        </div>
                        <p class="text-sm text-[color:var(--muted)] mt-1">View and manage appointments.</p>
                      </div>
                      <div class="h-11 w-11 rounded-xl bg-[color:var(--accent)]/12 ring-1 ring-[color:var(--accent)]/20 flex items-center justify-center">
                        <svg class="h-5 w-5 text-[color:var(--accent)]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M7 3v3M17 3v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                          <path d="M4 8h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                          <path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="2"/>
                        </svg>
                      </div>
                    </div>
                  </RouterLink>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <!-- Notifications panel -->
      <div
        v-if="notificationsOpen"
        class="fixed inset-0 z-50"
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        @keydown.esc="notificationsOpen = false"
      >
        <div class="absolute inset-0 bg-black/50" @click="notificationsOpen = false" role="presentation"></div>
        <div class="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-[color:var(--surface-1)] border-l border-[color:var(--border)] shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
          <div class="p-4 border-b border-[color:var(--border)] flex items-center justify-between">
            <div>
              <p class="font-semibold">Notifications</p>
              <p class="text-[12px] text-[color:var(--muted)]">Operational updates and reminders.</p>
            </div>
            <button
              class="h-10 w-10 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                     hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              @click="notificationsOpen = false"
              aria-label="Close notifications"
            >
              <svg class="h-5 w-5 mx-auto text-[color:var(--muted)]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="p-4 space-y-3 overflow-auto h-[calc(100%-72px)]">
            <div
              v-for="n in notifications"
              :key="n.id"
              class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4"
            >
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-medium">{{ n.title }}</p>
                <span class="text-[12px] text-[color:var(--muted)]">{{ n.time }}</span>
              </div>
              <p class="text-[12px] text-[color:var(--muted)] mt-1">{{ n.detail }}</p>
              <div class="mt-3 flex items-center gap-2">
                <button class="h-9 px-3 rounded-xl bg-[color:var(--accent)] text-[#06201B] font-semibold
                               hover:brightness-110 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                        @click="markNotificationRead(n.id)">
                  Mark read
                </button>
                <button class="h-9 px-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                               hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                        @click="softToast('Notification archived', 'success')">
                  Archive
                </button>
              </div>
            </div>

            <div v-if="notifications.length === 0" class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-8 text-center">
              <p class="font-semibold">All caught up</p>
              <p class="text-sm text-[color:var(--muted)] mt-1">No notifications right now.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Command Palette -->
      <div v-if="commandOpen" class="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Command palette" @keydown.esc="closeCommandPalette()">
        <div class="absolute inset-0 bg-black/50" @click="closeCommandPalette()" role="presentation"></div>
        <div class="absolute left-1/2 top-20 -translate-x-1/2 w-[92%] max-w-[680px] rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] shadow-[0_8px_24px_rgba(0,0,0,0.18)] overflow-hidden">
          <div class="p-4 border-b border-[color:var(--border)]">
            <div class="flex items-center gap-2">
              <svg class="h-5 w-5 text-[color:var(--muted)]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 21l-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <input
                ref="commandInputRef"
                v-model="commandQuery"
                @keydown.down.prevent="commandMove(1)"
                @keydown.up.prevent="commandMove(-1)"
                @keydown.enter.prevent="commandRunActive()"
                class="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--muted)]"
                placeholder="Type a command (Patients, Appointments, Dashboard)"
                aria-label="Command input"
              />
              <span class="text-[12px] text-[color:var(--muted)]">Esc</span>
            </div>
          </div>

          <div class="max-h-[360px] overflow-auto">
            <button
              v-for="(c, idx) in filteredCommands"
              :key="c.id"
              class="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center justify-between gap-4
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              :class="idx === activeCommandIndex ? 'bg-white/5' : ''"
              @mousedown.prevent="runCommand(c)"
            >
              <div class="min-w-0">
                <div class="text-sm font-medium truncate">{{ c.title }}</div>
                <div class="text-[12px] text-[color:var(--muted)] truncate">{{ c.subtitle }}</div>
              </div>
              <span class="text-[12px] px-2 py-0.5 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--muted)]">
                {{ c.shortcut }}
              </span>
            </button>

            <div v-if="filteredCommands.length === 0" class="p-8 text-center">
              <p class="font-semibold">No commands found</p>
              <p class="text-sm text-[color:var(--muted)] mt-1">Try patients, appointments, or dashboard.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Toasts -->
      <div class="fixed bottom-4 right-4 z-[60] space-y-2 w-[92%] max-w-[380px]" aria-live="polite" aria-relevant="additions">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] shadow-[0_8px_24px_rgba(0,0,0,0.18)] p-4"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="text-sm font-semibold" :class="toastToneClass(t.tone)">{{ t.title }}</p>
              <p v-if="t.detail" class="text-[12px] text-[color:var(--muted)] mt-1">{{ t.detail }}</p>
            </div>
            <button
              class="h-9 w-9 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)]
                     hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              @click="dismissToast(t.id)"
              aria-label="Dismiss toast"
            >
              <svg class="h-4 w-4 mx-auto text-[color:var(--muted)]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick, h } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

/**
 * Notes:
 * - Tailwind is expected (recommended). This SFC is self-contained and uses minimal scoped CSS for tokens.
 * - No PHI is used in sample data (generic labels only).
 */

const router = useRouter()
const route = useRoute()
const routePath = computed(() => route.path)
const embedded = computed(() => route.matched.some((record) => record.meta?.layout === 'suite'))

// Auth (preserve original behavior)
const token = ref(null)
const isSignedIn = computed(() => !!token.value)
const isLoading = ref(false)
const errorBanner = ref(false)

// Theme
const isDark = ref(true)
const rootThemeClass = computed(() => (isDark.value ? 'theme-dark' : 'theme-light'))

function applyThemeClass() {
  // optional: if your app uses a global "dark" class, you can toggle it here
  // document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('emr_theme', isDark.value ? 'dark' : 'light')
}
function toggleTheme() {
  isDark.value = !isDark.value
  applyThemeClass()
  softToast(isDark.value ? 'Dark mode enabled' : 'Light mode enabled', 'info')
}

// Sidebar
const sidebarCollapsed = ref(false)
const mobileSidebarOpen = ref(false)
const newMenuOpen = ref(false)

function toggleNewMenu() {
  newMenuOpen.value = !newMenuOpen.value
}
function createNew(kind) {
  newMenuOpen.value = false
  if (kind === 'patient') {
    softToast('Creating new patient', 'success')
    router.push('/patients')
  } else {
    softToast('Creating new appointment', 'success')
    router.push('/calendar')
  }
}

// Search (typeahead + recent)
const searchQuery = ref('')
const searchOpen = ref(false)
const isSearchLoading = ref(false)
const activeSearchIndex = ref(0)
const recentSearches = ref(['appointments', 'tasks', 'dashboard'])

const searchIndex = ref([
  { id: 's1', type: 'Patients', title: 'Patients', subtitle: 'Open patient module', route: '/patients' },
  { id: 's2', type: 'Appointments', title: 'Appointments', subtitle: 'Open scheduling workspace', route: '/calendar' },
  { id: 's3', type: 'Dashboard', title: 'Dashboard', subtitle: 'Return to overview', route: '/dashboard' },
  { id: 's4', type: 'Tasks', title: 'Tasks', subtitle: 'Triage queue (coming soon)', route: null },
])

const displayedSearchItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) {
    return recentSearches.value.map((term, idx) => ({
      id: `r${idx}`,
      type: 'Recent',
      title: term,
      subtitle: 'Recent search',
      route: null,
      isRecent: true,
      term,
    }))
  }
  return searchIndex.value.filter(item =>
    (item.title + ' ' + item.subtitle + ' ' + item.type).toLowerCase().includes(q)
  )
})

function closeSearch() {
  searchOpen.value = false
  activeSearchIndex.value = 0
}
function selectSearchItem(item) {
  const q = searchQuery.value.trim()
  if (q) {
    // update recent searches (no PHI)
    recentSearches.value = [q, ...recentSearches.value.filter(x => x !== q)].slice(0, 5)
  } else if (item.isRecent) {
    searchQuery.value = item.term
  }

  closeSearch()

  if (item.route) {
    softToast(`Opening ${item.title}`, 'success')
    router.push(item.route)
  } else {
    softToast(`${item.title} opening soon`, 'info')
  }
}
function searchMove(delta) {
  const max = Math.max(0, displayedSearchItems.value.length - 1)
  activeSearchIndex.value = Math.min(max, Math.max(0, activeSearchIndex.value + delta))
}
function searchSelectActive() {
  const item = displayedSearchItems.value[activeSearchIndex.value]
  if (item) selectSearchItem(item)
}

watch(searchQuery, async () => {
  // tiny faux loading state to feel premium; remove if you have real API
  isSearchLoading.value = true
  activeSearchIndex.value = 0
  await new Promise(r => setTimeout(r, 120))
  isSearchLoading.value = false
})

// Notifications
const notificationsOpen = ref(false)
const notifications = ref([
  { id: 'n1', title: 'System status: Ready', detail: 'All services operational.', time: 'Just now', unread: true },
  { id: 'n2', title: 'Workspace: Clinical', detail: 'Environment badge updated.', time: 'Today', unread: true },
])
const unreadNotifications = computed(() => notifications.value.filter(n => n.unread).length)
function markNotificationRead(id) {
  const n = notifications.value.find(x => x.id === id)
  if (n) n.unread = false
  softToast('Marked as read', 'success')
}

// Command palette
const commandOpen = ref(false)
const commandQuery = ref('')
const activeCommandIndex = ref(0)
const commandInputRef = ref(null)

const commands = ref([
  { id: 'c1', title: 'Go to Dashboard', subtitle: 'Return to overview', shortcut: '', run: () => router.push('/dashboard') },
  { id: 'c2', title: 'Open Patients', subtitle: 'Patient module', shortcut: 'P', run: () => router.push('/patients') },
  { id: 'c3', title: 'Open Appointments', subtitle: 'Scheduling module', shortcut: 'A', run: () => router.push('/calendar') },
  { id: 'c4', title: 'Toggle Theme', subtitle: 'Switch dark/light', shortcut: 'T', run: () => toggleTheme() },
])

const filteredCommands = computed(() => {
  const q = commandQuery.value.trim().toLowerCase()
  if (!q) return commands.value
  return commands.value.filter(c => (c.title + ' ' + c.subtitle).toLowerCase().includes(q))
})

function openCommandPalette() {
  commandOpen.value = true
  commandQuery.value = ''
  activeCommandIndex.value = 0
  nextTick(() => commandInputRef.value?.focus?.())
}
function closeCommandPalette() {
  commandOpen.value = false
}
function commandMove(delta) {
  const max = Math.max(0, filteredCommands.value.length - 1)
  activeCommandIndex.value = Math.min(max, Math.max(0, activeCommandIndex.value + delta))
}
function runCommand(cmd) {
  closeCommandPalette()
  cmd.run?.()
  softToast(cmd.title, 'success')
}
function commandRunActive() {
  const cmd = filteredCommands.value[activeCommandIndex.value]
  if (cmd) runCommand(cmd)
}

// Global keyboard shortcut: Cmd/Ctrl + K
function onGlobalKeydown(e) {
  const isMac = navigator.platform.toLowerCase().includes('mac')
  const meta = isMac ? e.metaKey : e.ctrlKey
  if (meta && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    openCommandPalette()
  }
  // close popovers
  if (e.key === 'Escape') {
    newMenuOpen.value = false
    searchOpen.value = false
  }
}

// Data (no PHI)
const API_URL = import.meta.env.VITE_API_URL
const workspace = ref({
  status: 'Ready',
  workspace: 'Clinical',
  mode: 'Modern UI',
})

const appointments = ref([])
const patients = ref([])

const parseDate = (dateStr) => {
  if (!dateStr) return null
  const parts = dateStr.split(/[/-]/).map((p) => Number(p))
  if (parts.length >= 3) {
    const [month, day, year] = parts
    if (year && month && day) return new Date(year, month - 1, day)
  }
  const parsed = new Date(dateStr)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const formatAppointmentTime = (appt) => {
  const start = appt.startTime || ''
  const end = appt.endTime || ''
  if (start && end) return `${start} - ${end}`
  return start || end || 'TBD'
}

const normalizedAppointments = computed(() =>
  appointments.value.map((appt) => ({
    ...appt,
    dateObj: parseDate(appt.date),
    date: appt.date || 'Unknown',
    time: formatAppointmentTime(appt),
    patient: appt.patient || 'Unknown',
    notes: appt.notes || 'None',
  }))
)

const isSameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const displayedAppointments = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endWindow = new Date(today)
  endWindow.setDate(endWindow.getDate() + 7)

  return normalizedAppointments.value
    .filter((appt) => appt.dateObj && appt.dateObj >= today && appt.dateObj <= endWindow)
    .sort((a, b) => a.dateObj - b.dateObj)
})

const upcomingAppointmentsCount = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endWindow = new Date(today)
  endWindow.setDate(endWindow.getDate() + 7)
  return normalizedAppointments.value.filter((appt) => appt.dateObj && appt.dateObj >= today && appt.dateObj <= endWindow).length
})
const localActivity = ref([])

const loadLocalActivity = () => {
  try {
    const stored = localStorage.getItem('emr_activity_log')
    localActivity.value = stored ? JSON.parse(stored) : []
  } catch {
    localActivity.value = []
  }
}

const recentActivity = computed(() => {
  const items = []

  normalizedAppointments.value.forEach((appt) => {
    items.push({
      id: `appt-${appt._id || appt.patient}-${appt.date}-${appt.time}`,
      title: 'Appointment scheduled',
      detail: `Patient ${appt.patient} - ${appt.time}`,
      time: appt.date || 'Unknown date',
      dateObj: appt.dateObj,
    })
  })

  patients.value.forEach((patient) => {
    const name = [patient.firstName, patient.lastName].filter(Boolean).join(' ') || 'Patient record'
    items.push({
      id: `patient-${patient._id}`,
      title: 'Patient record available',
      detail: name,
      time: '',
      dateObj: null,
    })
  })

  localActivity.value.forEach((entry, idx) => {
    items.push({
      id: entry.id || `local-${entry.timestamp || idx}`,
      title: entry.title || 'Activity update',
      detail: entry.detail || '',
      time: entry.timeLabel || '',
      dateObj: entry.timestamp ? new Date(entry.timestamp) : null,
    })
  })

  return items
    .sort((a, b) => {
      if (a.dateObj && b.dateObj) return b.dateObj - a.dateObj
      if (a.dateObj) return -1
      if (b.dateObj) return 1
      return 0
    })
    .slice(0, 6)
})
const recentActivityCount = computed(() => recentActivity.value.length)

const readJsonSafe = async (response) => {
  const text = await response.text()
  if (!text) return []
  try {
    return JSON.parse(text)
  } catch {
    return []
  }
}

const loadDashboardData = async () => {
  isLoading.value = true
  try {
    const headers = token.value ? { Authorization: `Bearer ${token.value}` } : {}
    const [appointmentsRes, patientsRes] = await Promise.all([
      fetch(`${API_URL}/appointments`, { headers }),
      fetch(`${API_URL}/patients`, { headers }),
    ])

    appointments.value = appointmentsRes.ok ? await readJsonSafe(appointmentsRes) : []
    patients.value = patientsRes.ok ? await readJsonSafe(patientsRes) : []
  } catch {
    appointments.value = []
    patients.value = []
  } finally {
    isLoading.value = false
  }
}

// Toasts
const toasts = ref([])
function softToast(title, tone = 'info', detail = '') {
  const id = `t_${Math.random().toString(16).slice(2)}`
  toasts.value = [{ id, title, tone, detail }, ...toasts.value].slice(0, 4)
  window.setTimeout(() => dismissToast(id), 2800)
}
function dismissToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}
function toastToneClass(tone) {
  if (tone === 'success') return 'text-[color:var(--success)]'
  if (tone === 'warn') return 'text-[color:var(--warn)]'
  if (tone === 'error') return 'text-[color:var(--error)]'
  return 'text-[color:var(--text)]'
}

// Navigation
function navigate(path) {
  mobileSidebarOpen.value = false
  newMenuOpen.value = false
  router.push(path)
}

// lifecycle
onMounted(() => {
  token.value = localStorage.getItem('token')
  const saved = localStorage.getItem('emr_theme')
  if (saved) isDark.value = saved === 'dark'
  applyThemeClass()

  loadLocalActivity()
  loadDashboardData()
  window.addEventListener('keydown', onGlobalKeydown)
  window.addEventListener('click', onGlobalClick, { capture: true })
  window.addEventListener('storage', loadLocalActivity)
  window.addEventListener('emr-theme-change', syncThemeFromStorage)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
  window.removeEventListener('click', onGlobalClick, { capture: true })
  window.removeEventListener('storage', loadLocalActivity)
  window.removeEventListener('emr-theme-change', syncThemeFromStorage)
})

function syncThemeFromStorage() {
  const saved = localStorage.getItem('emr_theme')
  if (saved) {
    isDark.value = saved === 'dark'
  }
}

function onGlobalClick(e) {
  // close menus if click outside
  const target = e.target
  // keep simple: close on any outside click when menus are open
  if (newMenuOpen.value) newMenuOpen.value = false
  // don't aggressively close search when typing/clicking inside; leave to ESC or selection
}

// Close search suggestions when route changes
watch(routePath, () => {
  closeSearch()
  newMenuOpen.value = false
})

/**
 * Local components (kept in-file for "send updated file back in full").
 * Recommended extraction in production:
 * - components/layout/NavItem.vue
 * - components/ui/Pill.vue
 * - components/ui/SkeletonLine.vue
 */
// Local components implemented as render functions inside <script setup>.

const NavItem = (props, { slots, emit }) => {
  const base =
    'w-full h-11 rounded-xl px-3 flex items-center gap-3 text-sm ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]'
  const active = props.active
    ? 'bg-white/7 text-[color:var(--text)] border border-[color:var(--border)]'
    : 'text-[color:var(--muted)] hover:bg-white/5'
  return h(
    'button',
    {
      class: `${base} ${active}`,
      onClick: () => emit('click'),
      'aria-current': props.active ? 'page' : null,
    },
    [
      h(
        'span',
        { class: 'h-9 w-9 rounded-xl bg-[color:var(--surface-2)] border border-[color:var(--border)] flex items-center justify-center text-[color:var(--muted)]' },
        slots.icon?.()
      ),
      !props.collapsed &&
        h('span', { class: 'truncate text-left flex-1', title: props.label }, props.label),
    ].filter(Boolean)
  )
}
NavItem.props = { label: String, collapsed: Boolean, active: Boolean }
NavItem.emits = ['click']

const Pill = (props, { slots }) => {
  const toneMap = {
    success: 'border-[color:var(--success)]/30 text-[color:var(--success)] bg-[color:var(--success)]/10',
    warn: 'border-[color:var(--warn)]/30 text-[color:var(--warn)] bg-[color:var(--warn)]/10',
    error: 'border-[color:var(--error)]/30 text-[color:var(--error)] bg-[color:var(--error)]/10',
    info: 'border-[color:var(--accent-2)]/30 text-[color:var(--accent-2)] bg-[color:var(--accent-2)]/10',
    neutral: 'border-[color:var(--border)] text-[color:var(--muted)] bg-[color:var(--surface-2)]',
  }
  const cls = toneMap[props.tone] || toneMap.neutral
  return h(
    'span',
    {
      class:
        `inline-flex items-center h-6 px-2.5 rounded-full border text-[12px] font-medium whitespace-nowrap ${cls}`,
    },
    slots.default?.()
  )
}
Pill.props = { tone: { type: String, default: 'neutral' } }

const SkeletonLine = (props) => {
  return h('div', {
    class:
      'h-4 rounded-lg bg-white/5 border border-[color:var(--border)] animate-pulse ' + (props.class || ''),
  })
}
SkeletonLine.props = { class: String }

const SkeletonRow = () => {
  return h('div', { class: 'rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4 space-y-3' }, [
    h(SkeletonLine, { class: 'w-1/3' }),
    h(SkeletonLine, { class: 'w-2/3' }),
    h(SkeletonLine, { class: 'w-1/2' }),
  ])
}
</script>

<style scoped>
/* Design Tokens (theme variables) */
.theme-dark {
  --bg: #0b1220;
  --surface-1: #0f1b2d;
  --surface-2: #13233a;
  --border: rgba(148, 163, 184, 0.18);
  --text: #e5e7eb;
  --muted: #9ca3af;
  --accent: #2dd4bf;
  --accent-2: #38bdf8;
  --success: #22c55e;
  --warn: #f59e0b;
  --error: #ef4444;
}

.theme-light {
  --bg: #f8fafc;
  --surface-1: #ffffff;
  --surface-2: #f1f5f9;
  --border: rgba(15, 23, 42, 0.12);
  --text: #0f172a;
  --muted: #475569;
  --accent: #2dd4bf;
  --accent-2: #38bdf8;
  --success: #16a34a;
  --warn: #d97706;
  --error: #dc2626;
}

/* Utility-ish classes (kept minimal; Tailwind handles most) */
.Card {
  border: 1px solid var(--border);
  background: var(--surface-1);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 0 rgba(0,0,0,0.18), 0 10px 28px rgba(0,0,0,0.14);
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
</style>










