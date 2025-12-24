<script lang="ts">
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import Icon from "@iconify/svelte";
  import { client } from "$lib/client.svelte";
  import Query from "$lib/components/Query.svelte";
  import { setActiveStep, STEP_LABELS } from "../bkp-step.svelte";
  import { user } from "$lib/stores/user.svelte";
  import { toast } from "$lib";
  import type { BKP, Course } from "$lib/zenstack/models";

  $effect(() => {
    setActiveStep(STEP_LABELS.GRADING);
  });

  const bkpId = page.params.id;

  // Fetch BKP data with grading info
  const bkpQ = client.bKP.useFindUnique({
    where: { id: bkpId },
    include: {
      User: true,
      Grading__User: true,
    },
  });

  // Update mutation
  const updateBKPMutation = client.bKP.useUpdate();

  // Check if user is admin or superadmin
  const isAdminOrSuperAdmin = $derived(["ADMIN", "SUPERADMIN"].includes(user().role));

  // State for completing
  let isCompleting = $state(false);

  // State for editing grades
  let editingGrades = $state<Record<string, { score: number | null; comments: string }>>({});
  let isSavingGrades = $state(false);

  // Fetch all courses to get details
  const coursesQf = (courseIds: string[]) => client.course.useFindMany({
    where: {
      id: {
        in: courseIds,
      },
    },
    include: {
      Major: true,
    },
  });

  function getCourseTypeBadge(type: string): string {
    const badges: Record<string, string> = {
      REQUIRED: "badge-primary",
      ELECTIVE: "badge-secondary",
    };
    return badges[type] || "badge-neutral";
  }

  function getCourseTypeText(type: string): string {
    const texts: Record<string, string> = {
      REQUIRED: "Required",
      ELECTIVE: "Elective",
    };
    return texts[type] || type;
  }

  function getGradeColor(score: number): string {
    if (score >= 86) return "text-success";
    if (score >= 66) return "text-info";
    if (score >= 56) return "text-warning";
    return "text-error";
  }

  function getGradeLetter(score: number): string {
    if (score >= 86) return "A";
    if (score >= 76) return "AB";
    if (score >= 66) return "B";
    if (score >= 61) return "BC";
    if (score >= 56) return "C";
    if (score >= 41) return "D";
    return "E";
  }

  function getGradingStatus(bkp: BKP): "pending" | "in_progress" | "completed" {
    if (bkp.status === "COMPLETED") return "completed";
    if (bkp.status === "GRADING") return "in_progress";
    return "pending";
  }

  function getStatusBadge(status: "pending" | "in_progress" | "completed"): string {
    const badges = {
      pending: "badge-neutral",
      in_progress: "badge-info",
      completed: "badge-success",
    };
    return badges[status];
  }

  function getStatusText(status: "pending" | "in_progress" | "completed"): string {
    const texts = {
      pending: "Pending",
      in_progress: "In Progress",
      completed: "Completed",
    };
    return texts[status];
  }

  function calculateWeightedScore(components: BKP["Grading"]["components"], courses: Course[]): number {
    let totalWeightedScore = 0;
    let totalSks = 0;

    components.forEach((comp) => {
      const course = courses.find((c) => c.id === comp.courseId);
      if (comp.score !== null && comp.score !== undefined && course) {
        totalWeightedScore += (comp.score / 100) * course.sks;
        totalSks += course.sks;
      }
    });

    return totalSks > 0 ? (totalWeightedScore / totalSks) * 100 : 0;
  }

  function areAllGradesFilled(components: BKP["Grading"]["components"]): boolean {
    if (components.length === 0) return false;
    return components.every((comp) => comp.score !== null && comp.score !== undefined);
  }

  async function handleSaveGrades(bkp: BKP) {
    isSavingGrades = true;
    try {
      // Update components with new grades
      const updatedComponents = bkp.Grading.components.map((comp) => {
        const edit = editingGrades[comp.courseId!];
        if (edit) {
          return {
            ...comp,
            score: edit.score,
            grade: edit.score !== null ? getGradeLetter(edit.score) : null,
            graderComments: edit.comments,
            gradedAt: new Date().toISOString(),
          };
        }
        return comp;
      });

      await $updateBKPMutation.mutateAsync({
        where: { id: bkpId },
        data: {
          Grading: {
            ...bkp.Grading,
            components: updatedComponents.map(v => ({
              ...v,
              gradedAt: v.gradedAt ? new Date(v.gradedAt) : null,
            })),
          },
        },
      });

      toast.success("Grades saved successfully!");
      editingGrades = {};
      $bkpQ.refetch();
    } catch (error) {
      console.error("Error saving grades:", error);
      toast.error("Failed to save grades");
    } finally {
      isSavingGrades = false;
    }
  }

  async function handleMarkAsCompleted() {
    isCompleting = true;
    try {
      await $updateBKPMutation.mutateAsync({
        where: { id: bkpId },
        data: {
          status: "COMPLETED",
          Grading__UserId: user().id,
        },
      });

      toast.success("BKP marked as completed successfully!");
      $bkpQ.refetch();
    } catch (error) {
      console.error("Error marking BKP as completed:", error);
      toast.error("Failed to mark BKP as completed");
    } finally {
      isCompleting = false;
    }
  }
