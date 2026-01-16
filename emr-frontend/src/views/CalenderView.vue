<template>
  <div class="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
    <section class="mx-auto w-full max-w-[1200px] px-6 py-10">
      <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">Appointments</p>
          <h1 class="text-2xl font-semibold">Schedule Center</h1>
          <p class="text-sm text-[color:var(--muted)]">Manage patient visits and appointment details.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex h-10 items-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 text-sm text-[color:var(--muted)]">
            {{ formattedDate }}
          </span>
          <button
            class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[#06201B]"
            @click="isDoingForm(true)"
          >
            Make Appointment
          </button>
        </div>
      </header>

      <div class="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <section class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-5">
          <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Selected Date</p>
          <p class="mt-2 text-sm text-[color:var(--muted)]">{{ formattedDate }}</p>
          <div class="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-3">
            <DatePicker v-model="date" expanded class="w-full" :is-dark="true" color="teal" />
          </div>
          <div class="mt-4 space-y-3">
            <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
              <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Appointments</p>
              <p class="mt-2 text-2xl font-semibold">{{ appointmentCount }}</p>
              <p class="text-xs text-[color:var(--muted)] mt-1">Scheduled for the day</p>
            </div>
            <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
              <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">First Slot</p>
              <p class="mt-2 text-2xl font-semibold">{{ firstAppointmentTime }}</p>
              <p class="text-xs text-[color:var(--muted)] mt-1">Earliest time</p>
            </div>
          </div>
        </section>

        <section class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-5">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Appointments</h2>
            <span class="text-xs text-[color:var(--muted)]">
              {{ appointmentCount }} total
            </span>
          </div>

          <div class="mt-4 overflow-x-auto">
            <div v-if="appointments && appointments.length" class="space-y-3">
              <div
                v-for="app in appointments"
                :key="app._id"
                class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4"
              >
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div class="flex items-center gap-2">
                      <p class="text-sm font-semibold">
                        <router-link
                          v-if="appointmentPatient(app)"
                          class="text-[color:var(--accent)] hover:underline"
                          :to="`/patients/${appointmentPatient(app)._id}`"
                        >
                          {{ appointmentPatient(app).firstName }} {{ appointmentPatient(app).lastName }}
                        </router-link>
                        <span v-else class="text-[color:var(--muted)]">
                          {{ appointmentNameFallback(app) || 'Patient not linked' }}
                        </span>
                      </p>
                      <span class="text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                        {{ app.startTime }} - {{ app.endTime }}
                      </span>
                    </div>
                    <p class="text-xs text-[color:var(--muted)] mt-1">
                      {{ app.notes || "No notes" }}
                    </p>
                  </div>
                  <button
                    class="inline-flex h-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 text-xs text-[color:var(--error)]"
                    @click="deleteAppointment(app)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="rounded-2xl border border-dashed border-[color:var(--border)] px-4 py-6 text-sm text-[color:var(--muted)]">
              No appointments scheduled for the selected date.
            </div>
          </div>
        </section>
      </div>

      <div v-if="isOn" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
        <div class="w-full max-w-2xl rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
          <form @submit.prevent="makeAppointment(date)">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">New Appointment</p>
                <h2 class="text-lg font-semibold">Selected Date: {{ formattedDate }}</h2>
              </div>
              <button
                type="button"
                class="inline-flex h-9 items-center justify-center rounded-xl border border-[color:var(--border)] px-3 text-xs"
                @click="isDoingForm(false)"
              >
                Close
              </button>
            </div>

            <div class="mt-6 grid gap-4 lg:grid-cols-2">
              <div class="lg:col-span-2">
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Patient</label>
                <select
                  class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm"
                  v-model="selectedPatientId"
                  required
                >
                  <option value="" disabled>Select a patient</option>
                  <option v-for="patient in patientList" :key="patient.patientID" :value="patient.patientID">
                    {{ patient.name }} • Card {{ patient.cardNumber }}
                  </option>
                </select>
              </div>

              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Start Time</label>
                <div class="mt-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-2">
                  <DatePicker mode="time" v-model="info.startTime" :is-dark="true" color="teal" />
                </div>
              </div>

              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">End Time</label>
                <div class="mt-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-2">
                  <DatePicker mode="time" v-model="info.endTime" :is-dark="true" color="teal" />
                </div>
              </div>
            </div>

            <div class="mt-4">
              <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Notes</label>
              <input
                class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm"
                type="text"
                v-model="info.notes"
              />
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-6">
              <input
                id="notify-patient"
                type="checkbox"
                class="h-4 w-4 rounded border border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--accent)]"
                v-model="notifyPatient"
              />
              <label for="notify-patient" class="text-sm text-[color:var(--muted)]">
                Notify patient by SMS
              </label>

              <input
                id="notify-patient-email"
                type="checkbox"
                class="h-4 w-4 rounded border border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--accent)]"
                v-model="notifyPatientEmail"
              />
              <label for="notify-patient-email" class="text-sm text-[color:var(--muted)]">
                Notify patient by email
              </label>
            </div>

            <div class="mt-6 flex flex-wrap gap-3">
              <button class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[#06201B]" type="submit">
                Submit
              </button>
              <button
                type="button"
                class="inline-flex h-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-5 text-sm"
                @click="isDoingForm(false)"
              >
                Cancel
              </button>
            </div>

            <div v-if="hasErrorMessage" class="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--error)]">
              Please enter a valid patient name.
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, watch, onMounted, computed } from 'vue';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import axios from 'axios';

import emailjs, { send } from 'emailjs-com';

emailjs.init('2aRoZGFYWXbozLSuh');

const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);

