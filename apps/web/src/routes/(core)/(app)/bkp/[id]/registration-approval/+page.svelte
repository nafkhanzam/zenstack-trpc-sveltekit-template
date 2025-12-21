<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import { resolve } from "$app/paths";
  import { client } from "$lib/client.svelte";
  import Query from "$lib/components/Query.svelte";
  import { setActiveStep, STEP_LABELS } from "../bkp-step.svelte";

  $effect(() => {
    setActiveStep(STEP_LABELS.R_APPROVAL);
  });

  const bkpId = $page.params.id;

  // Fetch BKP data with registration approval info
  const bkpQ = client.bKP.useFindUnique({
    where: { id: bkpId },
    include: {
      User: true,
      RegistrationApproval__reviewedBy_User: true,
    },
  });

  function getApprovalStatus(bkp: any): "pending" | "approved" | "rejected" {
    if (bkp.status === "WAITING_REGISTRATION_APPROVAL") {
      return "pending";
    }
    if (bkp.RegistrationApproval?.reviewedAt) {
      // If reviewed, check if moved forward or rejected
      if (
        bkp.status === "WEEKLY_REPORTING" ||
        bkp.status === "UPLOADING_FIELD_ASSESSMENT" ||
        bkp.status === "GRADING" ||
        bkp.status === "COMPLETED"
      ) {
        return "approved";
      }
      if (bkp.status === "REGISTRATION") {
        return "rejected";
      }
    }
    return "pending";
  }
</script>

