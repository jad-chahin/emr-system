<template>
  <div class="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
    <section class="mx-auto w-full max-w-[1200px] space-y-6">
      <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">Universal Patient Database</p>
          <h1 class="text-2xl font-semibold">Patient Lookup</h1>
          <p class="text-sm text-[color:var(--muted)]">Search patients and review their record summary.</p>
        </div>
        <div class="text-xs text-[color:var(--muted)]">No PHI. Demo data only.</div>
      </header>

      <div class="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <aside class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-5">
          <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]" for="patient-search">
            Search patients
          </label>
          <form
            class="mt-2 flex flex-wrap items-center gap-2"
            @submit.prevent="handleSearch"
          >
            <div class="flex min-w-[0] flex-1 items-center gap-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2">
              <input
                id="patient-search"
                v-model="searchQuery"
                type="text"
                placeholder="Name, card number, or email"
                class="w-full bg-transparent text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus-visible:outline-none"
              />
            </div>
            <button
              type="submit"
              class="h-10 px-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] text-sm font-semibold text-[color:var(--text)]"
            >
              Search
            </button>
          </form>

          <div class="mt-4 space-y-2">
            <div v-if="isLoadingPatients" class="space-y-2">
              <div class="h-10 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] animate-pulse"></div>
              <div class="h-10 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] animate-pulse"></div>
              <div class="h-10 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] animate-pulse"></div>
            </div>
            <div v-else-if="filteredPatients.length === 0" class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4 text-sm text-[color:var(--muted)]">
              No patients match this search.
            </div>
            <button
              v-for="patient in filteredPatients"
              :key="patient._id"
              class="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-left transition hover:bg-white/5"
              :class="patient._id === selectedPatientId ? 'ring-2 ring-[color:var(--accent)]/60' : ''"
              @click="selectPatient(patient._id)"
            >
              <div class="text-sm font-semibold">{{ formatPatientName(patient) }}</div>
              <div class="text-xs text-[color:var(--muted)]">{{ patient.cardNumber || 'No card number' }}</div>
              <div class="text-xs text-[color:var(--muted)]">{{ patient.contact?.email || 'No email' }}</div>
            </button>
          </div>
        </aside>

        <main class="space-y-6">
          <section class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-lg font-semibold">Patient Details</h2>
                <p class="text-sm text-[color:var(--muted)]">Select a patient to view their profile.</p>
              </div>
              <div class="text-xs text-[color:var(--muted)]">Record view only</div>
            </div>

            <div v-if="isLoadingDetail" class="mt-4 space-y-2">
              <div class="h-6 w-1/2 rounded-lg bg-[color:var(--surface-2)] animate-pulse"></div>
              <div class="h-4 w-2/3 rounded-lg bg-[color:var(--surface-2)] animate-pulse"></div>
              <div class="h-4 w-1/3 rounded-lg bg-[color:var(--surface-2)] animate-pulse"></div>
            </div>

            <div v-else-if="!patientDetail" class="mt-4 text-sm text-[color:var(--muted)]">
              No patient selected.
            </div>

            <div v-else class="mt-4 grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
                <div class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Name</div>
                <div class="mt-1 text-sm font-semibold">{{ formatPatientName(patientDetail) }}</div>
              </div>
              <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
                <div class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Card number</div>
                <div class="mt-1 text-sm font-semibold">{{ patientDetail.cardNumber || 'Not provided' }}</div>
              </div>
              <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
                <div class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Email</div>
                <div class="mt-1 text-sm font-semibold">{{ patientDetail.contact?.email || 'Not provided' }}</div>
              </div>
            </div>
          </section>

          <section class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-lg font-semibold">Assigned Treatments</h2>
                <p class="text-sm text-[color:var(--muted)]">Linked from the patient record.</p>
              </div>
              <button
                class="h-10 px-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] text-sm text-[color:var(--muted)]"
                type="button"
              >
                Add Treatment (implement)
              </button>
            </div>

            <div v-if="!patientDetail" class="mt-4 text-sm text-[color:var(--muted)]">Select a patient to view treatments.</div>
            <div v-else-if="assignedTreatments.length === 0" class="mt-4 text-sm text-[color:var(--muted)]">No treatments assigned.</div>
            <div v-else class="mt-4 grid gap-3 sm:grid-cols-2">
              <div
                v-for="treatment in assignedTreatments"
                :key="treatment._id"
                class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4"
              >
                <div class="text-sm font-semibold">{{ treatment.name }}</div>
                <div class="text-xs text-[color:var(--muted)]">{{ treatment.dose }}</div>
                <button
                  class="mt-3 h-9 px-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] text-xs text-[color:var(--muted)]"
                  type="button"
                >
                  Remove (implement)
                </button>
              </div>
            </div>
          </section>

          <section class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-lg font-semibold">Medicine Database</h2>
                <p class="text-sm text-[color:var(--muted)]">Treatments available for assignment.</p>
              </div>
              <button
                class="h-10 px-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] text-sm text-[color:var(--muted)]"
                type="button"
              >
                Create Treatment
              </button>
            </div>

            <div v-if="isLoadingTreatments" class="mt-4 space-y-2">
              <div class="h-10 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] animate-pulse"></div>
              <div class="h-10 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] animate-pulse"></div>
            </div>
            <div v-else-if="treatments.length === 0" class="mt-4 text-sm text-[color:var(--muted)]">
              No treatments available.
            </div>
            <div v-else class="mt-4 grid gap-3 sm:grid-cols-2">
              <div
                v-for="treatment in treatments"
                :key="treatment._id"
                class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4"
              >
                <div class="text-sm font-semibold">{{ treatment.name }}</div>
                <div class="text-xs text-[color:var(--muted)]">{{ treatment.dose }}</div>
                <button
                  class="mt-3 h-9 px-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] text-xs text-[color:var(--muted)]"
                  type="button"
                >
                  Assign (implement)
                </button>
              </div>
            </div>
          </section>

          <section class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-lg font-semibold">Doctor Notes</h2>
                <p class="text-sm text-[color:var(--muted)]">(implement) Capture narrative notes and files.</p>
              </div>
              <button
                class="h-10 px-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] text-sm text-[color:var(--muted)]"
                type="button"
              >
                Add Note (implement)
              </button>
            </div>
            <div class="mt-4 space-y-3">
              <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4 text-sm text-[color:var(--muted)]">
                (implement) Notes will appear here.
              </div>
            </div>
          </section>

          <section class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-lg font-semibold">Conditions</h2>
                <p class="text-sm text-[color:var(--muted)]">(implement) Track active conditions and updates.</p>
              </div>
              <button
                class="h-10 px-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] text-sm text-[color:var(--muted)]"
                type="button"
              >
                Add Condition (implement)
              </button>
            </div>
            <div class="mt-4 space-y-3">
              <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4 text-sm text-[color:var(--muted)]">
                (implement) Conditions will appear here.
              </div>
            </div>
          </section>
        </main>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL

