<template>
  <div class="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
    <section class="mx-auto w-full max-w-[1200px] px-6 py-10">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">Patient Profile</p>
          <h1 class="text-2xl font-semibold tracking-tight" v-text="patientName"></h1>
          <p class="text-sm text-[color:var(--muted)]">Clinical overview and visit history.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            class="inline-flex h-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 text-sm"
            @click="goBack"
          >
            Back to Patients
          </button>
          <button
            v-if="token"
            class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:var(--accent)] px-4 text-sm font-semibold text-[#06201B]"
            @click="openContactOverlay(true)"
          >
            Contact Preference
          </button>
        </div>
      </header>

      <section class="mt-8 grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-lg font-semibold">Patient Summary</h2>
              <p class="text-sm text-[color:var(--muted)] mt-1">Core demographics and contact details.</p>
            </div>
            <span class="text-[12px] rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-1 text-[color:var(--muted)]">
              {{ patient?.contactPreference || 'Unknown preference' }}
            </span>
          </div>

          <div v-if="loadingPatient" class="mt-6 space-y-3">
            <div class="h-4 w-1/3 rounded-lg bg-white/5 border border-[color:var(--border)] animate-pulse"></div>
            <div class="h-4 w-2/3 rounded-lg bg-white/5 border border-[color:var(--border)] animate-pulse"></div>
            <div class="h-4 w-1/2 rounded-lg bg-white/5 border border-[color:var(--border)] animate-pulse"></div>
          </div>

          <div v-else-if="patient" class="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Name</p>
              <p class="mt-1 text-sm">{{ patient.firstName }} {{ patient.lastName }}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">DOB</p>
              <p class="mt-1 text-sm">{{ patient.dateOfBirth || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Sex</p>
              <p class="mt-1 text-sm">{{ patient.sex || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Health Card</p>
              <p class="mt-1 text-sm">{{ patient.cardNumber || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Phone</p>
              <p class="mt-1 text-sm">{{ patient.contact?.phone || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Email</p>
              <p class="mt-1 text-sm">{{ patient.contact?.email || 'N/A' }}</p>
            </div>
            <div class="sm:col-span-2">
              <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Address</p>
              <p class="mt-1 text-sm">{{ patient.address || 'N/A' }}</p>
            </div>
          </div>

          <div v-else class="mt-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5 text-sm text-[color:var(--muted)]">
            Patient record unavailable.
          </div>
        </div>

        <div class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
          <h2 class="text-lg font-semibold">Care Summary</h2>
          <p class="text-sm text-[color:var(--muted)] mt-1">Key signals at a glance.</p>
          <div class="mt-6 space-y-3">
            <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
              <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Treatments</p>
              <p class="mt-1 text-2xl font-semibold">{{ treatmentsList.length }}</p>
              <p class="text-xs text-[color:var(--muted)] mt-1">Active records</p>
            </div>
            <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
              <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Appointments</p>
              <p class="mt-1 text-2xl font-semibold">{{ appointments.length }}</p>
              <p class="text-xs text-[color:var(--muted)] mt-1">Total scheduled</p>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-8 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-lg font-semibold">Conditions & Treatments</h2>
            <p class="text-sm text-[color:var(--muted)]">Clinical treatments assigned to this patient.</p>
          </div>
          <div class="flex flex-wrap items-center gap-2" v-if="token">
            <button
              class="inline-flex h-10 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 text-sm"
              @click="openTreatmentForm(true)"
            >
              Add Treatment
            </button>
            <button
              class="inline-flex h-10 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 text-sm"
              @click="openLibraryOverlay(true)"
            >
              Add from Library
            </button>
          </div>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table v-if="treatmentsList.length" class="w-full text-sm">
            <thead class="text-left text-[12px] uppercase tracking-wide text-[color:var(--muted)]">
              <tr>
                <th class="px-3 py-2">Condition</th>
                <th class="px-3 py-2">Treatment</th>
                <th class="px-3 py-2">Frequency</th>
                <th class="px-3 py-2">Route</th>
                <th class="px-3 py-2">Dosage</th>
                <th class="px-3 py-2">Start</th>
                <th class="px-3 py-2">End</th>
                <th class="px-3 py-2">Physician</th>
                <th class="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[color:var(--border)]">
              <tr v-for="treatment in treatmentsList" :key="treatment._id" class="hover:bg-white/5">
                <td class="px-3 py-2">{{ treatment.condition || 'N/A' }}</td>
                <td class="px-3 py-2">{{ treatment.name || 'N/A' }}</td>
                <td class="px-3 py-2">{{ treatment.frequency || 'N/A' }}</td>
                <td class="px-3 py-2">{{ treatment.route || 'N/A' }}</td>
                <td class="px-3 py-2">{{ treatment.dosage || 'N/A' }}</td>
                <td class="px-3 py-2">{{ formatDate(treatment.startDate) }}</td>
                <td class="px-3 py-2">{{ formatDate(treatment.endDate) }}</td>
                <td class="px-3 py-2">{{ treatment.prescribingPhysician || 'N/A' }}</td>
                <td class="px-3 py-2 text-right">
                  <button
                    v-if="token"
                    class="inline-flex h-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 text-xs text-[color:var(--error)]"
                    @click="clearTreatment(treatment)"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="rounded-2xl border border-dashed border-[color:var(--border)] px-4 py-6 text-sm text-[color:var(--muted)]">
            No treatments on file.
          </div>
        </div>
      </section>

      <section class="mt-8 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-lg font-semibold">Appointments</h2>
            <p class="text-sm text-[color:var(--muted)]">Visit history and upcoming schedule.</p>
          </div>
          <button
            v-if="token"
            class="inline-flex h-10 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 text-sm"
            @click="sendToAppointmentPage"
          >
            Create Appointment
          </button>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table v-if="appointments.length" class="w-full text-sm">
            <thead class="text-left text-[12px] uppercase tracking-wide text-[color:var(--muted)]">
              <tr>
                <th class="px-3 py-2">Notes</th>
                <th class="px-3 py-2">Date</th>
                <th class="px-3 py-2">Start</th>
                <th class="px-3 py-2">End</th>
                <th class="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[color:var(--border)]">
              <tr v-for="appointment in appointments" :key="appointment._id" class="hover:bg-white/5">
                <td class="px-3 py-2">{{ appointment.notes || 'No notes' }}</td>
                <td class="px-3 py-2">{{ appointment.date || 'N/A' }}</td>
                <td class="px-3 py-2">{{ appointment.startTime || 'N/A' }}</td>
                <td class="px-3 py-2">{{ appointment.endTime || 'N/A' }}</td>
                <td class="px-3 py-2 text-right">
                  <button
                    v-if="token"
                    class="inline-flex h-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 text-xs text-[color:var(--error)]"
                    @click="deleteAppointment(appointment)"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="rounded-2xl border border-dashed border-[color:var(--border)] px-4 py-6 text-sm text-[color:var(--muted)]">
            No appointments found for this patient.
          </div>
        </div>
      </section>
    </section>

    <div v-if="contactOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div class="w-full max-w-lg rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Contact Preference</p>
            <h2 class="text-lg font-semibold">Update Preference</h2>
            <p class="text-sm text-[color:var(--muted)] mt-1">Current: {{ patient?.contactPreference || 'Unknown' }}</p>
          </div>
          <button
            class="inline-flex h-9 items-center justify-center rounded-xl border border-[color:var(--border)] px-3 text-xs"
            @click="openContactOverlay(false)"
          >
            Close
          </button>
        </div>
        <div class="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            class="inline-flex h-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] text-sm"
            @click="selectPreference('email')"
          >
            Email
          </button>
          <button
            class="inline-flex h-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] text-sm"
            @click="selectPreference('sms')"
          >
            SMS
          </button>
        </div>
      </div>
    </div>

    <div v-if="libraryOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div class="w-full max-w-3xl rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Treatment Library</p>
            <h2 class="text-lg font-semibold">Add Existing Treatment</h2>
            <p class="text-sm text-[color:var(--muted)] mt-1">Choose a treatment template to attach to this patient.</p>
          </div>
          <button
            class="inline-flex h-9 items-center justify-center rounded-xl border border-[color:var(--border)] px-3 text-xs"
            @click="openLibraryOverlay(false)"
          >
            Close
          </button>
        </div>

        <div class="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2">
          <input
            v-model="librarySearch"
            type="text"
            placeholder="Search by condition, name, dosage, or route"
            class="w-full bg-transparent text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus-visible:outline-none"
          />
        </div>

        <div v-if="libraryLoading" class="mt-4 space-y-2">
          <div class="h-10 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] animate-pulse"></div>
          <div class="h-10 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] animate-pulse"></div>
        </div>
        <div v-else-if="filteredLibraryTreatments.length === 0" class="mt-4 text-sm text-[color:var(--muted)]">
          {{ librarySearch.trim().length ? 'No treatments match this search.' : 'No treatments available.' }}
        </div>
        <div v-else class="mt-4 max-h-[360px] space-y-3 overflow-auto pr-1">
          <div
            v-for="treatment in filteredLibraryTreatments"
            :key="treatment._id"
            class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4"
          >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div class="text-sm font-semibold">{{ treatment.name }}</div>
                <div class="text-xs text-[color:var(--muted)]">
                  {{ treatment.condition || 'No condition' }} | {{ treatment.dosage || treatment.dose || 'No dosage' }} | {{ treatment.route || 'No route' }}
                </div>
                <div class="text-xs text-[color:var(--muted)]">{{ treatment.frequency || 'No frequency' }}</div>
              </div>
              <button
                class="inline-flex h-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 text-xs"
                @click="assignLibraryTreatment(treatment._id)"
              >
                Add to Patient
              </button>
            </div>
          </div>
        </div>

        <div v-if="libraryMessage" class="mt-4 text-sm text-[color:var(--muted)]">
          {{ libraryMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default {
  name: "PatientProfile",
  data() {
    return {
      patient: null,
      appointments: [],
      loadingPatient: false,
      loadingAppointments: false,
      contactOpen: false,
      libraryOpen: false,
      libraryLoading: false,
      librarySearch: '',
      libraryTreatments: [],
      libraryMessage: '',
      token: null,
    };
  },
  computed: {
    patientName() {
      if (!this.patient) return "Patient";
      return `${this.patient.firstName || ""} ${this.patient.lastName || ""}`.trim() || "Patient";
    },
    treatmentsList() {
      if (!this.patient || !this.patient.treatments) return [];
      return Array.isArray(this.patient.treatments) ? this.patient.treatments : [];
    },
    filteredLibraryTreatments() {
      const q = this.librarySearch.trim().toLowerCase();
      if (!q) return this.libraryTreatments;
      return this.libraryTreatments.filter((treatment) => {
        const fields = [
          treatment.condition,
          treatment.name,
          treatment.dosage || treatment.dose,
          treatment.frequency,
          treatment.route,
          treatment.prescribingPhysician,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return fields.includes(q);
      });
    },
  },
  methods: {
    authHeaders() {
      return this.token ? { Authorization: `Bearer ${this.token}` } : {};
    },
    formatDate(value) {
      if (!value) return "N/A";
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return value;
      return parsed.toLocaleDateString();
    },
    async fetchPatient() {
      this.loadingPatient = true;
      try {
        const response = await axios.get(`${API_URL}/patients/${this.$route.params.patient}`, {
          headers: this.authHeaders(),
        });
        this.patient = response.data;
      } catch (error) {
        console.error("Failed to fetch patient data:", error);
      } finally {
        this.loadingPatient = false;
      }
    },
    async fetchAppointments() {
      this.loadingAppointments = true;
      try {
        const response = await axios.get(`${API_URL}/appointments`, {
          headers: this.authHeaders(),
        });
        this.appointments = response.data.filter((appointment) => appointment.patient == this.$route.params.patient);
      } catch (error) {
        console.error("Error getting appointments", error);
      } finally {
        this.loadingAppointments = false;
      }
    },
    openTreatmentForm() {
      this.$router.push(`/patients/add-treatment/${this.$route.params.patient}`);
    },
    async openLibraryOverlay(value) {
      this.libraryOpen = value;
      this.libraryMessage = '';
      if (value) {
        await this.fetchLibraryTreatments();
      }
    },
    openContactOverlay(value) {
      this.contactOpen = value;
    },
    goBack() {
      this.$router.push("/patients");
    },
    sendToAppointmentPage() {
      this.$router.push({ name: "Calendar" });
    },
    async selectPreference(value) {
      this.contactOpen = false;
      try {
        await axios.put(`${API_URL}/patients/${this.$route.params.patient}`, { contactPreference: value }, {
          headers: this.authHeaders(),
        });
        await this.fetchPatient();
      } catch (error) {
        console.error(error);
      }
    },
    async deleteAppointment(appointment) {
      try {
        const appointmentId = appointment?._id || appointment;
        await axios.delete(`${API_URL}/appointments/${appointmentId}`, {
          headers: this.authHeaders(),
        });
        this.appointments = this.appointments.filter((item) => item._id !== appointmentId);
        this.logActivity('Appointment deleted', this.patientName);
      } catch (error) {
        console.error(error);
      }
    },
    logActivity(title, detail) {
      try {
        const key = 'emr_activity_log';
        const stored = localStorage.getItem(key);
        const existing = stored ? JSON.parse(stored) : [];
        existing.unshift({
          id: `local-${Date.now()}`,
          title,
          detail,
          timeLabel: new Date().toLocaleDateString(),
          timestamp: new Date().toISOString()
        });
        localStorage.setItem(key, JSON.stringify(existing.slice(0, 20)));
      } catch (error) {
        console.error('Failed to log activity', error);
      }
    },
    async clearTreatment(treatment) {
      const deletedID = treatment._id || treatment;
      try {
        await axios.delete(`${API_URL}/treatments/${deletedID}`, {
          headers: this.authHeaders(),
        });
        const treatmentIds = this.treatmentsList.map((item) => item._id || item).filter(Boolean);
        const updatedTreatments = treatmentIds.filter((treatmentId) => treatmentId !== deletedID);
        await axios.put(`${API_URL}/patients/${this.$route.params.patient}`, { treatments: updatedTreatments }, {
          headers: this.authHeaders(),
        });
        await this.fetchPatient();
      } catch (error) {
        console.error(error);
      }
    },
    async fetchLibraryTreatments() {
      this.libraryLoading = true;
      try {
        const response = await axios.get(`${API_URL}/treatments`, {
          headers: this.authHeaders(),
        });
        this.libraryTreatments = response.data || [];
      } catch (error) {
        console.error(error);
        this.libraryTreatments = [];
      } finally {
        this.libraryLoading = false;
      }
    },
    async assignLibraryTreatment(treatmentId) {
      const existingIds = this.treatmentsList.map((item) => item._id || item).filter(Boolean);
      if (existingIds.includes(treatmentId)) {
        this.libraryMessage = 'This treatment is already assigned to the patient.';
        return;
      }
      try {
        const updatedTreatments = [...existingIds, treatmentId];
        await axios.put(`${API_URL}/patients/${this.$route.params.patient}`, { treatments: updatedTreatments }, {
          headers: this.authHeaders(),
        });
        this.libraryMessage = 'Treatment added to patient.';
        await this.fetchPatient();
      } catch (error) {
        console.error(error);
        this.libraryMessage = 'Failed to add treatment.';
      }
    },
  },
  created() {
    this.token = localStorage.getItem("token");
    this.fetchPatient();
    this.fetchAppointments();
  },
};
</script>