</script>

<Query q={bkpQ}>
  {#snippet children(bkp)}
    <Query
      q={coursesQf(
        bkp.Grading.components.map((v) => v.courseId).filter((v) => typeof v === "string"),
      )}
    >
      {#snippet children(allCourses)}
        {@const gradingStatus = getGradingStatus(bkp)}
        {@const components = bkp.Grading.components}
        {@const gradedCourses = components.filter((c) => c.score !== null && c.score !== undefined)}
        {@const totalCourses = components.length}
        {@const showGrades = bkp.status === "COMPLETED"}
        {@const courseDetails = components.map((comp) => {
          const course = allCourses.find((c) => c.id === comp.courseId);
          return {
            component: comp,
            course: course,
          };
        })}
        {@const totalSks = courseDetails.reduce((sum, item) => sum + (item.course?.sks || 0), 0)}
        {@const weightedScore = calculateWeightedScore(components, allCourses)}
        {@const allGradesFilled = areAllGradesFilled(components)}
        {@const canMarkAsCompleted =
          isAdminOrSuperAdmin && allGradesFilled && bkp.status === "GRADING"}
        {@const canEditGrades =
          isAdminOrSuperAdmin && ["GRADING", "PENDING_GRADING"].includes(bkp.status)}
        {@const hasUnsavedChanges = Object.keys(editingGrades).length > 0}

        <div class="max-w-5xl">
          <!-- Header -->
          <div class="mb-6">
            <h1 class="mb-2 text-xl font-bold">BKP Grading</h1>
            <p class="text-xs text-base-content/70">
              {#if canEditGrades}
                Grade each course and provide feedback for the student
              {:else}
                View your BKP assessment and final grade
              {/if}
            </p>
          </div>

          <!-- Admin Grading Instructions -->
          {#if canEditGrades}
            <div class="card mb-4 bg-primary/10 shadow-xl">
              <div class="card-body p-4">
                <div class="flex items-start gap-3">
                  <div
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20"
                  >
                    <Icon icon="mdi:clipboard-text-outline" class="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 class="text-sm font-bold">Grading Instructions</h3>
                    <p class="mt-1 text-xs text-base-content/70">
                      Enter a score (0-100) and optional comments for each course. The grade letter
                      will be automatically calculated. After grading all courses, you can mark the
                      BKP as completed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          {/if}

          <!-- Status Card -->
          <div class="card mb-4 bg-base-100 shadow-xl">
            <div class="card-body p-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <h2 class="card-title text-base">Grading Status</h2>
                <span class="badge {getStatusBadge(gradingStatus)}">
                  {getStatusText(gradingStatus)}
                </span>
              </div>

              <div class="divider my-2"></div>

              <div class="grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <span class="font-semibold">Courses Graded:</span>
                  <span class="ml-2">{gradedCourses.length} / {totalCourses}</span>
                </div>

                <div>
                  <span class="font-semibold">Total SKS:</span>
                  <span class="ml-2">{totalSks} SKS</span>
                </div>

                {#if bkp.Grading__User}
                  <div>
                    <span class="font-semibold">Graded By:</span>
                    <span class="ml-2">{bkp.Grading__User.name}</span>
                  </div>
                {/if}

                {#if components.length > 0 && components[0].gradedAt}
                  <div>
                    <span class="font-semibold">Graded Date:</span>
                    <span class="ml-2">
                      {new Date(components[0].gradedAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                {/if}
              </div>

              {#if gradingStatus === "pending"}
                <div class="mt-3">
                  <div class="alert py-2 alert-warning">
                    <Icon icon="mdi:information-outline" class="h-5 w-5 shrink-0" />
                    <div>
                      <h3 class="text-sm font-bold">Grading Pending</h3>
                      <p class="text-xs">
                        Your BKP submission is pending grading by your supervisor.
                      </p>
                    </div>
                  </div>
                </div>
              {:else if gradingStatus === "in_progress"}
                <div class="mt-3">
                  <div class="alert py-2 alert-info">
                    <Icon icon="mdi:information-outline" class="h-5 w-5 shrink-0" />
                    <div>
                      <h3 class="text-sm font-bold">Grading in Progress</h3>
                      <p class="text-xs">Some courses are still being graded by your supervisor.</p>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          </div>

          <!-- Current Score Overview -->
          {#if showGrades && gradedCourses.length > 0}
            <div class="card mb-4 bg-linear-to-br from-primary/10 to-secondary/10 shadow-xl">
              <div class="card-body p-4">
                <h2 class="card-title text-base">Final Score</h2>
                <div class="divider my-2"></div>

                <div class="flex items-center justify-center gap-6">
                  <div class="text-center">
                    <div class="text-4xl font-bold {getGradeColor(weightedScore)}">
                      {weightedScore.toFixed(2)}
                    </div>
                    <div class="mt-1 text-xs text-base-content/70">Weighted Score</div>
                  </div>

                  <div class="divider divider-horizontal"></div>

                  <div class="text-center">
                    <div class="text-4xl font-bold {getGradeColor(weightedScore)}">
                      {getGradeLetter(weightedScore)}
                    </div>
                    <div class="mt-1 text-xs text-base-content/70">Grade</div>
                  </div>
                </div>

                {#if gradingStatus !== "completed"}
                  <div class="mt-2 text-center text-xs text-base-content/70">
                    * Partial score based on graded courses only
                  </div>
                {/if}
              </div>
            </div>
          {/if}

          <!-- Course Grades -->
          <div class="card mb-4 bg-base-100 shadow-xl">
            <div class="card-body p-4">
              <h2 class="card-title text-base">Course Grades</h2>
              <div class="divider my-2"></div>

              {#if courseDetails.length > 0}
                <div class="space-y-3">
                  {#each courseDetails as item (item.component.courseId)}
                    {@const hasScore =
                      item.component.score !== null && item.component.score !== undefined}
                    {@const courseId = item.component.courseId!}
                    <div
                      class="rounded-lg border-2 border-base-300 p-3 transition-all hover:border-primary/50"
                    >
                      <div class="mb-2 flex flex-wrap items-start justify-between gap-3">
                        <div class="flex-1">
                          <div class="mb-1 flex items-center gap-2">
                            <h3 class="text-sm font-bold">
                              {item.course?.code || item.component.courseId}
                            </h3>
                            {#if item.course?.type}
                              <span class="badge {getCourseTypeBadge(item.course.type)} badge-sm">
                                {getCourseTypeText(item.course.type)}
                              </span>
                            {/if}
                          </div>
                          <p class="mb-1 text-xs font-medium">
                            {item.course?.name || "Course not found"}
                          </p>
                          <p class="text-xs text-base-content/70">
                            {item.course?.sks || 0} SKS
                          </p>
                        </div>
                        <div class="text-right">
                          {#if hasScore}
                            {#if showGrades}
                              <div
                                class="text-xl font-bold {getGradeColor(item.component.score ?? 0)}"
                              >
                                {item.component.score}/100
                              </div>
                              <div
                                class="mt-1 text-sm font-semibold {getGradeColor(
                                  item.component.score ?? 0,
                                )}"
                              >
                                {item.component.grade || getGradeLetter(item.component.score ?? 0)}
                              </div>
                            {:else}
                              <span class="badge badge-sm badge-success">Graded</span>
                            {/if}
                          {:else}
                            <span class="badge badge-sm badge-neutral">Not graded</span>
                          {/if}
                        </div>
                      </div>

                      {#if canEditGrades}
                        <!-- Admin grading inputs -->
                        <div class="mt-3 space-y-2 rounded-lg bg-base-200 p-3">
                          <div class="flex items-center gap-3">
                            <div class="flex-1">
                              <label class="label py-0">
                                <span class="label-text text-xs font-semibold">Score (0-100)</span>
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                class="input input-sm w-full input-bordered"
                                placeholder="Enter score"
                                value={editingGrades[courseId]?.score ?? item.component.score ?? ""}
                                oninput={(e) => {
                                  const value = e.currentTarget.value;
                                  const score = value === "" ? null : Number(value);
                                  editingGrades[courseId] = {
                                    score,
                                    comments:
                                      editingGrades[courseId]?.comments ||
                                      item.component.graderComments ||
                                      "",
                                  };
                                }}
                              />
                            </div>
                            {#if editingGrades[courseId]?.score !== null && editingGrades[courseId]?.score !== undefined}
                              {@const currentScore = editingGrades[courseId]?.score ?? 0}
                              <div class="text-center">
                                <div class="text-xs text-base-content/70">Grade</div>
                                <div class="text-lg font-bold {getGradeColor(currentScore)}">
                                  {getGradeLetter(currentScore)}
                                </div>
                              </div>
                            {/if}
                          </div>
                          <div>
                            <label class="label py-0">
                              <span class="label-text text-xs font-semibold"
                                >Comments (Optional)</span
                              >
                            </label>
                            <textarea
                              class="textarea textarea-sm w-full textarea-bordered"
                              placeholder="Add grading comments..."
                              rows="2"
                              value={editingGrades[courseId]?.comments ??
                                item.component.graderComments ??
                                ""}
                              oninput={(e) => {
                                const currentScore =
                                  editingGrades[courseId]?.score ?? item.component.score;
                                editingGrades[courseId] = {
                                  score: currentScore ?? null,
                                  comments: e.currentTarget.value,
                                };
                              }}
                            ></textarea>
                          </div>
                        </div>
                      {:else}
                        {#if showGrades && hasScore}
                          <progress
                            class="progress mt-2 w-full progress-primary"
                            value={item.component.score}
                            max={100}
                          ></progress>
                        {/if}

                        {#if showGrades && item.component.graderComments}
                          <div class="mt-2 rounded bg-base-200 p-2">
                            <p class="text-xs font-semibold">Comments:</p>
                            <p class="text-xs text-base-content/70">
                              {item.component.graderComments}
                            </p>
                          </div>
                        {/if}
                      {/if}
                    </div>
                  {/each}
                </div>
                {#if canEditGrades}
                  <div class="mt-3 flex justify-end gap-2">
                    <button
                      class="btn gap-2 btn-primary"
                      onclick={() => handleSaveGrades(bkp)}
                      disabled={isSavingGrades}
                    >
                      {#if isSavingGrades}
                        <span class="loading loading-spinner loading-sm"></span>
                        Saving Grades...
                      {:else}
                        <Icon icon="mdi:content-save-outline" class="h-5 w-5" />
                        Save Grades
                      {/if}
                    </button>
                  </div>
                {/if}
              {:else}
                <div class="alert alert-info">
                  <Icon icon="mdi:information-outline" class="h-5 w-5 shrink-0" />
                  <div>
                    <h3 class="text-sm font-bold">No Courses to Grade</h3>
                    <p class="text-xs">
                      No courses have been assigned for grading yet. Please contact your supervisor.
                    </p>
                  </div>
                </div>
              {/if}
            </div>
          </div>

          <!-- BKP Information -->
          <div class="card mb-4 bg-base-100 shadow-xl">
            <div class="card-body p-4">
              <h2 class="card-title text-base">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-info/10">
                  <Icon icon="mdi:briefcase-outline" class="h-5 w-5 text-info" />
                </div>
                BKP Information
              </h2>
              <div class="divider my-2"></div>

              <div class="grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <span class="font-semibold">Company:</span>
                  <span class="ml-2">{bkp.Proposal.companyName || "N/A"}</span>
                </div>
                <div>
                  <span class="font-semibold">Position:</span>
                  <span class="ml-2">{bkp.Proposal.position || "N/A"}</span>
                </div>
                <div>
                  <span class="font-semibold">Type:</span>
                  <span class="ml-2">{bkp.Proposal.bkpType || "N/A"}</span>
                </div>
                <div>
                  <span class="font-semibold">Duration:</span>
                  <span class="ml-2">
                    {bkp.Proposal.monthDuration ? `${bkp.Proposal.monthDuration} months` : "N/A"}
                  </span>
                </div>
                <div>
                  <span class="font-semibold">Period:</span>
                  <span class="ml-2">{bkp.Proposal.period || "N/A"}</span>
                </div>
                <div>
                  <span class="font-semibold">Status:</span>
                  <span class="ml-2">{bkp.status.replace(/_/g, " ")}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Admin Actions -->
          {#if canMarkAsCompleted}
            <div class="card mb-4 bg-base-100 shadow-xl">
              <div class="card-body p-4">
                <h2 class="card-title text-base">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                    <Icon icon="mdi:shield-check-outline" class="h-5 w-5 text-success" />
                  </div>
                  Admin Actions
                </h2>
                <div class="divider my-2"></div>

                {#if hasUnsavedChanges}
                  <div class="alert alert-warning">
                    <Icon icon="mdi:alert-outline" class="h-5 w-5 shrink-0" />
                    <div>
                      <h3 class="text-sm font-bold">Unsaved Changes</h3>
                      <p class="text-xs">
                        Please save your grade changes before marking the BKP as completed.
                      </p>
                    </div>
                  </div>
                {:else}
                  <div class="alert alert-success">
                    <Icon icon="mdi:information-outline" class="h-5 w-5 shrink-0" />
                    <div>
                      <h3 class="text-sm font-bold">All Grades Filled</h3>
                      <p class="text-xs">
                        All course grades have been entered. You can mark this BKP as completed.
                      </p>
                    </div>
                  </div>
                {/if}

                <div class="mt-3 flex justify-end">
                  <button
                    class="btn gap-2 btn-success"
                    onclick={handleMarkAsCompleted}
                    disabled={isCompleting || hasUnsavedChanges}
                  >
                    {#if isCompleting}
                      <span class="loading loading-spinner loading-sm"></span>
                      Marking as Completed...
                    {:else}
                      <Icon icon="mdi:check-circle-outline" class="h-5 w-5" />
                      Mark as Completed
                    {/if}
                  </button>
                </div>
              </div>
            </div>
          {/if}

          <!-- Navigation Action Buttons -->
          <div class="mt-8 flex flex-wrap justify-center gap-4">
            <a href={resolve(`/bkp/${bkpId}/field-assessment`)} class="btn gap-2 btn-outline">
              <Icon icon="mdi:arrow-left" class="h-5 w-5" />
              Back to Field Assessment
            </a>
            {#if gradingStatus === "completed"}
              <a href={resolve("/bkp")} class="btn gap-2 btn-primary">
                <Icon icon="mdi:check-circle-outline" class="h-5 w-5" />
                Back to BKP List
              </a>
            {/if}
          </div>
        </div>
      {/snippet}
    </Query>
  {/snippet}
</Query>