const patients = ref([])
const treatments = ref([])
const patientDetail = ref(null)
const selectedPatientId = ref(null)
const searchQuery = ref('')
const isLoadingPatients = ref(false)
const isLoadingTreatments = ref(false)
const isLoadingDetail = ref(false)

const filteredPatients = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return patients.value
  return patients.value.filter((patient) => {
    const name = `${patient.firstName || ''} ${patient.lastName || ''}`.toLowerCase()
    const email = patient.contact?.email?.toLowerCase() || ''
    const card = String(patient.cardNumber || '').toLowerCase()
    return name.includes(q) || email.includes(q) || card.includes(q)
  })
})

const assignedTreatments = computed(() => patientDetail.value?.treatments || [])

const todayAppointmentsCount = computed(() => 0)
const patientsCount = computed(() => patients.value.length)
const treatmentsCount = computed(() => treatments.value.length)
const upcomingAppointmentsCount = computed(() => 0)

const formatPatientName = (patient) => {
  const first = patient?.firstName || ''
  const last = patient?.lastName || ''
  return [first, last].filter(Boolean).join(' ') || 'Unnamed patient'
}

const loadPatients = async () => {
  isLoadingPatients.value = true
  try {
    const response = await fetch(`${API_URL}/patients`)
    if (!response.ok) throw new Error('Failed to load patients')
    patients.value = await response.json()
  } catch {
    patients.value = []
  } finally {
    isLoadingPatients.value = false
  }
}

const loadTreatments = async () => {
  isLoadingTreatments.value = true
  try {
    const response = await fetch(`${API_URL}/treatments`)
    if (!response.ok) throw new Error('Failed to load treatments')
    treatments.value = await response.json()
  } catch {
    treatments.value = []
  } finally {
    isLoadingTreatments.value = false
  }
}

const loadPatientDetail = async (id) => {
  if (!id) return
  isLoadingDetail.value = true
  try {
    const response = await fetch(`${API_URL}/patients/${id}`)
    if (!response.ok) throw new Error('Failed to load patient detail')
    patientDetail.value = await response.json()
  } catch {
    patientDetail.value = null
  } finally {
    isLoadingDetail.value = false
  }
}

const selectPatient = (id) => {
  selectedPatientId.value = id
  loadPatientDetail(id)
}

const handleSearch = () => {
  loadPatients()
}

onMounted(() => {
  loadPatients()
  loadTreatments()
})
</script>
