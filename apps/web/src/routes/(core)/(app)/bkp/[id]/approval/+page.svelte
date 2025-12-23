<script lang="ts">
  import { page } from "$app/state";
  import Icon from "@iconify/svelte";
  import { setActiveStep, STEP_LABELS } from "../bkp-step.svelte";
  import { client } from "$lib/client.svelte";
  import Query from "$lib/components/Query.svelte";
  import { user } from "$lib/stores/user.svelte";
  import { BKPStatus, type BKP } from "$lib/zenstack/models";
  import { toast } from "$lib";
    import { resolve } from "$app/paths";

  $effect(() => {
    setActiveStep(STEP_LABELS.P_APPROVAL);
  });

  const bkpId = page.params.id;

  // Fetch BKP data
  const bkpQ = client.bKP.useFindUnique({
    where: { id: bkpId },
    include: {
      User: true,
      ProposalApproval__reviewedBy_User: true,
    },
  });

  // Update mutation
  const updateBkpQ = client.bKP.useUpdate();

  // Check if user is admin or superadmin
  const isAdminOrSuperAdmin = $derived(["ADMIN", "SUPERADMIN"].includes(user().role));

  // State for editing
  let reviewerNotes = $state("");
  let isSaving = $state(false);

  $effect(() => {
    console.log(user().role, isAdminOrSuperAdmin)
    if ($bkpQ.data) {
      const notes = $bkpQ.data.ProposalApproval.reviewerNotes;
      if (notes) {
        reviewerNotes = notes;
      }
    }
  })

  type ApprovalStatus = "pending" | "approved" | "rejected";

  function getApprovalStatus(bkp: BKP): ApprovalStatus {
    if (bkp.status === "PROPOSAL") {
      return "pending";
    } else if (bkp.status === "WAITING_PROPOSAL_APPROVAL") {
      return "pending";
    } else if (bkp.ProposalApproval.reviewedAt) {
      // If reviewed, check if it was approved (moved to next stage) or rejected
      if (bkp.status === "REGISTRATION" ||
          bkp.status === "WAITING_REGISTRATION_APPROVAL" ||
          bkp.status === "WEEKLY_REPORTING" ||
          bkp.status === "UPLOADING_FIELD_ASSESSMENT" ||
          bkp.status === "GRADING" ||
          bkp.status === "COMPLETED") {
        return "approved";
      }
      return "rejected";
    }
    return "pending";
  }

  function getStatusBadge(status: ApprovalStatus): string {
    const badges = {
      pending: "badge-info",
      approved: "badge-success",
      rejected: "badge-error",
    };
    return badges[status];
  }

  function getStatusText(status: ApprovalStatus): string {
    const texts = {
      pending: "Pending Approval",
      approved: "Approved",
      rejected: "Rejected",
    };
    return texts[status];
  }

  function getStatusIcon(status: ApprovalStatus): string {
    if (status === "approved") {
      return "mdi:check-circle-outline";
    } else if (status === "rejected") {
      return "mdi:close-circle-outline";
    }
    return "mdi:clock-outline";
  }

  const nextStatus = BKPStatus.REGISTRATION;
  const previousStatus = BKPStatus.PROPOSAL;

  async function handleApprove(bkp: BKP) {
    isSaving = true;
    try {
      await $updateBkpQ.mutateAsync({
        where: { id: bkp.id },
        data: {
          status: nextStatus,
          ProposalApproval: {
            reviewedAt: new Date(),
            reviewerNotes: reviewerNotes || null,
            rejected: false,
          },
          ProposalApproval__reviewedBy_UserId: user().id,
        },
      });
      $bkpQ.refetch();
    } catch (error) {
      console.error("Failed to approve:", error);
      alert("Failed to approve BKP");
    } finally {
      isSaving = false;
    }
  }

  async function handleReject(bkp: BKP) {
    isSaving = true;
    try {
      await $updateBkpQ.mutateAsync({
        where: { id: bkp.id },
        data: {
          status: previousStatus,
          ProposalApproval: {
            reviewedAt: new Date(),
            reviewerNotes: reviewerNotes || null,
            rejected: true,
          },
          ProposalApproval__reviewedBy_UserId: user().id,
        },
      });
      $bkpQ.refetch();
    } catch (error) {
      console.error("Failed to reject:", error);
      alert("Failed to reject BKP");
    } finally {
      isSaving = false;
    }
  }

  async function handleSaveNotes(bkp: BKP) {
    isSaving = true;
    try {
      await $updateBkpQ.mutateAsync({
        where: { id: bkp.id },
        data: {
          ProposalApproval: {
            reviewedAt: bkp.ProposalApproval.reviewedAt || new Date(),
            reviewerNotes: reviewerNotes || null,
          },
          ProposalApproval__reviewedBy_UserId: user().id,
        },
      });
      $bkpQ.refetch();
    } catch (error) {
      console.error("Failed to save notes:", error);
      alert("Failed to save notes");
    } finally {
      isSaving = false;
    }
  }

  async function cancelSubmission(bkp: BKP) {
    isSaving = true;
    try {
      await $updateBkpQ.mutateAsync({
        where: { id: bkp.id },
        data: {
          status: BKPStatus.PROPOSAL,
        },
      });
      toast.success("Submission cancelled successfully!");
      $bkpQ.refetch();
    } catch (error) {
      console.error("Error cancelling submission:", error);
      toast.error("Failed to cancel submission");
    } finally {
      isSaving = false;
    }
  }