<Query q={bkpQ}>
  {#snippet children(bkp)}
    {@const approvalStatus = getApprovalStatus(bkp)}
    {@const isApproved = approvalStatus === "approved"}
    {@const isRejected = approvalStatus === "rejected"}
    {@const isPending = approvalStatus === "pending"}

    <div class="max-w-5xl">
      <!-- Header -->
      <div class="mb-6">
        <div class="mb-2 flex items-center gap-2">
          {#if isPending}
            <div class="badge gap-2 badge-warning">
              <Icon icon="mdi:clock-outline" class="h-4 w-4" />
              Pending Review
            </div>
          {:else if isApproved}
            <div class="badge gap-2 badge-success">
              <Icon icon="mdi:check-circle" class="h-4 w-4" />
              Approved
            </div>
          {:else if isRejected}
            <div class="badge gap-2 badge-error">
              <Icon icon="mdi:close-circle" class="h-4 w-4" />
              Rejected
            </div>
          {/if}
        </div>
        <h1 class="mb-2 text-xl font-bold">Registration Approval</h1>
        <p class="text-xs text-base-content/70">
          Your BKP registration is being reviewed by the academic team
        </p>
      </div>

      <!-- Status Card -->
      <div class="card mb-4 bg-base-100 shadow-xl transition-all hover:shadow-2xl">
        <div class="card-body p-4">
          <h2 class="card-title text-base">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Icon icon="mdi:file-check-outline" class="h-5 w-5 text-primary" />
            </div>
            Approval Status
          </h2>
          <div class="divider my-2"></div>

          <div class="space-y-3">
            {#if isPending}
              <div class="alert alert-warning">
                <Icon icon="mdi:information-outline" class="h-6 w-6" />
                <div>
                  <h3 class="font-bold">Registration Under Review</h3>
                  <div class="text-xs">
                    Your BKP registration has been submitted and is currently being reviewed. You
                    will be notified once a decision has been made.
                  </div>
                </div>
              </div>

              <div class="stats stats-vertical shadow lg:stats-horizontal">
                <div class="stat">
                  <div class="stat-figure text-warning">
                    <Icon icon="mdi:calendar-clock" class="h-8 w-8" />
                  </div>
                  <div class="stat-title text-xs">Submitted On</div>
                  <div class="stat-value text-lg text-warning">
                    {bkp.updatedAt
                      ? new Date(bkp.updatedAt).toLocaleDateString()
                      : new Date(bkp.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div class="stat">
                  <div class="stat-figure text-info">
                    <Icon icon="mdi:clock-outline" class="h-8 w-8" />
                  </div>
                  <div class="stat-title text-xs">Review Status</div>
                  <div class="stat-value text-lg text-info">In Progress</div>
                </div>
              </div>
            {:else if isApproved}
              <div class="alert alert-success">
                <Icon icon="mdi:check-circle-outline" class="h-6 w-6" />
                <div>
                  <h3 class="font-bold">Registration Approved!</h3>
                  <div class="text-xs">
                    Your BKP registration has been approved. You can now proceed to submit weekly
                    reports.
                  </div>
                </div>
              </div>

              <div class="stats stats-vertical shadow lg:stats-horizontal">
                <div class="stat">
                  <div class="stat-figure text-success">
                    <Icon icon="mdi:calendar-check" class="h-8 w-8" />
                  </div>
                  <div class="stat-title text-xs">Approved On</div>
                  <div class="stat-value text-lg text-success">
                    {bkp.RegistrationApproval?.reviewedAt
                      ? new Date(bkp.RegistrationApproval.reviewedAt).toLocaleDateString()
                      : "-"}
                  </div>
                </div>

                <div class="stat">
                  <div class="stat-figure text-primary">
                    <Icon icon="mdi:account-check" class="h-8 w-8" />
                  </div>
                  <div class="stat-title text-xs">Reviewed By</div>
                  <div class="stat-value text-base text-primary">
                    {bkp.RegistrationApproval__reviewedBy_User?.name || "-"}
                  </div>
                </div>
              </div>

              {#if bkp.RegistrationApproval?.reviewerNotes}
                <div class="card bg-base-200">
                  <div class="card-body p-4">
                    <h3 class="card-title text-sm">Reviewer Notes</h3>
                    <p class="text-xs whitespace-pre-wrap">
                      {bkp.RegistrationApproval.reviewerNotes}
                    </p>
                  </div>
                </div>
              {/if}
            {:else if isRejected}
              <div class="alert alert-error">
                <Icon icon="mdi:alert-circle-outline" class="h-6 w-6" />
                <div>
                  <h3 class="font-bold">Registration Rejected</h3>
                  <div class="text-xs">
                    Your BKP registration has been rejected. Please review the feedback below and
                    make the necessary corrections.
                  </div>
                </div>
              </div>

              <div class="stats stats-vertical shadow lg:stats-horizontal">
                <div class="stat">
                  <div class="stat-figure text-error">
                    <Icon icon="mdi:calendar-remove" class="h-8 w-8" />
                  </div>
                  <div class="stat-title text-xs">Rejected On</div>
                  <div class="stat-value text-lg text-error">
                    {bkp.RegistrationApproval?.reviewedAt
                      ? new Date(bkp.RegistrationApproval.reviewedAt).toLocaleDateString()
                      : "-"}
                  </div>
                </div>

                <div class="stat">
                  <div class="stat-figure text-primary">
                    <Icon icon="mdi:account" class="h-8 w-8" />
                  </div>
                  <div class="stat-title text-xs">Reviewed By</div>
                  <div class="stat-value text-base text-primary">
                    {bkp.RegistrationApproval__reviewedBy_User?.name || "-"}
                  </div>
                </div>
              </div>

              <div class="card bg-error/10">
                <div class="card-body p-4">
                  <h3 class="card-title text-sm text-error">
                    <Icon icon="mdi:comment-alert-outline" class="h-5 w-5" />
                    Rejection Reason
                  </h3>
                  <p class="text-xs whitespace-pre-wrap">
                    {bkp.RegistrationApproval?.reviewerNotes || "No reason provided."}
                  </p>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- BKP Information -->
      <div class="card mb-4 bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <h2 class="card-title text-base">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-info/10">
              <Icon icon="mdi:information-outline" class="h-5 w-5 text-info" />
            </div>
            BKP Information
          </h2>
          <div class="divider my-2"></div>

          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <p class="text-xs font-semibold text-base-content/70">Company/Organization</p>
              <p class="text-sm">{bkp.Proposal?.companyName || "N/A"}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-base-content/70">Position</p>
              <p class="text-sm">{bkp.Proposal?.position || "N/A"}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-base-content/70">BKP Type</p>
              <p class="text-sm">{bkp.Proposal?.bkpType || "N/A"}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-base-content/70">Duration</p>
              <p class="text-sm">
                {bkp.Proposal?.monthDuration ? `${bkp.Proposal.monthDuration} months` : "N/A"}
              </p>
            </div>
            <div>
              <p class="text-xs font-semibold text-base-content/70">Period</p>
              <p class="text-sm">{bkp.Proposal?.period || "N/A"}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-base-content/70">Status</p>
              <p class="text-sm">{bkp.status.replace(/_/g, " ")}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap justify-end gap-4">
        <a href={resolve("/bkp")} class="btn gap-2 btn-outline">
          <Icon icon="mdi:arrow-left" class="h-5 w-5" />
          Back to List
        </a>
        {#if isRejected}
          <a href={resolve(`/bkp/${bkpId}/upload-documents`)} class="btn gap-2 btn-primary">
            <Icon icon="mdi:pencil" class="h-5 w-5" />
            Revise Registration
          </a>
        {:else if isApproved}
          <a href={resolve(`/bkp/${bkpId}/weekly-reports`)} class="btn gap-2 btn-primary">
            <Icon icon="mdi:arrow-right" class="h-5 w-5" />
            Continue to Weekly Reports
          </a>
        {/if}
      </div>
    </div>
  {/snippet}
</Query>
