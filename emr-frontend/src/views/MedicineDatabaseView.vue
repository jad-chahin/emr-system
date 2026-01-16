<template>
  <div class="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
    <section class="mx-auto w-full max-w-[1200px] space-y-6">
      <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">Medicine Database</p>
          <h1 class="text-2xl font-semibold">Treatments</h1>
          <p class="text-sm text-[color:var(--muted)]">Manage treatments available for patient assignment.</p>
        </div>
        <div class="text-xs text-[color:var(--muted)]">No PHI. Demo data only.</div>
      </header>

      <section class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
        <h2 class="text-lg font-semibold">Create Treatment</h2>
        <p class="text-sm text-[color:var(--muted)]">Add a treatment template to the shared library.</p>

        <form class="mt-4 grid gap-4 sm:grid-cols-2" @submit.prevent="createTreatment">
          <div>
            <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]" for="treatment-condition">
              Condition
            </label>
            <input
              id="treatment-condition"
              v-model="newTreatment.condition"
              type="text"
              required
              class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              placeholder="Hypertension"
            />
          </div>
          <div>
            <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]" for="treatment-name">
              Name
            </label>
            <input
              id="treatment-name"
              v-model="newTreatment.name"
              type="text"
              required
              class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              placeholder="Amoxicillin"
            />
          </div>
          <div>
            <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]" for="treatment-dose">
              Dosage
            </label>
            <input
              id="treatment-dose"
              v-model="newTreatment.dosage"
              type="text"
              required
              class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              placeholder="500mg"
            />
          </div>
          <div>
            <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]" for="treatment-frequency">
              Frequency
            </label>
            <input
              id="treatment-frequency"
              v-model="newTreatment.frequency"
              type="text"
              required
              class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              placeholder="Twice daily"
            />
          </div>
          <div>
            <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]" for="treatment-route">
              Route
            </label>
            <input
              id="treatment-route"
              v-model="newTreatment.route"
              type="text"
              required
              class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              placeholder="Oral"
            />
          </div>
          <div>
            <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]" for="treatment-prescriber">
              Prescribing physician
            </label>
            <input
              id="treatment-prescriber"
              v-model="newTreatment.prescribingPhysician"
              type="text"
              class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              placeholder="Dr. Carter"
            />
          </div>
          <div>
            <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]" for="treatment-start">
              Start date
            </label>
            <input
              id="treatment-start"
              v-model="newTreatment.startDate"
              type="date"
              class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            />
          </div>
          <div>
            <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]" for="treatment-end">
              End date
            </label>
            <input
              id="treatment-end"
              v-model="newTreatment.endDate"
              type="date"
              class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]" for="treatment-notes">
              Notes
            </label>
            <textarea
              id="treatment-notes"
              v-model="newTreatment.notes"
              rows="3"
              class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              placeholder="Optional clinical notes or guidance."
            ></textarea>
          </div>
          <div class="sm:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:var(--accent)] px-6 text-sm font-semibold text-[#06201B]
                     hover:brightness-110 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            >
              Add treatment
            </button>
            <span v-if="formMessage" class="text-sm text-[color:var(--muted)]">{{ formMessage }}</span>
          </div>
        </form>
      </section>

      <section class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold">Treatment Library</h2>
            <p class="text-sm text-[color:var(--muted)]">Search, edit, or remove treatments.</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button
              class="h-10 px-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] text-sm text-[color:var(--muted)]"
              type="button"
              @click="loadTreatments"
            >
              Refresh
            </button>
          </div>
        </div>

        <div class="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by condition, name, dosage, or route"
            class="w-full bg-transparent text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus-visible:outline-none"
          />
        </div>

        <div v-if="isLoading" class="mt-4 space-y-2">
          <div class="h-10 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] animate-pulse"></div>
          <div class="h-10 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] animate-pulse"></div>
        </div>
        <div v-else-if="filteredTreatments.length === 0" class="mt-4 text-sm text-[color:var(--muted)]">
          {{ searchQuery.trim().length ? 'No treatments match this search.' : 'No treatments available.' }}
        </div>
        <div v-else class="mt-4 space-y-3">
          <div
            v-for="treatment in filteredTreatments"
            :key="treatment._id"
            class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4"
          >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div v-if="editingId !== treatment._id">
                <div class="text-sm font-semibold">{{ treatment.name }}</div>
                <div class="text-xs text-[color:var(--muted)]">
                  {{ treatment.condition || 'No condition' }} | {{ treatment.dosage || treatment.dose || 'No dosage' }} | {{ treatment.route || 'No route' }}
                </div>
                <div class="text-xs text-[color:var(--muted)]">{{ treatment.frequency || 'No frequency' }}</div>
              </div>
              <div v-else class="grid w-full gap-2 sm:grid-cols-2">
                <input
                  v-model="editTreatment.condition"
                  type="text"
                  placeholder="Condition"
                  class="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 py-2 text-sm text-[color:var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                />
                <input
                  v-model="editTreatment.name"
                  type="text"
                  placeholder="Name"
                  class="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 py-2 text-sm text-[color:var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                />
                <input
                  v-model="editTreatment.dosage"
                  type="text"
                  placeholder="Dosage"
                  class="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 py-2 text-sm text-[color:var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                />
                <input
                  v-model="editTreatment.frequency"
                  type="text"
                  placeholder="Frequency"
                  class="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 py-2 text-sm text-[color:var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                />
                <input
                  v-model="editTreatment.route"
                  type="text"
                  placeholder="Route"
                  class="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 py-2 text-sm text-[color:var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                />
                <input
                  v-model="editTreatment.prescribingPhysician"
                  type="text"
                  placeholder="Prescribing physician"
                  class="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 py-2 text-sm text-[color:var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                />
                <input
                  v-model="editTreatment.startDate"
                  type="date"
                  class="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 py-2 text-sm text-[color:var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                />
                <input
                  v-model="editTreatment.endDate"
                  type="date"
                  class="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 py-2 text-sm text-[color:var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                />
                <textarea
                  v-model="editTreatment.notes"
                  rows="2"
                  placeholder="Notes"
                  class="sm:col-span-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 py-2 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                ></textarea>
              </div>
              <div class="flex items-center gap-2">
                <button
                  v-if="editingId !== treatment._id"
                  class="h-9 px-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] text-xs text-[color:var(--muted)]"
                  type="button"
                  @click="startEdit(treatment)"
                >
                  Edit
                </button>
                <button
                  v-else
                  class="h-9 px-3 rounded-xl bg-[color:var(--accent)] text-xs font-semibold text-[#06201B]"
                  type="button"
                  @click="saveEdit(treatment._id)"
                >
                  Save
                </button>
                <button
                  v-if="editingId === treatment._id"
                  class="h-9 px-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] text-xs text-[color:var(--muted)]"
                  type="button"
                  @click="cancelEdit"
                >
                  Cancel
                </button>
                <button
                  class="h-9 px-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] text-xs text-[color:var(--error)]"
                  type="button"
                  @click="deleteTreatment(treatment._id)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL
