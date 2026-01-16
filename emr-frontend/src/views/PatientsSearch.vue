<template>
  <div class="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
    <section class="mx-auto w-full max-w-[1200px] px-6 py-10">
      <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">Patients</p>
          <h1 class="text-2xl font-semibold">Patient Management</h1>
          <p class="text-sm text-[color:var(--muted)]">Add new patients and look up existing records.</p>
        </div>
        <div class="text-xs text-[color:var(--muted)]">No PHI. Demo data only.</div>
      </header>

      <section class="mt-8 grid gap-6">
        <main class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-lg font-semibold">Patient Lookup</h2>
              <p class="text-sm text-[color:var(--muted)]">Search and review patient records.</p>
            </div>
            <div class="text-xs text-[color:var(--muted)]">{{ filteredPatients.length }} results</div>
          </div>

          <div class="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, card number, or email"
              class="w-full bg-transparent text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus-visible:outline-none"
            />
          </div>

          <div class="mt-4 grid gap-4">
            <div class="space-y-2 max-h-[480px] overflow-auto pr-1">
              <div v-if="isLoadingPatients" class="space-y-2">
                <div class="h-10 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] animate-pulse"></div>
                <div class="h-10 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] animate-pulse"></div>
                <div class="h-10 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] animate-pulse"></div>
              </div>
              <div v-else-if="filteredPatients.length === 0" class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4 text-sm text-[color:var(--muted)]">
                {{ searchQuery.trim().length > 0 ? 'No patients match this search.' : 'No patients available.' }}
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

            <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
              <div v-if="isLoadingDetail" class="space-y-3">
                <div class="h-5 w-1/2 rounded-lg bg-[color:var(--surface-1)] animate-pulse"></div>
                <div class="h-4 w-2/3 rounded-lg bg-[color:var(--surface-1)] animate-pulse"></div>
                <div class="h-4 w-1/3 rounded-lg bg-[color:var(--surface-1)] animate-pulse"></div>
              </div>
              <div v-else-if="!patientDetail" class="text-sm text-[color:var(--muted)]">
                Select a patient to view details.
              </div>
              <div v-else class="space-y-3">
                <div>
                  <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Name</p>
                  <p class="text-sm font-semibold">{{ formatPatientName(patientDetail) }}</p>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Card Number</p>
                  <p class="text-sm">{{ patientDetail.cardNumber || 'Not provided' }}</p>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Contact</p>
                  <p class="text-sm">{{ patientDetail.contact?.phone || 'No phone' }}</p>
                  <p class="text-sm">{{ patientDetail.contact?.email || 'No email' }}</p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button class="inline-flex h-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 text-xs" @click="goToPatientProfile(patientDetail._id)">
                    Open Profile
                  </button>
                  <button class="inline-flex h-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 text-xs text-[color:var(--error)]" @click="deletePatient(patientDetail._id)">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-lg font-semibold">Add Patient</h2>
              <p class="text-sm text-[color:var(--muted)]">Create a new patient record.</p>
            </div>
          </div>

          <div v-if="successMessage" class="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--success)]">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--error)]">
            {{ errorMessage }}
          </div>

          <form @submit.prevent="createNewPatient" class="mt-4 space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">First Name</label>
                <input class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm" type="text" v-model="patientFirstName" />
              </div>
              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Last Name</label>
                <input class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm" type="text" v-model="lastName" />
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Date of Birth</label>
                <input class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm" type="date" v-model="dateOfBirth" />
              </div>
              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Sex</label>
                <select v-model="sex" class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Health Card</label>
              <input class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm" type="text" v-model="cardNumber" />
            </div>

            <div>
              <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Address</label>
              <input class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm" type="text" v-model="address" />
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Phone</label>
                <input class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm" type="text" v-model="phoneNum" />
              </div>
              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Email</label>
                <input class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm" type="text" v-model="email" />
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-3">
              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Emergency Contact Name</label>
                <input class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm" type="text" v-model="emergencyContactName" />
              </div>
              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Relationship</label>
                <input class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm" type="text" v-model="emergencyContactRelationship" />
              </div>
              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Emergency Contact Phone</label>
                <input class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm" type="text" v-model="emergencyContactPhone" />
              </div>
            </div>

            <div class="flex flex-wrap gap-3">
              <button class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[#06201B]" type="submit">
                Create Patient
              </button>
              <button class="inline-flex h-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-5 text-sm" type="button" @click="resetForm">
                Clear
              </button>
            </div>
          </form>
        </aside>
      </section>
    </section>
  </div>
</template>

<script>
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default {
  data() {
    return {
      patientFirstName: '',
      lastName: '',
      dateOfBirth: '',
      address: '',
      sex: '',
      cardNumber: '',
      phoneNum: '',
      email: '',
      emergencyContactName: '',
      emergencyContactRelationship: '',
      emergencyContactPhone: '',
      successMessage: '',
      errorMessage: '',
      patients: [],
      searchQuery: '',
      selectedPatientId: null,
      patientDetail: null,
      isLoadingPatients: false,
      isLoadingDetail: false,
    };
  },
  computed: {
    filteredPatients() {
      const q = this.searchQuery.trim().toLowerCase();
      if (!q) return this.patients;
      return this.patients.filter((patient) => {
        const name = `${patient.firstName || ''} ${patient.lastName || ''}`.toLowerCase();
        const email = patient.contact?.email?.toLowerCase() || '';
        const card = String(patient.cardNumber || '').toLowerCase();
        return name.includes(q) || email.includes(q) || card.includes(q);
      });
    }
  },
  methods: {
    authHeaders() {
      const token = localStorage.getItem('token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
    formatPatientName(patient) {
      const first = patient?.firstName || '';
      const last = patient?.lastName || '';
      return [first, last].filter(Boolean).join(' ') || 'Unnamed patient';
    },
    async fetchPatients() {
      this.isLoadingPatients = true;
      try {
        const response = await axios.get(`${API_URL}/patients`, { headers: this.authHeaders() });
        this.patients = response.data;
      } catch (error) {
        console.error(error);
        this.patients = [];
      } finally {
        this.isLoadingPatients = false;
      }
    },
    async loadPatientDetail(id) {
      if (!id) return;
      this.isLoadingDetail = true;
      try {
        const response = await axios.get(`${API_URL}/patients/${id}`, { headers: this.authHeaders() });
        this.patientDetail = response.data;
      } catch (error) {
        console.error(error);
        this.patientDetail = null;
      } finally {
        this.isLoadingDetail = false;
      }
    },
    selectPatient(id) {
      this.selectedPatientId = id;
      this.loadPatientDetail(id);
    },
    goToPatientProfile(patientId) {
      this.$router.push({ name: 'PatientProfile', params: { patient: patientId } });
    },
    async deletePatient(patientId) {
      try {
        const deleted = this.patients.find(patient => patient._id === patientId);
        await axios.delete(`${API_URL}/patients/${patientId}`, { headers: this.authHeaders() });
        await axios.delete(`${API_URL}/appointments/patient/${patientId}`, { headers: this.authHeaders() });
        this.patients = this.patients.filter(patient => patient._id !== patientId);
        if (this.selectedPatientId === patientId) {
          this.selectedPatientId = null;
          this.patientDetail = null;
        }
        this.successMessage = 'Patient deleted successfully.';
        this.logActivity('Patient deleted', deleted ? this.formatPatientName(deleted) : 'Patient record');
      } catch (error) {
        console.error(error);
        this.errorMessage = 'Failed to delete patient.';
      }
    },
    async createNewPatient() {
      let newPatient = {
        firstName: this.patientFirstName,
        lastName: this.lastName,
        dateOfBirth: this.dateOfBirth,
        sex: this.sex,
        address: this.address,
        contact: {
          phone: this.phoneNum,
          email: this.email,
        },
        emergencyContact: {
          name: this.emergencyContactName,
          relationship: this.emergencyContactRelationship,
          phone: this.emergencyContactPhone
        },
        cardNumber: this.cardNumber,
        conditions: [],
        contactPreference: "email"
      };

      if (this.patientFirstName !== '' && this.lastName !== '' && this.dateOfBirth !== '' && this.sex !== '' && this.address !== '' && this.phoneNum !== '' && this.email !== '' && this.emergencyContactName !== '' && this.emergencyContactRelationship !== '' && this.emergencyContactPhone !== '' && this.cardNumber !== '') {
        try {
          await axios.post(`${API_URL}/patients`, newPatient, { headers: this.authHeaders() });
          this.successMessage = 'New patient added successfully.';
          this.errorMessage = '';
          this.resetForm();
          await this.fetchPatients();
        } catch (error) {
          this.successMessage = '';
          this.errorMessage = 'Failed to add new patient.';
        }
      } else {
        this.successMessage = '';
        this.errorMessage = 'Please ensure you fill out all fields.';
      }
    },
    resetForm() {
      this.patientFirstName = '';
      this.lastName = '';
      this.dateOfBirth = '';
      this.address = '';
      this.sex = '';
      this.cardNumber = '';
      this.phoneNum = '';
      this.email = '';
      this.emergencyContactName = '';
      this.emergencyContactRelationship = '';
      this.emergencyContactPhone = '';
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
    }
  },
  created() {
    const token = localStorage.getItem('token') || null;
    if (!token) {
      window.location = ('/');
    }
    this.fetchPatients();
  }
};
</script>
