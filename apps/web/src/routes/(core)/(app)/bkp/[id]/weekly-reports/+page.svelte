<script lang="ts">
  import { client } from "$lib/client.svelte";
  import Query from "$lib/components/Query.svelte";
  import { toast, uploadFile, getFileUrl } from "$lib";
  import Icon from "@iconify/svelte";
  import { setActiveStep, STEP_LABELS } from "../bkp-step.svelte";
  import type { WeeklyReport, DailyReport, BKP } from "$lib/zenstack/models";
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import { goto } from "$app/navigation";

  $effect(() => {
    setActiveStep(STEP_LABELS.WEEKLY_REPORTS);
  });

  const bkpId = page.params.id;

  // Fetch BKP data
  const bkpQ = client.bKP.useFindUnique({
    where: { id: bkpId },
    include: {
      User: true,
    },
  });

  // Update mutation
  const updateBKPMutation = client.bKP.useUpdate();

  // Modal state
  let viewWeeklyModal: HTMLDialogElement | null = $state(null);
  let addWeeklyModal: HTMLDialogElement | null = $state(null);
  let editWeeklyModal: HTMLDialogElement | null = $state(null);
  let deleteWeeklyModal: HTMLDialogElement | null = $state(null);

  let viewDailyModal: HTMLDialogElement | null = $state(null);
  let addDailyModal: HTMLDialogElement | null = $state(null);
  let editDailyModal: HTMLDialogElement | null = $state(null);
  let deleteDailyModal: HTMLDialogElement | null = $state(null);

  // Selected report indices
  let selectedWeeklyIndex: number | null = $state(null);
  let selectedDailyIndex: number | null = $state(null);

  // Form data for weekly report
  let weeklyFormData = $state({
    week: 0,
    from: "",
    to: "",
  });

  // Form data for daily report
  let dailyFormData = $state({
    date: "",
    content: "",
    photoKey: "",
  });

  let uploadedPhotoFile: File | null = $state(null);
  let isSubmitting = $state(false);
  let isUploading = $state(false);
  let isContinuing = $state(false);

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

  // ===== WEEKLY REPORT FUNCTIONS =====
  function openViewWeeklyModal(index: number) {
    selectedWeeklyIndex = index;
    viewWeeklyModal?.showModal();
  }

  function openAddWeeklyModal(weeklyReports: WeeklyReport[]) {
    weeklyFormData = {
      week: weeklyReports.length + 1,
      from: "",
      to: "",
    };
    addWeeklyModal?.showModal();
  }

  async function handleAddWeekly(currentBKP: BKP) {
    if (!weeklyFormData.from || !weeklyFormData.to) {
      toast.error("Please fill in all required fields");
      return;
    }

    isSubmitting = true;
    try {
      const currentReports = currentBKP.WeeklyReports.WeeklyReportList;
      const newReport: WeeklyReport = {
        week: weeklyFormData.week,
        from: new Date(weeklyFormData.from),
        to: new Date(weeklyFormData.to),
        reports: [],
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
      addWeeklyModal?.close();
      $bkpQ.refetch();
    } catch (error) {
      console.error("Error adding weekly report:", error);
      toast.error("Failed to add weekly report");
    } finally {
      isSubmitting = false;
    }
  }

  function openEditWeeklyModal(index: number, report: WeeklyReport) {
    selectedWeeklyIndex = index;
    weeklyFormData = {
      week: report.week || 0,
      from: report.from ? new Date(report.from).toISOString().split("T")[0] : "",
      to: report.to ? new Date(report.to).toISOString().split("T")[0] : "",
    };
    editWeeklyModal?.showModal();
  }

  async function handleEditWeekly(currentBKP: BKP) {
    if (selectedWeeklyIndex === null || !weeklyFormData.from || !weeklyFormData.to) {
      toast.error("Please fill in all required fields");
      return;
    }

    isSubmitting = true;
    try {
      const currentReports = [...currentBKP.WeeklyReports.WeeklyReportList];
      const existingReport = currentReports[selectedWeeklyIndex];
      currentReports[selectedWeeklyIndex] = {
        ...existingReport,
        week: weeklyFormData.week,
        from: new Date(weeklyFormData.from),
        to: new Date(weeklyFormData.to),
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
      editWeeklyModal?.close();
      $bkpQ.refetch();
    } catch (error) {
      console.error("Error updating weekly report:", error);
      toast.error("Failed to update weekly report");
    } finally {
      isSubmitting = false;
    }
  }

  function openDeleteWeeklyModal(index: number) {
    selectedWeeklyIndex = index;
    deleteWeeklyModal?.showModal();
  }

  async function handleDeleteWeekly(currentBKP: BKP) {
    if (selectedWeeklyIndex === null) return;

    isSubmitting = true;
    try {
      const currentReports = [...currentBKP.WeeklyReports.WeeklyReportList];
      currentReports.splice(selectedWeeklyIndex, 1);

      await $updateBKPMutation.mutateAsync({
        where: { id: bkpId },
        data: {
          WeeklyReports: {
            WeeklyReportList: currentReports,
          },
        },
      });

      toast.success("Weekly report deleted successfully!");
      deleteWeeklyModal?.close();
      $bkpQ.refetch();
    } catch (error) {
      console.error("Error deleting weekly report:", error);
      toast.error("Failed to delete weekly report");
    } finally {
      isSubmitting = false;
    }
  }

  // ===== DAILY REPORT FUNCTIONS =====
  function openViewDailyModal(weeklyIndex: number, dailyIndex: number) {
    selectedWeeklyIndex = weeklyIndex;
    selectedDailyIndex = dailyIndex;
    viewDailyModal?.showModal();
  }

  function openAddDailyModal(weeklyIndex: number) {
    selectedWeeklyIndex = weeklyIndex;
    dailyFormData = {
      date: "",
      content: "",
      photoKey: "",
    };
    uploadedPhotoFile = null;
    addDailyModal?.showModal();
  }

  async function handleAddDaily(currentBKP: BKP) {
    if (selectedWeeklyIndex === null || !dailyFormData.date) {
      toast.error("Please fill in the date");
      return;
    }

    isSubmitting = true;
    try {
      let photoKey = dailyFormData.photoKey;

      // Upload photo if provided
      if (uploadedPhotoFile) {
        isUploading = true;
        const result = await uploadFile({
          file: uploadedPhotoFile,
          prefix: `bkp/${bkpId}/daily-reports`,
        });
        photoKey = result.key;
        isUploading = false;
      }

      const currentReports = [...currentBKP.WeeklyReports.WeeklyReportList];
      const weeklyReport = currentReports[selectedWeeklyIndex];
      const newDailyReport: DailyReport = {
        date: new Date(dailyFormData.date),
        content: dailyFormData.content || null,
        photoKey: photoKey || null,
      };

      currentReports[selectedWeeklyIndex] = {
        ...weeklyReport,
        reports: [...(weeklyReport.reports), newDailyReport],
      };

      await $updateBKPMutation.mutateAsync({
        where: { id: bkpId },
        data: {
          WeeklyReports: {
            WeeklyReportList: currentReports,
          },
        },
      });

      toast.success("Daily report added successfully!");
      addDailyModal?.close();
      $bkpQ.refetch();
    } catch (error) {
      console.error("Error adding daily report:", error);
      toast.error("Failed to add daily report");
    } finally {
      isSubmitting = false;
      isUploading = false;
    }
  }

  function openEditDailyModal(weeklyIndex: number, dailyIndex: number, report: DailyReport) {
    selectedWeeklyIndex = weeklyIndex;
    selectedDailyIndex = dailyIndex;
    dailyFormData = {
      date: report.date ? new Date(report.date).toISOString().split("T")[0] : "",
      content: report.content || "",
      photoKey: report.photoKey || "",
    };
    uploadedPhotoFile = null;
    editDailyModal?.showModal();
  }

  async function handleEditDaily(currentBKP: BKP) {
    if (selectedWeeklyIndex === null || selectedDailyIndex === null || !dailyFormData.date) {
      toast.error("Please fill in the date");
      return;
    }

    isSubmitting = true;
    try {
      let photoKey = dailyFormData.photoKey;

      // Upload new photo if provided
      if (uploadedPhotoFile) {
        isUploading = true;
        const result = await uploadFile({
          file: uploadedPhotoFile,
          prefix: `bkp/${bkpId}/daily-reports`,
        });
        photoKey = result.key;
        isUploading = false;
      }

      const currentReports = [...currentBKP.WeeklyReports.WeeklyReportList];
      const weeklyReport = currentReports[selectedWeeklyIndex];
      const dailyReports = [...(weeklyReport.reports)];

      dailyReports[selectedDailyIndex] = {
        date: new Date(dailyFormData.date),
        content: dailyFormData.content || null,
        photoKey: photoKey || null,
      };

      currentReports[selectedWeeklyIndex] = {
        ...weeklyReport,
        reports: dailyReports,
      };

      await $updateBKPMutation.mutateAsync({
        where: { id: bkpId },
        data: {
          WeeklyReports: {
            WeeklyReportList: currentReports,
          },
        },
      });

      toast.success("Daily report updated successfully!");
      editDailyModal?.close();
      $bkpQ.refetch();
    } catch (error) {
      console.error("Error updating daily report:", error);
      toast.error("Failed to update daily report");
    } finally {
      isSubmitting = false;
      isUploading = false;
    }
  }

  function openDeleteDailyModal(weeklyIndex: number, dailyIndex: number) {
    selectedWeeklyIndex = weeklyIndex;
    selectedDailyIndex = dailyIndex;
    deleteDailyModal?.showModal();
  }

  async function handleDeleteDaily(currentBKP: BKP) {
    if (selectedWeeklyIndex === null || selectedDailyIndex === null) return;

    isSubmitting = true;
    try {
      const currentReports = [...currentBKP.WeeklyReports.WeeklyReportList];
      const weeklyReport = currentReports[selectedWeeklyIndex];
      const dailyReports = [...(weeklyReport.reports)];

      dailyReports.splice(selectedDailyIndex, 1);

      currentReports[selectedWeeklyIndex] = {
        ...weeklyReport,
        reports: dailyReports,
      };

      await $updateBKPMutation.mutateAsync({
        where: { id: bkpId },
        data: {
          WeeklyReports: {
            WeeklyReportList: currentReports,
          },
        },
      });

      toast.success("Daily report deleted successfully!");
      deleteDailyModal?.close();
      $bkpQ.refetch();
    } catch (error) {
      console.error("Error deleting daily report:", error);
      toast.error("Failed to delete daily report");
    } finally {
      isSubmitting = false;
    }
  }

  // ===== NAVIGATION FUNCTIONS =====
  async function handleContinueToFieldAssessment(currentBKP: BKP) {
    isContinuing = true;
    try {
      if (currentBKP.status === "WEEKLY_REPORTING") {
        await $updateBKPMutation.mutateAsync({
          where: { id: bkpId },
          data: {
            status: "UPLOADING_FIELD_ASSESSMENT",
          },
        });

        toast.success("Proceeding to field assessment!");
      }
      goto(resolve(`/bkp/${bkpId}/field-assessment`));
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to proceed to field assessment");
    } finally {
      isContinuing = false;
    }
  }
</script>

<Query q={bkpQ}>
  {#snippet children(bkp)}
    {@const weeklyReports = bkp.WeeklyReports.WeeklyReportList.sort(
      (a, b) => (a.week ?? NaN) - (b.week ?? NaN),
    )}
    {@const totalWeeks = bkp.Proposal.monthDuration
      ? Math.ceil((bkp.Proposal.monthDuration * 30) / 7)
      : NaN}
    {@const submittedCount = bkp.WeeklyReports.WeeklyReportList.length}
    {@const canEdit =
      bkp.status === "WEEKLY_REPORTING" ||
      bkp.status === "UPLOADING_FIELD_ASSESSMENT" ||
      bkp.status === "GRADING"}

    <div class="max-w-5xl">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="mb-2 text-xl font-bold">Weekly Reports</h1>
        <p class="text-xs text-base-content/70">Submit and track your weekly activity reports</p>
      </div>

      <!-- Optional Warning -->
      <div class="alert alert-warning mb-4">
        <Icon icon="mdi:information-outline" class="h-5 w-5 shrink-0" />
        <div>
          <h3 class="text-sm font-bold">This step is optional</h3>
          <p class="text-xs">
            Weekly reports are not mandatory. You can skip this step and continue directly to the
            field assessment.
          </p>
        </div>
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
              {submittedCount} of {totalWeeks ?? "?"} weeks completed
            </span>
            <span class="text-xs text-base-content/70">
              {totalWeeks > 0 ? Math.round((submittedCount / totalWeeks) * 100) : 0}%
            </span>
          </div>

          <progress class="progress w-full progress-primary" value={submittedCount} max={totalWeeks}
          ></progress>

          <div class="mt-3 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span class="font-semibold">Company:</span>
              {bkp.Proposal.companyName || "N/A"}
            </div>
            <div>
              <span class="font-semibold">Position:</span>
              {bkp.Proposal.position || "N/A"}
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      {#if canEdit}
        <div class="mb-4 flex flex-wrap gap-2">
          <button
            class="btn gap-2 btn-sm btn-primary"
            onclick={() => openAddWeeklyModal(weeklyReports)}
          >
            <Icon icon="mdi:plus" class="h-4 w-4" />
            Add New Weekly Report
          </button>
        </div>
      {/if}

      <!-- Weekly Reports List -->
      <div class="space-y-4">
        {#each weeklyReports as report, weeklyIndex (weeklyIndex)}
          {@const dailyReports = report.reports}
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body p-4">
              <!-- Weekly Report Header -->
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="flex-1">
                  <div class="mb-2 flex items-center gap-2">
                    <h3 class="text-base font-bold">Week {report.week ?? NaN}</h3>
                    <span class="badge badge-sm badge-outline"
                      >{dailyReports.length} daily reports</span
                    >
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

              <!-- Weekly Report Actions -->
              <div class="card-actions justify-end">
                {#if canEdit}
                  <button
                    class="btn gap-2 btn-outline btn-sm"
                    onclick={() => openEditWeeklyModal(weeklyIndex, report)}
                  >
                    <Icon icon="mdi:pencil" class="h-4 w-4" />
                    Edit Week
                  </button>
                  <button
                    class="btn gap-2 btn-outline btn-sm btn-error"
                    onclick={() => openDeleteWeeklyModal(weeklyIndex)}
                  >
                    <Icon icon="mdi:delete" class="h-4 w-4" />
                    Delete Week
                  </button>
                {/if}
              </div>

              <div class="divider my-2"></div>

              <!-- Daily Reports Section -->
              <div>
                <div class="mb-3 flex items-center justify-between">
                  <h4 class="text-sm font-semibold">Daily Reports</h4>
                  {#if canEdit}
                    <button
                      class="btn gap-2 btn-xs btn-primary"
                      onclick={() => openAddDailyModal(weeklyIndex)}
                    >
                      <Icon icon="mdi:plus" class="h-3 w-3" />
                      Add Daily Report
                    </button>
                  {/if}
                </div>

                {#if dailyReports.length > 0}
                  <div class="space-y-2">
                    {#each dailyReports as dailyReport, dailyIndex (dailyIndex)}
                      <div class="rounded-lg border border-base-300 bg-base-200 p-3">
                        <div class="flex items-start justify-between gap-3">
                          <div class="flex-1">
                            <div class="mb-1 flex items-center gap-2">
                              <Icon icon="mdi:calendar" class="h-4 w-4 text-primary" />
                              <span class="text-xs font-semibold">
                                {dailyReport.date
                                  ? new Date(dailyReport.date).toLocaleDateString("id-ID", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })
                                  : "No date"}
                              </span>
                            </div>

                            {#if dailyReport.content}
                              <p class="mb-2 text-xs text-base-content/80 line-clamp-2">
                                {dailyReport.content}
                              </p>
                            {/if}

                            {#if dailyReport.photoKey}
                              <div class="flex items-center gap-1 text-xs text-primary">
                                <Icon icon="mdi:image" class="h-3 w-3" />
                                <span>Photo attached</span>
                              </div>
                            {/if}
                          </div>

                          <div class="flex gap-1">
                            <button
                              class="btn btn-xs btn-ghost"
                              onclick={() => openViewDailyModal(weeklyIndex, dailyIndex)}
                            >
                              <Icon icon="mdi:eye-outline" class="h-3 w-3" />
                            </button>
                            {#if canEdit}
                              <button
                                class="btn btn-xs btn-ghost"
                                onclick={() =>
                                  openEditDailyModal(weeklyIndex, dailyIndex, dailyReport)}
                              >
                                <Icon icon="mdi:pencil" class="h-3 w-3" />
                              </button>
                              <button
                                class="btn btn-xs btn-ghost btn-error"
                                onclick={() => openDeleteDailyModal(weeklyIndex, dailyIndex)}
                              >
                                <Icon icon="mdi:delete" class="h-3 w-3" />
                              </button>
                            {/if}
                          </div>
                        </div>
                      </div>
                    {/each}
                  </div>
                {:else}
                  <div class="alert alert-sm">
                    <Icon icon="mdi:information-outline" class="h-4 w-4 shrink-0" />
                    <span class="text-xs">
                      {canEdit
                        ? "No daily reports yet. Click 'Add Daily Report' to create one."
                        : "No daily reports added yet."}
                    </span>
                  </div>
                {/if}
              </div>
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

      <!-- Navigation Action Buttons -->
      <div class="mt-8 flex flex-wrap justify-center gap-4">
        <a href={resolve(`/bkp/${bkpId}/registration-approval`)} class="btn gap-2 btn-outline">
          <Icon icon="mdi:arrow-left" class="h-5 w-5" />
          Back to Registration Approval
        </a>
        <button
          class="btn gap-2 btn-primary"
          onclick={() => handleContinueToFieldAssessment(bkp)}
          disabled={isContinuing}
        >
          {#if isContinuing}
            <span class="loading loading-spinner loading-sm"></span>
            Continuing...
          {:else}
            Continue to Field Assessment
            <Icon icon="mdi:arrow-right" class="h-5 w-5" />
          {/if}
        </button>
      </div>
    </div>

    <!-- ===== WEEKLY REPORT MODALS ===== -->

    <!-- Add Weekly Report Modal -->
    <dialog bind:this={addWeeklyModal} class="modal">
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
              bind:value={weeklyFormData.week}
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
              bind:value={weeklyFormData.from}
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">End Date</span>
            </label>
            <input
              type="date"
              class="input-bordered input"
              bind:value={weeklyFormData.to}
              required
            />
          </div>
        </div>

        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-ghost">Cancel</button>
          </form>
          <button
            class="btn btn-primary"
            onclick={() => handleAddWeekly(bkp)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Weekly Report"}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <!-- Edit Weekly Report Modal -->
    <dialog bind:this={editWeeklyModal} class="modal">
      <div class="modal-box max-w-2xl">
        <form method="dialog">
          <button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">✕</button>
        </form>
        {#if selectedWeeklyIndex !== null && weeklyReports[selectedWeeklyIndex]}
          {@const report = weeklyReports[selectedWeeklyIndex]}
          <h3 class="mb-4 text-lg font-bold">
            Edit Weekly Report - Week {report.week || selectedWeeklyIndex + 1}
          </h3>

          <div class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Week Number</span>
              </label>
              <input
                type="number"
                class="input-bordered input"
                bind:value={weeklyFormData.week}
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
                bind:value={weeklyFormData.from}
                required
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">End Date</span>
              </label>
              <input
                type="date"
                class="input-bordered input"
                bind:value={weeklyFormData.to}
                required
              />
            </div>
          </div>

          <div class="modal-action">
            <form method="dialog">
              <button class="btn btn-ghost">Cancel</button>
            </form>
            <button
              class="btn btn-primary"
              onclick={() => handleEditWeekly(bkp)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        {/if}
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <!-- Delete Weekly Report Confirmation Modal -->
    <dialog bind:this={deleteWeeklyModal} class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">✕</button>
        </form>
        {#if selectedWeeklyIndex !== null && weeklyReports[selectedWeeklyIndex]}
          {@const report = weeklyReports[selectedWeeklyIndex]}
          <h3 class="mb-4 text-lg font-bold">Delete Weekly Report</h3>
          <p class="mb-4">
            Are you sure you want to delete the weekly report for Week {report.week ||
              selectedWeeklyIndex + 1}? This will also delete all daily reports within this week.
            This action cannot be undone.
          </p>

          <div class="modal-action">
            <form method="dialog">
              <button class="btn btn-ghost">Cancel</button>
            </form>
            <button
              class="btn btn-error"
              onclick={() => handleDeleteWeekly(bkp)}
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

    <!-- ===== DAILY REPORT MODALS ===== -->

    <!-- View Daily Report Modal -->
    <dialog bind:this={viewDailyModal} class="modal">
      <div class="modal-box max-w-3xl">
        <form method="dialog">
          <button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">✕</button>
        </form>
        {#if selectedWeeklyIndex !== null && selectedDailyIndex !== null && weeklyReports[selectedWeeklyIndex]?.reports?.[selectedDailyIndex]}
          {@const dailyReport = weeklyReports[selectedWeeklyIndex].reports[selectedDailyIndex]}
          <h3 class="mb-4 text-lg font-bold">Daily Report</h3>

          <div class="space-y-4">
            <div>
              <label class="label">
                <span class="label-text font-semibold">Date</span>
              </label>
              <p class="text-sm">
                {dailyReport.date
                  ? new Date(dailyReport.date).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "No date specified"}
              </p>
            </div>

            {#if dailyReport.content}
              <div>
                <label class="label">
                  <span class="label-text font-semibold">Content</span>
                </label>
                <p class="whitespace-pre-wrap text-sm">{dailyReport.content}</p>
              </div>
            {/if}

            {#if dailyReport.photoKey}
              <div>
                <label class="label">
                  <span class="label-text font-semibold">Photo</span>
                </label>
                <img
                  src={getFileUrl(dailyReport.photoKey)}
                  alt="Daily report"
                  class="max-h-96 w-full rounded-lg object-contain"
                />
              </div>
            {/if}
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

    <!-- Add Daily Report Modal -->
    <dialog bind:this={addDailyModal} class="modal">
      <div class="modal-box max-w-2xl">
        <form method="dialog">
          <button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">✕</button>
        </form>
        <h3 class="mb-4 text-lg font-bold">Add Daily Report</h3>

        <div class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Date *</span>
            </label>
            <input
              type="date"
              class="input-bordered input"
              bind:value={dailyFormData.date}
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Content</span>
            </label>
            <textarea
              class="textarea-bordered textarea h-32"
              bind:value={dailyFormData.content}
              placeholder="Describe your daily activities..."
            ></textarea>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Photo</span>
            </label>
            <input
              type="file"
              class="file-input-bordered file-input w-full"
              accept="image/*"
              onchange={(e) => {
                const files = e.currentTarget.files;
                if (files && files.length > 0) {
                  uploadedPhotoFile = files[0];
                }
              }}
            />
            {#if uploadedPhotoFile}
              <label class="label">
                <span class="label-text-alt text-success">
                  Selected: {uploadedPhotoFile.name}
                </span>
              </label>
            {/if}
          </div>
        </div>

        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-ghost">Cancel</button>
          </form>
          <button
            class="btn btn-primary"
            onclick={() => handleAddDaily(bkp)}
            disabled={isSubmitting || isUploading}
          >
            {#if isUploading}
              Uploading...
            {:else if isSubmitting}
              Adding...
            {:else}
              Add Daily Report
            {/if}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <!-- Edit Daily Report Modal -->
    <dialog bind:this={editDailyModal} class="modal">
      <div class="modal-box max-w-2xl">
        <form method="dialog">
          <button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">✕</button>
        </form>
        <h3 class="mb-4 text-lg font-bold">Edit Daily Report</h3>

        <div class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Date *</span>
            </label>
            <input
              type="date"
              class="input-bordered input"
              bind:value={dailyFormData.date}
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Content</span>
            </label>
            <textarea
              class="textarea-bordered textarea h-32"
              bind:value={dailyFormData.content}
              placeholder="Describe your daily activities..."
            ></textarea>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Photo</span>
            </label>
            {#if dailyFormData.photoKey && !uploadedPhotoFile}
              <div class="mb-2">
                <img
                  src={getFileUrl(dailyFormData.photoKey)}
                  alt="Current"
                  class="max-h-32 rounded-lg"
                />
                <p class="mt-1 text-xs text-base-content/70">Current photo</p>
              </div>
            {/if}
            <input
              type="file"
              class="file-input-bordered file-input w-full"
              accept="image/*"
              onchange={(e) => {
                const files = e.currentTarget.files;
                if (files && files.length > 0) {
                  uploadedPhotoFile = files[0];
                }
              }}
            />
            {#if uploadedPhotoFile}
              <label class="label">
                <span class="label-text-alt text-success">
                  New photo selected: {uploadedPhotoFile.name}
                </span>
              </label>
            {/if}
          </div>
        </div>

        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-ghost">Cancel</button>
          </form>
          <button
            class="btn btn-primary"
            onclick={() => handleEditDaily(bkp)}
            disabled={isSubmitting || isUploading}
          >
            {#if isUploading}
              Uploading...
            {:else if isSubmitting}
              Saving...
            {:else}
              Save Changes
            {/if}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <!-- Delete Daily Report Confirmation Modal -->
    <dialog bind:this={deleteDailyModal} class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">✕</button>
        </form>
        {#if selectedWeeklyIndex !== null && selectedDailyIndex !== null && weeklyReports[selectedWeeklyIndex]?.reports?.[selectedDailyIndex]}
          {@const dailyReport = weeklyReports[selectedWeeklyIndex].reports[selectedDailyIndex]}
          <h3 class="mb-4 text-lg font-bold">Delete Daily Report</h3>
          <p class="mb-4">
            Are you sure you want to delete the daily report for{" "}
            {dailyReport.date
              ? new Date(dailyReport.date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "this date"}? This action cannot be undone.
          </p>

          <div class="modal-action">
            <form method="dialog">
              <button class="btn btn-ghost">Cancel</button>
            </form>
            <button
              class="btn btn-error"
              onclick={() => handleDeleteDaily(bkp)}
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