const token = localStorage.getItem('token')

const authHeaders = () => (token ? { Authorization: `Bearer ${token}` } : {})

const treatments = ref([])
const isLoading = ref(false)
const formMessage = ref('')
const searchQuery = ref('')

const newTreatment = ref({
  condition: '',
  name: '',
  dosage: '',
  frequency: '',
  route: '',
  startDate: '',
  endDate: '',
  prescribingPhysician: '',
  notes: '',
})

const editingId = ref(null)
const editTreatment = ref({
  condition: '',
  name: '',
  dosage: '',
  frequency: '',
  route: '',
  startDate: '',
  endDate: '',
  prescribingPhysician: '',
  notes: '',
})

const readJsonSafe = async (response) => {
  const text = await response.text()
  if (!text) return []
  try {
    return JSON.parse(text)
  } catch {
    return []
  }
}

const loadTreatments = async () => {
  isLoading.value = true
  try {
    const response = await fetch(`${API_URL}/treatments`, { headers: authHeaders() })
    treatments.value = response.ok ? await readJsonSafe(response) : []
  } catch {
    treatments.value = []
  } finally {
    isLoading.value = false
  }
}

const filteredTreatments = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return treatments.value
  return treatments.value.filter((treatment) => {
    const fields = [
      treatment.condition,
      treatment.name,
      treatment.dosage || treatment.dose,
      treatment.frequency,
      treatment.route,
      treatment.prescribingPhysician,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return fields.includes(q)
  })
})

const createTreatment = async () => {
  formMessage.value = ''
  try {
    const response = await fetch(`${API_URL}/treatments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(newTreatment.value),
    })
    if (!response.ok) throw new Error('Failed')
    formMessage.value = 'Treatment added.'
    newTreatment.value = {
      condition: '',
      name: '',
      dosage: '',
      frequency: '',
      route: '',
      startDate: '',
      endDate: '',
      prescribingPhysician: '',
      notes: '',
    }
    await loadTreatments()
  } catch {
    formMessage.value = 'Failed to add treatment.'
  }
}

const startEdit = (treatment) => {
  editingId.value = treatment._id
  editTreatment.value = {
    condition: treatment.condition || '',
    name: treatment.name || '',
    dosage: treatment.dosage || treatment.dose || '',
    frequency: treatment.frequency || '',
    route: treatment.route || '',
    startDate: treatment.startDate || '',
    endDate: treatment.endDate || '',
    prescribingPhysician: treatment.prescribingPhysician || '',
    notes: treatment.notes || '',
  }
}

const cancelEdit = () => {
  editingId.value = null
  editTreatment.value = {
    condition: '',
    name: '',
    dosage: '',
    frequency: '',
    route: '',
    startDate: '',
    endDate: '',
    prescribingPhysician: '',
    notes: '',
  }
}

const saveEdit = async (id) => {
  try {
    const response = await fetch(`${API_URL}/treatments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(editTreatment.value),
    })
    if (!response.ok) throw new Error('Failed')
    cancelEdit()
    await loadTreatments()
  } catch {
    formMessage.value = 'Failed to update treatment.'
  }
}

const deleteTreatment = async (id) => {
  try {
    const response = await fetch(`${API_URL}/treatments/${id}`, { method: 'DELETE', headers: authHeaders() })
    if (!response.ok) throw new Error('Failed')
    await loadTreatments()
  } catch {
    formMessage.value = 'Failed to delete treatment.'
  }
}

onMounted(() => {
  loadTreatments()
})
</script>