</script>

<Query q={bkpQ}>
  {#snippet children(bkp)}
    {@const approvalStatus = getApprovalStatus(bkp)}

    <div class="max-w-5xl">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="mb-2 text-xl font-bold">Proposal Approval Status</h1>
        <p class="text-xs text-base-content/70">View the status of your BKP proposal approval</p>
      </div>

      <!-- Status Card -->
      <div class="card mb-4 bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 class="card-title text-base">Current Status</h2>
            <span class="badge {getStatusBadge(approvalStatus)} gap-2 badge-lg">
              <Icon icon={getStatusIcon(approvalStatus)} class="h-4 w-4" />
              {getStatusText(approvalStatus)}
            </span>
          </div>

          <div class="divider my-2"></div>

          <div class="grid gap-3 text-sm md:grid-cols-2">
            {#if bkp.Proposal.submittedAt}
              <div>
                <span class="font-semibold">Submitted Date:</span>
                <span class="ml-2">
                  {new Date(bkp.Proposal.submittedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            {/if}

            {#if bkp.ProposalApproval__reviewedBy_User}
              <div>
                <span class="font-semibold">Reviewed By:</span>
                <span class="ml-2">{bkp.ProposalApproval__reviewedBy_User.name}</span>
              </div>
            {/if}

            {#if bkp.ProposalApproval.reviewedAt}
              <div>
                <span class="font-semibold">Reviewed Date:</span>
                <span class="ml-2">
                  {new Date(bkp.ProposalApproval.reviewedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            {/if}

            <div>
              <span class="font-semibold">BKP Status:</span>
              <span class="ml-2">
                <span class="badge badge-sm">{bkp.status}</span>
              </span>
            </div>
          </div>

          {#if bkp.ProposalApproval.reviewerNotes}
            <div class="mt-3">
              <p class="mb-1 text-sm font-semibold">Reviewer Notes:</p>
              <div class="rounded-lg bg-base-200 p-3">
                <p class="text-xs whitespace-pre-wrap">{bkp.ProposalApproval.reviewerNotes}</p>
              </div>
            </div>
          {/if}

          {#if approvalStatus === "pending"}
            <div class="mt-3">
              <div class="alert py-2 alert-info">
                <Icon icon="mdi:information-outline" class="h-5 w-5 shrink-0" />
                <div>
                  <h3 class="text-sm font-bold">Waiting for Review</h3>
                  <p class="text-xs">
                    Your BKP proposal is currently being reviewed by the department.
                  </p>
                </div>
              </div>
            </div>
          {:else if approvalStatus === "approved"}
            <div class="mt-3">
              <div class="alert py-2 alert-success">
                <Icon icon="mdi:check-circle-outline" class="h-5 w-5 shrink-0" />
                <div>
                  <h3 class="text-sm font-bold">Proposal Approved</h3>
                  <p class="text-xs">
                    Your BKP proposal has been approved. You can now proceed to the next step.
                  </p>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Admin/Superadmin Edit Card -->
      {#if isAdminOrSuperAdmin}
        <div class="card mb-4 bg-base-100 shadow-xl">
          <div class="card-body p-4">
            <h2 class="card-title text-base mb-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-warning/10">
                <Icon icon="mdi:shield-account" class="h-5 w-5 text-warning" />
              </div>
              Admin Actions
            </h2>

            <div class="divider my-2"></div>

            <div class="space-y-3">
              <div class="form-control">
                <label class="label" for="reviewerNotes">
                  <span class="label-text font-semibold">Reviewer Notes</span>
                </label>
                <textarea
                  id="reviewerNotes"
                  class="textarea textarea-bordered h-24 text-sm"
                  placeholder="Enter your review notes here..."
                  bind:value={reviewerNotes}
                  disabled={isSaving}
                ></textarea>
              </div>

              <div class="flex flex-wrap gap-2">
                <button
                  class="btn btn-sm btn-error"
                  onclick={() => handleReject(bkp)}
                  disabled={isSaving}
                >
                  {#if isSaving}
                    <span class="loading loading-spinner loading-sm"></span>
                  {:else}
                    <Icon icon="mdi:close" class="h-4 w-4" />
                  {/if}
                  Reject & Move to {previousStatus}
                </button>

                <button
                  class="btn btn-sm btn-success"
                  onclick={() => handleApprove(bkp)}
                  disabled={isSaving}
                >
                  {#if isSaving}
                    <span class="loading loading-spinner loading-sm"></span>
                  {:else}
                    <Icon icon="mdi:check" class="h-4 w-4" />
                  {/if}
                  Approve & Move to {nextStatus}
                </button>

                <button
                  class="btn btn-sm btn-info"
                  onclick={() => handleSaveNotes(bkp)}
                  disabled={isSaving}
                >
                  {#if isSaving}
                    <span class="loading loading-spinner loading-sm"></span>
                  {:else}
                    <Icon icon="mdi:content-save" class="h-4 w-4" />
                  {/if}
                  Save Notes Only
                </button>
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- BKP Details Card -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <h2 class="card-title text-base">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Icon icon="mdi:file-document-outline" class="h-5 w-5 text-primary" />
            </div>
            Proposal Details
          </h2>

          <div class="divider my-2"></div>

          <div class="grid gap-3 text-sm md:grid-cols-2">
            <div>
              <span class="font-semibold">BKP ID:</span>
              <span class="ml-2">{bkp.id}</span>
            </div>
            <div>
              <span class="font-semibold">Company:</span>
              <span class="ml-2">{bkp.Proposal.companyName}</span>
            </div>
            <div>
              <span class="font-semibold">Position:</span>
              <span class="ml-2">{bkp.Proposal.position}</span>
            </div>
            <div>
              <span class="font-semibold">Type:</span>
              <span class="ml-2">{bkp.Proposal.bkpType}</span>
            </div>
            <div>
              <span class="font-semibold">Period:</span>
              <span class="ml-2">{bkp.Proposal.period}</span>
            </div>
            <div>
              <span class="font-semibold">Duration:</span>
              <span class="ml-2">{bkp.Proposal.monthDuration} months</span>
            </div>
            <div>
              <span class="font-semibold">Start Date:</span>
              <span class="ml-2">
                {bkp.Proposal.startDate
                  ? new Date(bkp.Proposal.startDate).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </span>
            </div>
            <div>
              <span class="font-semibold">End Date:</span>
              <span class="ml-2">
                {bkp.Proposal.endDate
                  ? new Date(bkp.Proposal.endDate).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </span>
            </div>
          </div>

          <div class="mt-3">
            <p class="mb-1 text-sm font-semibold">Job Description:</p>
            <div class="rounded-lg bg-base-200 p-3">
              <p class="text-xs whitespace-pre-wrap">{bkp.Proposal.jobDescription}</p>
            </div>
          </div>

          <div class="mt-3">
            <p class="mb-1 text-sm font-semibold">Student Notes:</p>
            <div class="rounded-lg bg-base-200 p-3">
              <p class="text-xs whitespace-pre-wrap">{bkp.Proposal.studentNotes}</p>
            </div>
          </div>

          <div class="mt-3">
            <p class="mb-1 text-sm font-semibold">Job Link:</p>
            <a
              href={bkp.Proposal.jobLink ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              class="link link-primary text-xs"
            >
              {bkp.Proposal.jobLink ?? "null"}
            </a>
          </div>
        </div>
      </div>

      <!-- User Action Buttons -->
      <div class="mt-6 flex flex-wrap justify-center gap-4">
        <a href={resolve(`/bkp/${bkpId}`)} class="btn gap-2 btn-outline">
          <Icon icon="mdi:arrow-left" class="h-5 w-5" />
          Back to Proposal
        </a>
        {#if bkp.status === "WAITING_PROPOSAL_APPROVAL"}
          <button
            class="btn gap-2 btn-warning"
            onclick={() => cancelSubmission(bkp)}
            disabled={isSaving}
          >
            {#if isSaving}
              <span class="loading loading-spinner loading-sm"></span>
              Cancelling...
            {:else}
              <Icon icon="mdi:close-circle-outline" class="h-5 w-5" />
              Cancel Proposal Submission
            {/if}
          </button>
        {/if}
        <a href={resolve(`/bkp/${bkpId}/register`)} class="btn gap-2 btn-primary">
          <Icon icon="mdi:file-check-outline" class="h-5 w-5" />
          Go to Registration
        </a>
      </div>
    </div>
  {/snippet}
</Query>
