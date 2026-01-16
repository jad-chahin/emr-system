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
              class="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[color:var(--accent)] px-8 text-sm font-semibold text-[#06201B]
                     disabled:cursor-not-allowed disabled:opacity-80"
              type="submit"
              :disabled="loading"
            >
              <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-[#06201B] border-t-transparent"></span>
              <span>{{ loading ? 'Searching...' : 'Search' }}</span>
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
      errorMessage: '',
      loading: false
    };
  },
  methods: {
    async submitForm() {
      this.errorMessage = "";
      this.successMessage = "";
      this.loading = true;

      try {
        const response = await axios.post(`${API_URL}/patient/signin`, {
          firstName: this.patientFirstName,
          lastName: this.lastName,
          cardNumber: this.cardNumber,
        });

        const { result, token } = response.data || {};

        if (token) {
          localStorage.setItem("token", token);
        }
        if (result) {
          localStorage.setItem("user", JSON.stringify(result));
        }

        if (result?._id) {
          this.$router.push({ name: 'PatientProfile', params: { patient: result._id } });
        } else {
          this.errorMessage = "No result!";
        }
      } catch (error) {
        console.error(error);
        this.errorMessage = "No result!";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
