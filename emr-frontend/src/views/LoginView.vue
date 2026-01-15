<template>
  <div class="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
    <div class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0">
        <div
          class="absolute -top-24 left-[-80px] h-[320px] w-[320px] rounded-full blur-3xl opacity-25"
          style="background: radial-gradient(circle, var(--accent), transparent 70%);"
        ></div>
        <div
          class="absolute top-32 right-[-120px] h-[280px] w-[280px] rounded-full blur-3xl opacity-20"
          style="background: radial-gradient(circle, var(--accent), transparent 70%);"
        ></div>
      </div>

      <div class="mx-auto flex min-h-screen w-full max-w-[1100px] items-center px-6 py-12">
        <div class="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-8 shadow-[0_1px_0_rgba(0,0,0,0.18),0_12px_32px_rgba(0,0,0,0.2)]">
            <div class="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-1 text-xs text-[color:var(--muted)]">
              Secure access
            </div>
            <h1 class="mt-5 text-3xl font-semibold tracking-tight">Welcome back</h1>
            <p class="mt-2 text-sm text-[color:var(--muted)]">
              Sign in to EMR Suite and continue your secure clinical workspace.
            </p>

            <form class="mt-6 space-y-4" @submit.prevent="login">
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
                  autocomplete="current-password"
                  class="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                  placeholder="********"
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
                Log in
              </button>
            </form>

            <div class="mt-6 text-xs text-[color:var(--muted)]">
              Need an account?
              <RouterLink to="/register" class="font-semibold text-[color:var(--accent)]">Create one</RouterLink>
            </div>
          </div>

          <div class="flex flex-col justify-between gap-6">
            <div class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-8">
              <h2 class="text-xl font-semibold">Trusted by focused care teams</h2>
              <p class="mt-2 text-sm text-[color:var(--muted)]">
                EMR Suite keeps schedules, tasks, and communications aligned without exposing patient information.
              </p>
              <div class="mt-6 grid gap-3">
                <div class="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm">
                  <span class="h-2 w-2 rounded-full bg-[color:var(--accent)]"></span>
                  Live operational dashboards
                </div>
                <div class="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm">
                  <span class="h-2 w-2 rounded-full bg-[color:var(--accent)]"></span>
                  Audit-ready access control
                </div>
                <div class="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm">
                  <span class="h-2 w-2 rounded-full bg-[color:var(--accent)]"></span>
                  Calm, modern UI
                </div>
              </div>
            </div>

            <div class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6 text-sm text-[color:var(--muted)]">
              No PHI. Demo data only.
            </div>
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
        role: 'doctor'
      },
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      this.successMessage = '';
      this.errorMessage = '';
      const accountData = {
        ...this.account,
        email: this.account.email.toLowerCase()
      };
      try {
        const response = await fetch(`${API_URL}/user/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(accountData)
        });
        const rawText = await response.text();
        let data = {};
        if (rawText) {
          try {
            data = JSON.parse(rawText);
          } catch {
            data = {};
          }
        }
        if (response.ok) {
          this.successMessage = 'Login successful!';
          if (data?.result) {
            localStorage.setItem("user", JSON.stringify(data.result));
          }
          if (data?.token) {
            localStorage.setItem("token", data.token);
          }
          const redirectTarget = this.$route.query.redirect
            ? decodeURIComponent(this.$route.query.redirect)
            : '/app/dashboard';
          setTimeout(() => {
            this.$router.replace(redirectTarget);
          }, 500);
        } else {
          this.errorMessage = data.message || 'Failed to login.';
        }
      } catch (error) {
        console.error('Error:', error);
        this.errorMessage = 'Something went wrong. Please try again later.';
      }
    }
  }
};
</script>
