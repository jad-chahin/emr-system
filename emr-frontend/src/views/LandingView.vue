<template>
  <div class="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
    <section class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0">
        <div
          class="absolute -top-36 -left-32 h-[420px] w-[420px] rounded-full blur-3xl opacity-30"
          style="background: radial-gradient(circle, var(--accent), transparent 70%);"
        ></div>
        <div
          class="absolute -top-24 right-[-120px] h-[360px] w-[360px] rounded-full blur-3xl opacity-20"
          style="background: radial-gradient(circle, var(--accent), transparent 70%);"
        ></div>
      </div>

      <div class="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-6 pb-14 pt-16">
        <div class="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 py-1 text-[12px] text-[color:var(--muted)]">
              <span class="h-2 w-2 rounded-full bg-[color:var(--accent)]"></span>
              Calm, compliant-ready infrastructure
            </div>
            <h1 class="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              EMR Suite
              <span class="block text-[color:var(--muted)]">Secure clinical workspace</span>
            </h1>
            <p class="mt-5 text-base text-[color:var(--muted)] sm:text-lg">
              Orchestrate scheduling, patient workflows, and clinical operations with a single, secure workspace designed
              for focused care teams.
            </p>

            <div class="mt-7 flex flex-wrap items-center gap-3">
              <RouterLink
                to="/register"
                class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[#06201B]
                       hover:brightness-110 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              >
                Sign up
              </RouterLink>
              <RouterLink
                to="/login"
                class="inline-flex h-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-5 text-sm font-semibold text-[color:var(--text)]
                       hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              >
                Log in
              </RouterLink>
              <div class="text-xs text-[color:var(--muted)]">No PHI. Demo data only.</div>
            </div>

            <div class="mt-9 grid gap-4 sm:grid-cols-3">
              <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-4">
                <div class="text-sm font-semibold">Unified modules</div>
                <div class="mt-1 text-xs text-[color:var(--muted)]">Scheduling, intake, and tasking aligned.</div>
              </div>
              <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-4">
                <div class="text-sm font-semibold">Clinical-ready access</div>
                <div class="mt-1 text-xs text-[color:var(--muted)]">Role-aware access controls built in.</div>
              </div>
              <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-4">
                <div class="text-sm font-semibold">Focused UI</div>
                <div class="mt-1 text-xs text-[color:var(--muted)]">Designed for clarity, not clutter.</div>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="mb-6 overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] shadow-[0_1px_0_rgba(0,0,0,0.18),0_12px_32px_rgba(0,0,0,0.2)]">
              <img
                src="../img/doctor.jpg"
                alt="Clinician reviewing a patient chart"
                class="h-64 w-full object-cover"
                loading="eager"
              />
              <div class="flex items-center justify-between px-5 py-4">
                <div class="text-sm font-semibold">Care team focus</div>
                <span class="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-2 py-1 text-[11px] text-[color:var(--muted)]">
                  Live snapshot
                </span>
              </div>
            </div>
            <div class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6 shadow-[0_1px_0_rgba(0,0,0,0.18),0_12px_32px_rgba(0,0,0,0.2)]">
              <div class="flex items-center justify-between">
                <div class="text-sm font-semibold">Operations overview</div>
                <span class="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-2 py-1 text-[11px] text-[color:var(--muted)]">
                  Live workspace
                </span>
              </div>
              <div class="mt-5 grid gap-4">
                <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
                  <div class="text-xs text-[color:var(--muted)]">Today</div>
                  <div class="mt-2 text-lg font-semibold">Appointments</div>
                  <div class="mt-3 grid grid-cols-3 gap-2 text-xs text-[color:var(--muted)]">
                    <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 py-2">08:30 Check-in</div>
                    <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 py-2">11:00 Follow-up</div>
                    <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 py-2">15:10 Review</div>
                  </div>
                </div>
                <div class="grid gap-3 sm:grid-cols-2">
                  <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
                    <div class="text-xs text-[color:var(--muted)]">Tasks</div>
                    <div class="mt-2 text-sm font-semibold">Queue triaged</div>
                    <div class="mt-2 text-xs text-[color:var(--muted)]">4 priority items, 12 normal.</div>
                  </div>
                  <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
                    <div class="text-xs text-[color:var(--muted)]">Messages</div>
                    <div class="mt-2 text-sm font-semibold">Inbox clean</div>
                    <div class="mt-2 text-xs text-[color:var(--muted)]">All teams responded.</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="absolute -bottom-6 right-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-4 py-3 text-xs text-[color:var(--muted)] shadow-[0_1px_0_rgba(0,0,0,0.18),0_10px_26px_rgba(0,0,0,0.2)]">
              Audit-ready logs, encrypted at rest
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-t border-[color:var(--border)] bg-[color:var(--surface-2)]">
      <div class="mx-auto w-full max-w-[1200px] px-6 py-14">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">Core capabilities</p>
            <h2 class="mt-3 text-2xl font-semibold">Clinical-grade foundations, calm by design</h2>
          </div>
          <p class="max-w-[420px] text-sm text-[color:var(--muted)]">
            Everything you need to support care teams without distracting from the moment. No PHI in this demo.
          </p>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div class="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)]">
            <img
              src="../img/appointment.jpg"
              alt="Appointment schedule on a tablet"
              class="h-56 w-full object-cover object-[center_40%]"
              loading="lazy"
            />
            <div class="px-5 py-4 text-sm text-[color:var(--muted)]">
              Schedule visibility across teams, with calm layout and clear priorities.
            </div>
          </div>
          <div class="grid gap-4">
            <div class="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)]">
              <img
                src="../img/test.jpeg"
                alt="Clinician workspace details"
                class="h-40 w-full object-cover"
                loading="lazy"
              />
            </div>
            <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-5">
              <div class="text-sm font-semibold">Visual clarity</div>
              <p class="mt-2 text-sm text-[color:var(--muted)]">
                Design-led surfaces highlight the next action without visual clutter.
              </p>
            </div>
          </div>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-5">
            <div class="text-sm font-semibold">Secure access</div>
            <p class="mt-2 text-sm text-[color:var(--muted)]">Role-aware permissions, session tracking, and audit visibility.</p>
          </div>
          <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-5">
            <div class="text-sm font-semibold">Workflow focus</div>
            <p class="mt-2 text-sm text-[color:var(--muted)]">Triage queues and schedules stay aligned across teams.</p>
          </div>
          <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-5">
            <div class="text-sm font-semibold">Integration-ready</div>
            <p class="mt-2 text-sm text-[color:var(--muted)]">Structured data output to support modern interoperability stacks.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="border-t border-[color:var(--border)]">
      <div class="mx-auto w-full max-w-[1200px] px-6 py-14">
        <div class="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
            <p class="text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">Workflow</p>
            <h3 class="mt-4 text-xl font-semibold">A single calm surface for care teams</h3>
            <p class="mt-3 text-sm text-[color:var(--muted)]">
              EMR Suite keeps operational context visible without the noise. Schedules, tasks, and communications stay in
              sync so teams can focus on care.
            </p>
            <div class="mt-6 grid gap-3">
              <div class="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3">
                <span class="h-2 w-2 rounded-full bg-[color:var(--accent)]"></span>
                <span class="text-sm">Guided onboarding with clear milestones.</span>
              </div>
              <div class="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3">
                <span class="h-2 w-2 rounded-full bg-[color:var(--accent)]"></span>
                <span class="text-sm">Operational insights without PHI exposure.</span>
              </div>
              <div class="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3">
                <span class="h-2 w-2 rounded-full bg-[color:var(--accent)]"></span>
                <span class="text-sm">Reliable uptime and backup readiness.</span>
              </div>
            </div>
          </div>

          <div class="grid gap-4">
            <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
              <div class="text-sm font-semibold">Deployment readiness</div>
              <p class="mt-2 text-sm text-[color:var(--muted)]">
                Designed for secure rollouts with clear staging workflows and controlled access across departments.
              </p>
            </div>
            <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
              <div class="text-sm font-semibold">Team alignment</div>
              <p class="mt-2 text-sm text-[color:var(--muted)]">
                Shared task boards and alerts keep clinical and operations teams aligned in real time.
              </p>
            </div>
            <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
              <div class="text-sm font-semibold">Support-ready analytics</div>
              <p class="mt-2 text-sm text-[color:var(--muted)]">
                Track throughput and turnaround without exposing patient information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-t border-[color:var(--border)] bg-[color:var(--surface-2)]">
      <div class="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-6 px-6 py-14 text-center">
        <p class="text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">Ready to get started</p>
        <h2 class="text-2xl font-semibold">Launch your secure clinical workspace today</h2>
        <p class="max-w-[620px] text-sm text-[color:var(--muted)]">
          Sign up for a guided onboarding or log in to continue. No PHI. Demo data only.
        </p>
      </div>
    </section>

    <footer class="border-t border-[color:var(--border)]">
      <div class="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="text-sm font-semibold">EMR Suite</div>
          <div class="text-xs text-[color:var(--muted)]">Secure clinical workspace</div>
        </div>
        <div class="flex flex-wrap items-center gap-4 text-xs text-[color:var(--muted)]">
          <span>Security</span>
          <span>Compliance-ready</span>
          <span>Support</span>
        </div>
      </div>
    </footer>
  </div>
</template>
