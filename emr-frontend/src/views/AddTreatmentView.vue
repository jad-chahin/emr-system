<template>
  <div class="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
    <section class="mx-auto w-full max-w-[1200px] px-6 py-10" v-if="patient">
      <header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">Treatments</p>
          <h1 class="text-2xl font-semibold">Add New Treatment</h1>
          <p class="text-sm text-[color:var(--muted)]">Search Health Canada and assign a treatment plan.</p>
        </div>
        <button
          class="inline-flex h-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 text-sm"
          @click="goBack"
        >
          Back to Profile
        </button>
      </header>

      <section class="mt-8 grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <div class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
          <h2 class="text-lg font-semibold">Drug Lookup</h2>
          <p class="text-sm text-[color:var(--muted)] mt-1">Search by brand name to import dosage and routes.</p>

          <div class="mt-4 grid gap-4 sm:grid-cols-[1fr,160px]">
            <div>
              <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Drug Brand Name</label>
              <input
                class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm"
                type="text"
                id="drug-brand-name"
              >
            </div>
            <div class="flex items-end">
              <button
                class="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[color:var(--accent)] text-sm font-semibold text-[#06201B]"
                @click="drugSearch"
              >
                Search
              </button>
            </div>
          </div>

          <div class="mt-6">
            <div v-if="selectedDrug" class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm">
              Selected drug: {{ selectedDrug.brand_name }}
            </div>

            <div class="mt-4 overflow-x-auto">
              <table v-if="drugResults.length" class="w-full text-sm">
                <thead class="text-left text-[12px] uppercase tracking-wide text-[color:var(--muted)]">
                  <tr>
                    <th class="px-3 py-2">DIN</th>
                    <th class="px-3 py-2">Brand Name</th>
                    <th class="px-3 py-2">Last Updated</th>
                    <th class="px-3 py-2 text-right">Select</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[color:var(--border)]">
                  <tr v-for="drug in paginatedDrugResults" :key="drug.drug_identification_number" class="hover:bg-white/5">
                    <td class="px-3 py-2">{{ drug.drug_identification_number }}</td>
                    <td class="px-3 py-2">{{ drug.brand_name }}</td>
                    <td class="px-3 py-2">{{ drug.last_update_date }}</td>
                    <td class="px-3 py-2 text-right">
                      <button
                        class="inline-flex h-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 text-xs"
                        @click="drugSelect(drug.drug_code)"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="rounded-2xl border border-dashed border-[color:var(--border)] px-4 py-6 text-sm text-[color:var(--muted)]">
                Search to load Health Canada drug results.
              </div>
            </div>

            <div v-if="totalPages > 1" class="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                class="inline-flex h-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 text-xs"
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
              >
                Previous
              </button>
              <div class="flex flex-wrap items-center gap-2">
                <button
                  v-if="showLeadingEllipsis"
                  class="inline-flex h-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 text-xs"
                  @click="changePage(1)"
                >
                  1
                </button>
                <span v-if="showLeadingEllipsis" class="text-xs text-[color:var(--muted)]">...</span>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] text-xs"
                  :class="{ 'ring-2 ring-[color:var(--accent)]/60': page === currentPage }"
                  @click="changePage(page)"
                >
                  {{ page }}
                </button>
                <span v-if="showTrailingEllipsis" class="text-xs text-[color:var(--muted)]">...</span>
                <button
                  v-if="showTrailingEllipsis"
                  class="inline-flex h-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 text-xs"
                  @click="changePage(totalPages)"
                >
                  {{ totalPages }}
                </button>
              </div>
              <button
                class="inline-flex h-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 text-xs"
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
          <h2 class="text-lg font-semibold">Treatment Details</h2>
          <p class="text-sm text-[color:var(--muted)] mt-1">Complete the treatment plan fields.</p>

          <form class="mt-4 space-y-4" @submit.prevent="addTreatment">
            <div>
              <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Condition Name</label>
              <input class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm" type="text" v-model="newTreatment.condition" required>
            </div>
            <div>
              <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Prescribing Physician</label>
              <input class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm" type="text" v-model="newTreatment.prescribingPhysician" required>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Start Date</label>
                <input class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm" type="date" v-model="newTreatment.startDate" required>
              </div>
              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">End Date</label>
                <input class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm" type="date" v-model="newTreatment.endDate" required>
              </div>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Dosage</label>
                <select v-if="selectedDrug" name="dosage" id="dosage" v-model="newTreatment.dosage" class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm">
                  <option v-for="option in selectedDrug.dosage" :value="option.pharmaceutical_form_name" :key="option.pharmaceutical_form_name">{{ option.pharmaceutical_form_name }}</option>
                </select>
                <input class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm" type="text" disabled v-else>
              </div>
              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Route</label>
                <select v-if="selectedDrug" name="route" id="route" v-model="newTreatment.route" class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm">
                  <option v-for="option in selectedDrug.routes" :value="option.route_of_administration_name" :key="option.route_of_administration_code">{{ option.route_of_administration_name }}</option>
                </select>
                <input class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm" type="text" disabled v-else>
              </div>
            </div>
            <div>
              <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Frequency</label>
              <input class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm" type="text" v-model="newTreatment.frequency" required>
            </div>

            <div class="flex flex-wrap gap-3">
              <button class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:var(--accent)] px-6 text-sm font-semibold text-[#06201B]" type="submit">
                Submit
              </button>
              <button class="inline-flex h-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-6 text-sm" type="button" @click="clearTreatmentForm">
                Clear Form
              </button>
              <button class="inline-flex h-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-6 text-sm text-[color:var(--error)]" type="button" @click="goBack">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

export default {
  data() {
    return {
      patient: null,
      validSearch: true,
      drugs: [],
      drugResults: [],
      selectedDrug: null,
      newTreatment: {
        condition: '',
        name: '',
        dosage: '',
        frequency: '',
        route: '',
        startDate: '',
        endDate: '',
        prescribingPhysician: '',
        notes: ''
      },
      currentPage: 1,
      resultsPerPage: 10
    };
  },
  computed: {
    paginatedDrugResults() {
      const start = (this.currentPage - 1) * this.resultsPerPage;
      const end = start + this.resultsPerPage;
      return this.drugResults.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.drugResults.length / this.resultsPerPage);
    },
    visiblePages() {
      const maxButtons = 7;
      const total = this.totalPages;
      if (total <= maxButtons) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }
      const half = Math.floor(maxButtons / 2);
      let start = this.currentPage - half;
      let end = this.currentPage + half;

      if (start < 2) {
        start = 2;
        end = start + maxButtons - 3;
      }
      if (end > total - 1) {
        end = total - 1;
        start = end - (maxButtons - 3);
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    },
    showLeadingEllipsis() {
      return this.totalPages > 7 && this.currentPage > 4;
    },
    showTrailingEllipsis() {
      return this.totalPages > 7 && this.currentPage < this.totalPages - 3;
    }
  },
  methods: {
    authHeaders() {
      const token = localStorage.getItem('token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
    async allDrugs() {
      const response = await axios.get(`https://health-products.canada.ca/api/drug/drugproduct/?lang=en&type=json`)
      this.drugs = response.data;
    },
    drugSearch() {
      const drugName = document.getElementById('drug-brand-name').value.toUpperCase();
      this.drugResults = this.drugs.filter(drug => drug.brand_name.includes(drugName));
      this.currentPage = 1;
      document.getElementById('drug-brand-name').value = '';
    },
    async drugSelect(code) {
      this.drugResults = [];
      const drug = await axios.get(`https://health-products.canada.ca/api/drug/drugproduct/?lang=en&type=json&id=${code}`);
      const route = await axios.get(`https://health-products.canada.ca/api/drug/route/?lang=en&type=json&id=${code}`);
      const dosage = await axios.get(`https://health-products.canada.ca/api/drug/form/?lang=en&type=json&id=${code}`);
      this.selectedDrug = drug.data;
      this.selectedDrug.routes = route.data;
      this.selectedDrug.dosage = dosage.data;
      this.newTreatment.name = drug.data.brand_name;
      this.newTreatment.notes = drug.data.drug_code;
      console.log(this.selectedDrug)
    },
    async getPatient() {
      try {
        const response = await axios.get(`${API_URL}/patients/${this.$route.params.patient}`, {
          headers: this.authHeaders(),
        });
        this.patient = response.data;
      } catch (error) {
        console.error("Failed to fetch patient data:", error);
      }
    },
    clearTreatmentForm() {
      this.newTreatment = {
        condition: '',
        name: '',
        dosage: '',
        frequency: '',
        route: '',
        startDate: '',
        endDate: '',
        prescribingPhysician: '',
        notes: ''
      };
    },
    goBack() {
      this.$router.push(`/patients/${this.$route.params.patient}`);
    },
    async addTreatment() {
      if (this.newTreatment.condition !== '' && this.newTreatment.prescribingPhysician !== '') {
        if (this.newTreatment.name === '') {
          this.newTreatment.name = 'None';
          this.newTreatment.dosage = 'N/A';
          this.newTreatment.frequency = 'N/A';
          this.newTreatment.route = 'N/A';
          this.newTreatment.startDate = 'N/A';
          this.newTreatment.endDate = 'N/A';
        }
        try {
          const response = await axios.post(`${API_URL}/treatments`, this.newTreatment, {
            headers: this.authHeaders(),
          });
          const treatmentID = response.data._id;
          const patientResponse = await axios.get(`${API_URL}/patients/${this.$route.params.patient}`, {
            headers: this.authHeaders(),
          });
          const treatments = patientResponse.data.treatments;
          treatments.push(treatmentID);

          await axios.put(`${API_URL}/patients/${this.$route.params.patient}`, { treatments }, {
            headers: this.authHeaders(),
          });
          this.clearTreatmentForm();
          this.goBack();
        } catch (error) {
          console.error('Failed to add new treatment:', error);
        }
      } else {
        console.error('Please ensure you fill out all fields.');
      }
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  },
  created() {
    this.getPatient();
    this.allDrugs();
  }
}
</script>
