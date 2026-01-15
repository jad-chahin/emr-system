<template>
  <div class="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
    <div class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0">
        <div
          class="absolute -top-28 right-[-90px] h-[320px] w-[320px] rounded-full blur-3xl opacity-25"
          style="background: radial-gradient(circle, var(--accent), transparent 70%);"
        ></div>
        <div
          class="absolute top-40 left-[-120px] h-[280px] w-[280px] rounded-full blur-3xl opacity-20"
          style="background: radial-gradient(circle, var(--accent), transparent 70%);"
        ></div>
      </div>

      <div class="mx-auto flex min-h-screen w-full max-w-[1100px] items-center px-6 py-12">
        <div class="grid w-full gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div class="flex flex-col justify-between gap-6">
            <div class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-8">
              <div class="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-1 text-xs text-[color:var(--muted)]">
                New clinician onboarding
              </div>
              <h1 class="mt-5 text-3xl font-semibold tracking-tight">Create your EMR Suite account</h1>
              <p class="mt-2 text-sm text-[color:var(--muted)]">
                Set up your secure workspace in minutes. No PHI. Demo data only.
              </p>
              <div class="mt-6 grid gap-3">
                <div class="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm">
                  <span class="h-2 w-2 rounded-full bg-[color:var(--accent)]"></span>
                  Guided setup checklist
                </div>
                <div class="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm">
                  <span class="h-2 w-2 rounded-full bg-[color:var(--accent)]"></span>
                  Secure by default
                </div>
                <div class="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm">
                  <span class="h-2 w-2 rounded-full bg-[color:var(--accent)]"></span>
                  Tailored workspace settings
                </div>
              </div>
            </div>

            <div class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6 text-sm text-[color:var(--muted)]">
              Already have an account?
              <RouterLink to="/login" class="font-semibold text-[color:var(--accent)]">Log in</RouterLink>
            </div>
          </div>

          <div class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-8 shadow-[0_1px_0_rgba(0,0,0,0.18),0_12px_32px_rgba(0,0,0,0.2)]">
            <h2 class="text-xl font-semibold">Create account</h2>
            <p class="mt-2 text-sm text-[color:var(--muted)]">Set up clinician credentials to access the suite.</p>

            <form class="mt-6 space-y-4" @submit.prevent="createAccount">
              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]" for="firstName">First name</label>
                <input
                  id="firstName"
                  v-model="account.firstName"
                  type="text"
                  required
                  autocomplete="given-name"
                  class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                  placeholder="Jordan"
                />
              </div>

              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]" for="lastName">Last name</label>
                <input
                  id="lastName"
                  v-model="account.lastName"
                  type="text"
                  required
                  autocomplete="family-name"
                  class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                  placeholder="Smith"
                />
              </div>

              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]" for="email">Email</label>
                <input
                  id="email"
                  v-model="account.email"
                  type="email"
                  required
                  autocomplete="email"
                  class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                  placeholder="you@clinic.com"
                />
              </div>

              <div>
                <label class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]" for="password">Password</label>
                <input
                  id="password"
                  v-model="account.password"
                  type="password"
                  required
                  autocomplete="new-password"
                  class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                  placeholder="Create a strong password"
                />
              </div>

              <div v-if="successMessage" class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--success)]">
                {{ successMessage }}
              </div>
              <div v-if="errorMessage" class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--error)]">
                {{ errorMessage }}
              </div>

              <button
                type="submit"
                class="mt-2 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[color:var(--accent)] text-sm font-semibold text-[#06201B]
                       hover:brightness-110 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              >
                Create account
              </button>
            </form>

            <p class="mt-4 text-xs text-[color:var(--muted)]">
              By creating an account, you agree to the secure usage guidelines for this demo environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const API_URL = import.meta.env.VITE_API_URL;

export default {
  name: 'AccountForm',
  data() {
    return {
      account: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      },
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    async createAccount() {
      this.successMessage = '';
      this.errorMessage = '';
      try {
        const response = await fetch(`${API_URL}/user/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.account)
        });
        if (response.ok) {
          this.successMessage = 'Account created successfully!';
          const redirectTarget = this.$route.query.redirect
            ? decodeURIComponent(this.$route.query.redirect)
            : '/app/dashboard';
          const loginPath = `/login?redirect=${encodeURIComponent(redirectTarget)}`;
          setTimeout(() => this.$router.push(loginPath), 1000);
        } else {
          const data = await response.json();
          this.errorMessage = data.message || 'Failed to create account.';
        }
      } catch (error) {
        console.error('Error:', error);
        this.errorMessage = 'Something went wrong. Please try again later.';
      }
    }
  }
};
</script>
