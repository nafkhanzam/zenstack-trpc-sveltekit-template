<script lang="ts">
  import { page } from "$app/stores";
  import { resolve } from "$app/paths";
  import { client } from "$lib/client.svelte";
  import Query from "$lib/components/Query.svelte";
  import { toast } from "$lib";
  import Icon from "@iconify/svelte";
  import { setActiveStep, STEP_LABELS } from "../bkp-step.svelte";

  $effect(() => {
    setActiveStep(STEP_LABELS.WEEKLY_REPORTS);
  });

  const bkpId = $page.params.id;

  // Fetch BKP data
  const bkpQ = client.bKP.useFindUnique({
    where: { id: bkpId },
    include: {
      User: true,
    },
  });

  // Update mutation
  const updateBKPMutation = client.bKP.useUpdate();

  interface WeeklyReport {
    week: number;
    from: Date;
    to: Date;
  }

  // Modal state
  let viewModal: HTMLDialogElement | null = $state(null);
  let addModal: HTMLDialogElement | null = $state(null);
  let editModal: HTMLDialogElement | null = $state(null);
  let deleteModal: HTMLDialogElement | null = $state(null);

  // Selected report for view/edit/delete
  let selectedReportIndex: number | null = $state(null);

  // Form data for add/edit
  let formData = $state({
    week: 0,
    from: "",
    to: "",
  });

  let isSubmitting = $state(false);

  function getStatusBadge(status: string): string {
    if (status === "WEEKLY_REPORTING") return "badge-info";
    if (status === "UPLOADING_FIELD_ASSESSMENT" || status === "GRADING" || status === "COMPLETED")
      return "badge-success";
    return "badge-neutral";
  }

  function getStatusText(status: string): string {
    const texts: Record<string, string> = {
      PROPOSAL: "Draft",
      WAITING_PROPOSAL_APPROVAL: "Waiting Approval",
      REGISTRATION: "Registration",
      WAITING_REGISTRATION_APPROVAL: "Waiting Registration Approval",
      WEEKLY_REPORTING: "Weekly Reporting",
      UPLOADING_FIELD_ASSESSMENT: "Uploading Field Assessment",
      GRADING: "Grading",
      COMPLETED: "Completed",
    };
    return texts[status] || status;
  }

  // View report
  function openViewModal(index: number) {
    selectedReportIndex = index;
    viewModal?.showModal();
  }

  // Add new report
  function openAddModal(weeklyReports: WeeklyReport[]) {
    formData = {
      week: weeklyReports.length + 1,
      from: "",
      to: "",
    };
    addModal?.showModal();
  }

  async function handleAdd(currentBKP: any) {
    if (!formData.from || !formData.to) {
      toast.error("Please fill in all required fields");
      return;
    }

    isSubmitting = true;
    try {
      const currentReports = currentBKP.WeeklyReports?.WeeklyReportList || [];
      const newReport = {
        week: formData.week,
        from: new Date(formData.from),
        to: new Date(formData.to),
      };

      await $updateBKPMutation.mutateAsync({
        where: { id: bkpId },
        data: {
          WeeklyReports: {
            WeeklyReportList: [...currentReports, newReport],
          },
        },
      });

      toast.success("Weekly report added successfully!");
      addModal?.close();
      bkpQ?.refetch();
    } catch (error) {
      console.error("Error adding weekly report:", error);
      toast.error("Failed to add weekly report");
    } finally {
      isSubmitting = false;
    }
  }

  // Edit report
  function openEditModal(index: number, report: WeeklyReport) {
    selectedReportIndex = index;
    formData = {
      week: report.week || 0,
      from: report.from ? new Date(report.from).toISOString().split("T")[0] : "",
      to: report.to ? new Date(report.to).toISOString().split("T")[0] : "",
    };
    editModal?.showModal();
  }

  async function handleEdit(currentBKP: any) {
    if (selectedReportIndex === null || !formData.from || !formData.to) {
      toast.error("Please fill in all required fields");
      return;
    }

    isSubmitting = true;
    try {
      const currentReports = [...(currentBKP.WeeklyReports?.WeeklyReportList || [])];
      currentReports[selectedReportIndex] = {
        week: formData.week,
        from: new Date(formData.from),
        to: new Date(formData.to),
      };

      await $updateBKPMutation.mutateAsync({
        where: { id: bkpId },
        data: {
          WeeklyReports: {
            WeeklyReportList: currentReports,
          },
        },
      });

      toast.success("Weekly report updated successfully!");
      editModal?.close();
      bkpQ?.refetch();
    } catch (error) {
      console.error("Error updating weekly report:", error);
      toast.error("Failed to update weekly report");
    } finally {
      isSubmitting = false;
    }
  }

  // Delete report
  function openDeleteModal(index: number) {
    selectedReportIndex = index;
    deleteModal?.showModal();
  }

  async function handleDelete(currentBKP: any) {
    if (selectedReportIndex === null) return;

    isSubmitting = true;
    try {
      const currentReports = [...(currentBKP.WeeklyReports?.WeeklyReportList || [])];
      currentReports.splice(selectedReportIndex, 1);

      await $updateBKPMutation.mutateAsync({
        where: { id: bkpId },
        data: {
          WeeklyReports: {
            WeeklyReportList: currentReports,
          },
        },
      });

      toast.success("Weekly report deleted successfully!");
      deleteModal?.close();
      bkpQ?.refetch();
    } catch (error) {
      console.error("Error deleting weekly report:", error);
      toast.error("Failed to delete weekly report");
    } finally {
      isSubmitting = false;
    }
  }
