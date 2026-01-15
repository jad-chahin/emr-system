<template>
  <div class="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
    <section class="mx-auto w-full max-w-[900px] px-6 py-12">
      <header class="text-center">
        <p class="text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">Patient Access</p>
        <h1 class="mt-2 text-3xl font-semibold">Patient Login</h1>
        <p class="mt-2 text-sm text-[color:var(--muted)]">
          Enter your details to view your profile.
        </p>
      </header>

      <div class="mt-8 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
        <div v-if="successMessage" class="mb-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--success)]">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage === 'No result!'" class="mb-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--error)]">
          Error occurred with logging in. Make sure you input the correct name and health card number.
        </div>

        <form @submit.prevent="submitForm" class="space-y-6">
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Patient First Name</label>
              <input
                class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm"
                type="text"
                v-model="patientFirstName"
              >
            </div>
            <div>
              <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Patient Last Name</label>
              <input
                class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm"
                type="text"
                v-model="lastName"
              >
            </div>
          </div>

          <div>
            <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Health Card</label>
            <input
              class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm"
              type="text"
              v-model="cardNumber"
            >
          </div>

          <div class="flex justify-center">
            <button
              class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:var(--accent)] px-8 text-sm font-semibold text-[#06201B]"
              type="submit"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      patientFirstName: '',
      lastName: '',
      dateOfBirth: '',
      address: '',
      sex: '',
      cardNumber: '',
      patients: [],
      conditions: [],
      selectedConditions: [],
      filteredPatients: [],
      hasSearched: false,
      phoneNum: '',
      email: '',
      emergencyContactName: '',
      emergencyContactRelationship: '',
      emergencyContactPhone: '',
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    async fetchPatients() {
      try {
        const response = await axios.get(`${API_URL}/patients`);
        this.patients = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    submitForm() {
      this.filteredPatients = this.patients.filter(patient => {
        const firstNameMatch = patient.firstName.toLowerCase() === this.patientFirstName.toLowerCase();
        const lastNameMatch = patient.lastName.toLowerCase() === this.lastName.toLowerCase();
        const cardNumberMatch = patient.cardNumber.toLowerCase() === this.cardNumber.toLowerCase();
        return firstNameMatch && lastNameMatch && cardNumberMatch;
      });

      if (this.filteredPatients.length === 0) {
        this.errorMessage = "No result!";
        this.successMessage = "";
      } else {
        this.errorMessage = "";
        this.$router.push({ name: 'PatientProfile', params: { patient: this.filteredPatients[0]._id } });
      }
    },
  },
  created() {
    this.fetchPatients();
    let storedResults = localStorage.getItem('searchResults');
    let storedState = localStorage.getItem('searchState');
    if (storedResults && storedState) {
      this.filteredPatients = JSON.parse(storedResults);
      Object.assign(this, JSON.parse(storedState));
    }
  }
};
</script>