export default {
  components: {
    DatePicker,
  },
  setup() {
    let isOn = ref(false);
    const date = ref(new Date());

    let patientList = ref(null);
    let searchOptions = ref();
    let inSearchBar = ref();
    let isSelected = ref(false);
    let selectedPatientId = ref('');
    let notifyPatient = ref(true);
    let notifyPatientEmail = ref(true);
    let hasErrorMessage = ref(false);
    let info = ref({
      patientName: '',
      date: '',
      startTime: new Date(),
      endTime: new Date(),
      notes: '',
    });

    let token = localStorage.getItem('token') || null;

    if (!token) {
      window.location = ('/');
    }

    function showOptions() {
      try {
        return !((inSearchBar.value.length <= 0) || (isSelected.value));
      } catch (error) {
        return false;
      }
    }

    let appointments = ref(null);
    watch(date, () => {
      getAppointments(date.value);
    });
    watch(inSearchBar, (newValue) => {
      inSearchBar.value = newValue;
      try {
        if (!(inSearchBar.value === searchOptions.value[0])) {
          isSelected.value = false;
        }
      } catch (error) {
        isSelected.value = false;
      }

      filterSearch();
    });

    onMounted(() => {
      getPatients();
      getAppointments(date.value);
    });

    function normalizeDate(value) {
      return value instanceof Date && !Number.isNaN(value.getTime()) ? value : new Date();
    }

    async function getAppointments(date) {
      const safeDate = normalizeDate(date);
      try {
        const response = await axios.get(`${API_URL}/calendar/appointments`, {
          params: {
            date: safeDate.toLocaleDateString()
          },
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        appointments.value = response.data;
        appointments.value.forEach(async (a) => {
          if (typeof a.patient !== 'string') {
            return;
          }
          const id = a.patient;
          a.patient = await axios.get(`${API_URL}/patients/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
        });
        sortTimeEariliest();
      } catch (error) {
        console.error("Error getting data from getAppointments", error);
      }
    }

    function sortTimeEariliest() {
      appointments.value = appointments.value.sort((a, b) => {
        const d1 = new Date(`2000-01-01 ${a.startTime}`);
        const d2 = new Date(`2000-01-01 ${b.startTime}`);
        if (d1 < d2) {
          return -1;
        }
        if (d1 > d2) {
          return 1;
        }
        return 0;
      });
    }

    async function makeAppointment(date) {
      const safeDate = normalizeDate(date);
      info.value.date = safeDate.toLocaleDateString();
      const selected = patientList.value?.find((p) => p.patientID === selectedPatientId.value);
      if (selected) {
        hasErrorMessage.value = false;
        info.value.patientName = selected.name;
        try {
          await axios.post(`${API_URL}/appointments`, {
            patientDeats: info.value.patientName,
            patient: selected.patientID,
            patientId: selected.patientID,
            patientName: info.value.patientName,
            patientCardNumber: selected.cardNumber,
            date: info.value.date,
            startTime: info.value.startTime.toLocaleTimeString(),
            endTime: info.value.endTime.toLocaleTimeString(),
            notes: info.value.notes,
          }, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });

          if (notifyPatient.value || notifyPatientEmail.value) {
            await sendNotifications(selected.patientID, selected.name);
          }
          location.reload();
        } catch (error) {
          console.error(error);
        }
      } else {
        hasErrorMessage.value = true;
        return "";
      }
    }

    async function sendNotifications(patientId, patientName) {
      try {
        const request = await axios.get(`${API_URL}/patients/${patientId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const phone = request?.data?.contact?.phone;
        const email = request?.data?.contact?.email;

        if (notifyPatient.value && phone) {
          try {
            await axios.post(`${API_URL}/send-sms`, {
              to: phone,
              message: `Your appointment is scheduled for ${info.value.date} at ${info.value.startTime.toLocaleTimeString()}.`
            }, {
              headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
          } catch (error) {
            console.error('Failed to send SMS', error?.response?.data || error?.message || error);
          }
        }

        if (notifyPatientEmail.value && email) {
          try {
            await axios.post(`${API_URL}/send-email`, {
              to: email,
              subject: 'Appointment Confirmation',
              text: `Your appointment is scheduled for ${info.value.date} at ${info.value.startTime.toLocaleTimeString()}.\n
If this was not you, please log into the EMR application and delete this appointment immediately.\n\nRegards,\nEMR Team`
            }, {
              headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
          } catch (error) {
            console.error('Failed to send email', error?.response?.data || error?.message || error);
          }
        }
      } catch (error) {
        console.error('Failed to notify patient', error);
      }
    }

    async function deleteAppointment(date) {
      try {
        await axios.delete(`${API_URL}/appointments/${date._id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        logActivity('Appointment deleted', appointmentNameFallback(date) || 'Appointment');
        location.reload();
      } catch (error) {
        console.error(error);
      }
    }

    function findName(a) {
      let foundName = false;
      patientList.value.forEach((b) => {
        if ((b.name) === a.substring(0, a.indexOf(","))) {
          foundName = true;
        }
      });
      return foundName;
    }

    function formatDate(date) {
      return normalizeDate(date).toLocaleDateString();
    }

    const formattedDate = computed(() => formatDate(date.value));
    const appointmentCount = computed(() => (appointments.value ? appointments.value.length : 0));
    const firstAppointmentTime = computed(() => (appointments.value && appointments.value.length ? appointments.value[0].startTime : 'N/A'));
    const patientMap = computed(() => {
      const list = patientList.value || [];
      return list.reduce((acc, patient) => {
        acc[patient.patientID] = patient;
        return acc;
      }, {});
    });

    async function getPatients() {
      try {
        let response = await axios.get(`${API_URL}/patients`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        patientList.value = response.data;
        patientList.value = patientList.value.map((a) => {
          return { name: a.firstName + " " + a.lastName, patientID: a._id, cardNumber: a.cardNumber };
        });
      } catch (error) {
        console.error(error);
      }
    }

    function filterSearch() {
      searchOptions.value = patientList.value.filter((a) => {
        if (a.name.toLowerCase().includes(inSearchBar.value.toLowerCase())) {
          return a.name;
        }
      }).map((a) => a.name + ", Card Number: " + a.cardNumber);
    }

    function selectOption(option) {
      inSearchBar.value = option;
      isSelected.value = true;
    }

    function appointmentPatient(app) {
      if (app?.patient?.data) {
        return app.patient.data;
      }
      if (app?.patient?.firstName) {
        return app.patient;
      }
      const patientId = typeof app?.patient === 'string' ? app.patient : app?.patient?._id;
      return patientMap.value[patientId];
    }

    function appointmentNameFallback(app) {
      const name = app?.patientName || app?.patientDeats || '';
      const card = app?.patientCardNumber || '';
      if (name && card) return `${name} • Card ${card}`;
      return name || app?.patient || '';
    }

    function logActivity(title, detail) {
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

    function isDoingForm(a) {
      isOn.value = a;
    }

    function hasAppointments() {
      return appointments.value.length > 0;
    }

    async function sendEmail(patientEmail, subject, message) {
      const templateParams = {
        to_email: patientEmail,
        subject: subject,
        message: message,
      };

      emailjs.send('emr-reminders', 'reminder-template', templateParams)
        .then(response => {
          console.log('Email sent successfully!', response.status, response.text);
        })
        .catch(error => {
          console.error('Failed to send email.', error);
        });

      location.reload();
    }

    return {
      date,
      formattedDate,
      appointmentCount,
      firstAppointmentTime,
      appointmentPatient,
      appointmentNameFallback,
      logActivity,
      info,
      makeAppointment,
      appointments,
      deleteAppointment,
      patientList,
      selectOption,
      inSearchBar,
      selectedPatientId,
      notifyPatient,
      notifyPatientEmail,
      searchOptions,
      showOptions,
      isOn,
      isDoingForm,
      hasErrorMessage,
      sendEmail,
      hasAppointments
    };
  },
};
</script>

<style>
.vc-container {
  --vc-popover-content-bg: var(--surface-2);
  --vc-popover-content-color: var(--text);
  --vc-popover-content-border: var(--border);
  --vc-header-title-color: var(--text);
  --vc-header-arrow-color: var(--text);
  --vc-header-arrow-hover-bg: rgba(255, 255, 255, 0.06);
  --vc-weekday-color: var(--muted);
  --vc-day-content-hover-bg: rgba(255, 255, 255, 0.08);
  --vc-highlight-solid-bg: rgba(45, 212, 191, 0.25);
  --vc-highlight-solid-content-color: var(--text);
  --vc-time-picker-border: var(--border);
  --vc-time-select-group-bg: var(--surface-1);
  --vc-time-select-group-border: var(--border);
  --vc-time-select-group-icon-color: var(--muted);
  --vc-time-weekday-color: var(--muted);
  --vc-time-month-color: var(--text);
  --vc-time-day-color: var(--text);
  --vc-time-year-color: var(--muted);
  --vc-select-bg: var(--surface-2);
  --vc-select-color: var(--text);
  --vc-select-hover-bg: rgba(255, 255, 255, 0.06);
}

.vc-container {
  background: var(--surface-2);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 16px;
}

.vc-time-select-group select {
  color-scheme: dark;
}

.vc-time-select-group select option {
  background: var(--surface-2);
  color: var(--text);
}

.vc-time-select-group {
  background: transparent;
  border: 0;
  border-radius: 0;
}

.vc-time-select-group select {
  background: transparent;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.vc-base-select {
  background: transparent;
  border-radius: 0;
}

.vc-base-select select {
  background: transparent;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}
</style>