</script>

<Query q={bkpQ}>
  {#snippet children(bkp)}
    {@const weeklyReports = bkp.WeeklyReports?.WeeklyReportList || []}
    {@const totalWeeks = bkp.Proposal?.monthDuration
      ? Math.ceil((bkp.Proposal.monthDuration * 30) / 7)
      : 12}
    {@const submittedCount = weeklyReports.length}
    {@const canEdit = bkp.status === "WEEKLY_REPORTING" || bkp.status === "PROPOSAL"}

    <div class="max-w-5xl">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="mb-2 text-xl font-bold">Weekly Reports</h1>
        <p class="text-xs text-base-content/70">
          Submit and track your weekly activity reports
        </p>
      </div>

      <!-- Progress Overview -->
      <div class="card mb-4 bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="card-title text-base">Report Progress</h2>
            <span class="badge {getStatusBadge(bkp.status)} badge-lg">
              {getStatusText(bkp.status)}
            </span>
          </div>
          <div class="divider my-2"></div>

          <div class="mb-2 flex items-center justify-between text-sm">
            <span class="font-semibold">
              {submittedCount} of {totalWeeks} weeks completed
            </span>
            <span class="text-xs text-base-content/70">
              {totalWeeks > 0 ? Math.round((submittedCount / totalWeeks) * 100) : 0}%
            </span>
          </div>

          <progress
            class="progress w-full progress-primary"
            value={submittedCount}
            max={totalWeeks}
          ></progress>

          <div class="mt-3 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span class="font-semibold">Company:</span>
              {bkp.Proposal?.companyName || "N/A"}
            </div>
            <div>
              <span class="font-semibold">Position:</span>
              {bkp.Proposal?.position || "N/A"}
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      {#if canEdit}
        <div class="mb-4 flex flex-wrap gap-2">
          <button class="btn gap-2 btn-sm btn-primary" onclick={() => openAddModal(weeklyReports)}>
            <Icon icon="mdi:plus" class="h-4 w-4" />
            Add New Weekly Report
          </button>
        </div>
      {/if}

      <!-- Weekly Reports List -->
      <div class="space-y-3">
        {#each weeklyReports as report, index (index)}
          <div class="card bg-base-100 shadow-xl transition-all hover:shadow-2xl">
            <div class="card-body p-4">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="flex-1">
                  <div class="mb-2">
                    <h3 class="text-base font-bold">Week {report.week || index + 1}</h3>
                  </div>

                  <div class="mb-2 text-xs text-base-content/70">
                    {#if report.from && report.to}
                      {new Date(report.from).toLocaleDateString("id-ID", {
                        month: "short",
                        day: "numeric",
                      })} - {new Date(report.to).toLocaleDateString("id-ID", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    {:else}
                      No date range specified
                    {/if}
                  </div>
                </div>
              </div>

              {#if canEdit}
                <div class="card-actions justify-end">
                  <button
                    class="btn gap-2 btn-outline btn-sm"
                    onclick={() => openViewModal(index)}
                  >
                    <Icon icon="mdi:eye-outline" class="h-4 w-4" />
                    View
                  </button>
                  <button
                    class="btn gap-2 btn-sm btn-primary"
                    onclick={() => openEditModal(index, report)}
                  >
                    <Icon icon="mdi:pencil" class="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    class="btn gap-2 btn-outline btn-sm btn-error"
                    onclick={() => openDeleteModal(index)}
                  >
                    <Icon icon="mdi:delete" class="h-4 w-4" />
                    Delete
                  </button>
                </div>
              {:else}
                <div class="card-actions justify-end">
                  <button
                    class="btn gap-2 btn-outline btn-sm"
                    onclick={() => openViewModal(index)}
                  >
                    <Icon icon="mdi:eye-outline" class="h-4 w-4" />
                    View
                  </button>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>

      {#if weeklyReports.length === 0}
        <div class="alert alert-info">
          <Icon icon="mdi:information-outline" class="h-5 w-5 shrink-0" />
          <div>
            <h3 class="text-sm font-bold">No weekly reports yet</h3>
            <p class="text-xs">
              {#if canEdit}
                Click "Add New Weekly Report" to create your first report.
              {:else}
                Weekly reports will appear here once they are added.
              {/if}
            </p>
          </div>
        </div>
      {/if}
    </div>

    <!-- View Modal -->
    <dialog bind:this={viewModal} class="modal">
      <div class="modal-box max-w-2xl">
        <form method="dialog">
          <button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">✕</button>
        </form>
        {#if selectedReportIndex !== null && weeklyReports[selectedReportIndex]}
          {@const report = weeklyReports[selectedReportIndex]}
          <h3 class="mb-4 text-lg font-bold">
            Weekly Report - Week {report.week || selectedReportIndex + 1}
          </h3>

          <div class="space-y-4">
            <div>
              <label class="label">
                <span class="label-text font-semibold">Period</span>
              </label>
              <p class="text-sm">
                {#if report.from && report.to}
                  {new Date(report.from).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })} - {new Date(report.to).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                {:else}
                  No date range specified
                {/if}
              </p>
            </div>
          </div>

          <div class="modal-action">
            <form method="dialog">
              <button class="btn">Close</button>
            </form>
          </div>
        {/if}
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <!-- Add Modal -->
    <dialog bind:this={addModal} class="modal">
      <div class="modal-box max-w-2xl">
        <form method="dialog">
          <button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">✕</button>
        </form>
        <h3 class="mb-4 text-lg font-bold">Add New Weekly Report</h3>

        <div class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Week Number</span>
            </label>
            <input
              type="number"
              class="input-bordered input"
              bind:value={formData.week}
              min="1"
              max={totalWeeks}
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Start Date</span>
            </label>
            <input
              type="date"
              class="input-bordered input"
              bind:value={formData.from}
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">End Date</span>
            </label>
            <input type="date" class="input-bordered input" bind:value={formData.to} required />
          </div>
        </div>

        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-ghost">Cancel</button>
          </form>
          <button
            class="btn btn-primary"
            onclick={() => handleAdd(bkp)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Report"}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <!-- Edit Modal -->
    <dialog bind:this={editModal} class="modal">
      <div class="modal-box max-w-2xl">
        <form method="dialog">
          <button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">✕</button>
        </form>
        {#if selectedReportIndex !== null && weeklyReports[selectedReportIndex]}
          {@const report = weeklyReports[selectedReportIndex]}
          <h3 class="mb-4 text-lg font-bold">
            Edit Weekly Report - Week {report.week || selectedReportIndex + 1}
          </h3>

          <div class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Week Number</span>
              </label>
              <input
                type="number"
                class="input-bordered input"
                bind:value={formData.week}
                min="1"
                max={totalWeeks}
                required
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Start Date</span>
              </label>
              <input
                type="date"
                class="input-bordered input"
                bind:value={formData.from}
                required
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">End Date</span>
              </label>
              <input type="date" class="input-bordered input" bind:value={formData.to} required />
            </div>
          </div>

          <div class="modal-action">
            <form method="dialog">
              <button class="btn btn-ghost">Cancel</button>
            </form>
            <button
              class="btn btn-primary"
              onclick={() => handleEdit(bkp)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        {/if}
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <!-- Delete Confirmation Modal -->
    <dialog bind:this={deleteModal} class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">✕</button>
        </form>
        {#if selectedReportIndex !== null && weeklyReports[selectedReportIndex]}
          {@const report = weeklyReports[selectedReportIndex]}
          <h3 class="mb-4 text-lg font-bold">Delete Weekly Report</h3>
          <p class="mb-4">
            Are you sure you want to delete the weekly report for Week {report.week ||
              selectedReportIndex + 1}? This action cannot be undone.
          </p>

          <div class="modal-action">
            <form method="dialog">
              <button class="btn btn-ghost">Cancel</button>
            </form>
            <button
              class="btn btn-error"
              onclick={() => handleDelete(bkp)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        {/if}
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  {/snippet}
</Query>
