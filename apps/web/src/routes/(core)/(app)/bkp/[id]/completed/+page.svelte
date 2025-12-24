<script lang="ts">
  import { page } from "$app/state";
  import Icon from "@iconify/svelte";
  import { setActiveStep, STEP_LABELS } from "../bkp-step.svelte";
  import { client } from "$lib/client.svelte";
  import Query from "$lib/components/Query.svelte";
  import { getFileUrl } from "$lib";

  $effect(() => {
    setActiveStep(STEP_LABELS.COMPLETED);
  });

  const bkpId = page.params.id;

  // Fetch BKP data
  const bkpQ = client.bKP.useFindUnique({
    where: { id: bkpId },
    include: {
      User: true,
      Grading__User: true,
    },
  });

  function calculateDurationMonths(startDate: Date | string, endDate: Date | string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return Math.max(1, months);
  }
</script>

<Query q={bkpQ}>
  {#snippet children(bkp)}
    {@const totalWeeks = bkp.WeeklyReports?.WeeklyReportList?.length || 0}
    {@const durationMonths = bkp.Proposal?.startDate && bkp.Proposal?.endDate
      ? calculateDurationMonths(bkp.Proposal.startDate, bkp.Proposal.endDate)
      : bkp.Proposal?.monthDuration || 0}

    <div class="max-w-5xl">
      <!-- Congratulations Banner -->
      <div class="card mb-4 bg-linear-to-br from-success/20 to-primary/20 shadow-xl">
        <div class="card-body p-4 text-center">
          <div
            class="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-success/20"
          >
            <Icon icon="mdi:check-circle-outline" class="h-10 w-10 text-success" />
          </div>

          <h1 class="mb-1 text-2xl font-bold">Congratulations!</h1>
          <p class="text-xs text-base-content/70">
            You have successfully completed your BKP
            {#if bkp.Proposal?.companyName}
              at {bkp.Proposal.companyName}
            {/if}
          </p>

          <div class="mt-4 flex flex-wrap justify-center gap-3">
            <div class="rounded-lg bg-base-100 px-4 py-3 shadow-md">
              <div class="text-2xl font-bold text-secondary">
                {durationMonths}
              </div>
              <div class="text-xs text-base-content/70">Months</div>
            </div>
          </div>
        </div>
      </div>

      <!-- BKP Summary -->
      <div class="card mb-4 bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <h2 class="card-title text-base">BKP Summary</h2>
          <div class="divider my-2"></div>

          <div class="grid gap-3 text-sm md:grid-cols-2">
            <div>
              <span class="font-semibold">BKP ID:</span>
              <span class="ml-2">{bkp.id}</span>
            </div>
            {#if bkp.Proposal?.companyName}
              <div>
                <span class="font-semibold">Company:</span>
                <span class="ml-2">{bkp.Proposal.companyName}</span>
              </div>
            {/if}
            {#if bkp.Proposal?.position}
              <div>
                <span class="font-semibold">Position:</span>
                <span class="ml-2">{bkp.Proposal.position}</span>
              </div>
            {/if}
            {#if bkp.Proposal?.bkpType}
              <div>
                <span class="font-semibold">Type:</span>
                <span class="ml-2">{bkp.Proposal.bkpType}</span>
              </div>
            {/if}
            {#if bkp.Proposal?.period}
              <div>
                <span class="font-semibold">Period:</span>
                <span class="ml-2">{bkp.Proposal.period}</span>
              </div>
            {/if}
            {#if bkp.Proposal?.startDate && bkp.Proposal?.endDate}
              <div>
                <span class="font-semibold">Duration:</span>
                <span class="ml-2">
                  {new Date(bkp.Proposal.startDate).toLocaleDateString("id-ID", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })} -
                  {new Date(bkp.Proposal.endDate).toLocaleDateString("id-ID", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            {/if}
            <div>
              <span class="font-semibold">Status:</span>
              <span class="ml-2">
                <span class="badge badge-success">{bkp.status}</span>
              </span>
            </div>
            <div>
              <span class="font-semibold">Last Updated:</span>
              <span class="ml-2">
                {new Date(bkp.updatedAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="card mb-4 bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <h2 class="card-title text-base">Statistics</h2>
          <div class="divider my-2"></div>

          <div class="grid gap-2 md:grid-cols-2">
            <div class="rounded-lg bg-primary/10 p-3 text-center">
              <div class="text-2xl font-bold text-primary">
                {totalWeeks}
              </div>
              <div class="text-xs text-base-content/70">Weekly Reports</div>
            </div>

            <div class="rounded-lg bg-info/10 p-3 text-center">
              <div class="text-2xl font-bold text-info">
                {durationMonths}
              </div>
              <div class="text-xs text-base-content/70">Duration (Months)</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grader Information -->
      {#if bkp.Grading__User}
        <div class="card mb-4 bg-base-100 shadow-xl">
          <div class="card-body p-4">
            <h2 class="card-title text-base">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                <Icon icon="mdi:account-outline" class="h-5 w-5 text-accent" />
              </div>
              Graded By
            </h2>

            <div class="divider my-2"></div>

            <div class="rounded-lg bg-base-200 p-3">
              <p class="text-sm font-semibold">{bkp.Grading__User.name}</p>
              <p class="text-xs text-base-content/70">@{bkp.Grading__User.username}</p>
              {#if bkp.Grading__User.role}
                <span class="badge badge-sm mt-2">{bkp.Grading__User.role}</span>
              {/if}
            </div>
          </div>
        </div>
      {/if}

      <!-- Documents -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <h2 class="card-title text-base">Documents</h2>
          <div class="divider my-2"></div>

          <div class="space-y-2">
            <!-- Field Assessment -->
            {#if bkp.FieldAssessment?.assessmentKey}
              <div
                class="flex items-center justify-between rounded-lg border-2 border-base-300 p-3 transition-all hover:border-primary/50"
              >
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-error/10">
                    <Icon icon="mdi:file-pdf-box" class="h-5 w-5 text-error" />
                  </div>

                  <div>
                    <h3 class="text-sm font-semibold">Field Assessment</h3>
                    <div class="flex gap-2 text-xs text-base-content/70">
                      <span>PDF Document</span>
                    </div>
                  </div>
                </div>

                <a
                  href={getFileUrl(bkp.FieldAssessment.assessmentKey)}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn gap-2 btn-outline btn-sm"
                >
                  <Icon icon="mdi:eye-outline" class="h-4 w-4" />
                  View
                </a>
              </div>
            {/if}

            <!-- Registration Documents -->
            {#if bkp.BKPRegistration?.pksKey}
              <div
                class="flex items-center justify-between rounded-lg border-2 border-base-300 p-3 transition-all hover:border-primary/50"
              >
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-error/10">
                    <Icon icon="mdi:file-pdf-box" class="h-5 w-5 text-error" />
                  </div>

                  <div>
                    <h3 class="text-sm font-semibold">PKS Document</h3>
                    <div class="flex gap-2 text-xs text-base-content/70">
                      <span>PDF Document</span>
                    </div>
                  </div>
                </div>

                <a
                  href={getFileUrl(bkp.BKPRegistration.pksKey)}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn gap-2 btn-outline btn-sm"
                >
                  <Icon icon="mdi:eye-outline" class="h-4 w-4" />
                  View
                </a>
              </div>
            {/if}

            {#if !bkp.FieldAssessment?.assessmentKey && !bkp.BKPRegistration?.pksKey}
              <div class="alert">
                <Icon icon="mdi:information-outline" class="h-5 w-5 shrink-0" />
                <span class="text-sm">No documents available</span>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/snippet}
</Query>
