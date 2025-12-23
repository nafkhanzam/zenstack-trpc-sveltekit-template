<script lang="ts">
  import { page } from "$app/state";
  import Icon from "@iconify/svelte";
  import { client } from "$lib/client.svelte";
  import Query from "$lib/components/Query.svelte";
  import { setActiveStep, STEP_LABELS } from "../bkp-step.svelte";

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

  // Fetch all courses to get details
  const coursesQ = client.course.useFindMany({
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
    if (score >= 80) return "text-success";
    if (score >= 70) return "text-info";
    if (score >= 60) return "text-warning";
    return "text-error";
  }

  function getGradeLetter(score: number): string {
    if (score >= 85) return "A";
    if (score >= 80) return "A-";
    if (score >= 75) return "B+";
    if (score >= 70) return "B";
    if (score >= 65) return "B-";
    if (score >= 60) return "C+";
    if (score >= 55) return "C";
    if (score >= 50) return "D";
    return "E";
  }

  function getGradingStatus(bkp: any): "pending" | "in_progress" | "completed" {
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

  function calculateWeightedScore(components: any[], courses: any[]): number {
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
</script>

<Query q={bkpQ}>
  {#snippet children(bkp)}
    <Query q={coursesQ}>
      {#snippet children(allCourses)}
        {@const gradingStatus = getGradingStatus(bkp)}
        {@const components = bkp.Grading?.components || []}
        {@const gradedCourses = components.filter(
          (c: any) => c.score !== null && c.score !== undefined,
        )}
        {@const totalCourses = components.length}
        {@const showGrades = bkp.status === "COMPLETED"}
        {@const courseDetails = components.map((comp: any) => {
          const course = allCourses.find((c) => c.id === comp.courseId);
          return {
            component: comp,
            course: course,
          };
        })}
        {@const totalSks = courseDetails.reduce((sum, item) => sum + (item.course?.sks || 0), 0)}
        {@const weightedScore = calculateWeightedScore(components, allCourses)}

        <div class="max-w-5xl">
          <!-- Header -->
          <div class="mb-6">
            <h1 class="mb-2 text-xl font-bold">BKP Grading</h1>
            <p class="text-xs text-base-content/70">View your BKP assessment and final grade</p>
          </div>

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
                              <div class="text-xl font-bold {getGradeColor(item.component.score)}">
                                {item.component.score}/100
                              </div>
                              <div
                                class="mt-1 text-sm font-semibold {getGradeColor(
                                  item.component.score,
                                )}"
                              >
                                {item.component.grade || getGradeLetter(item.component.score)}
                              </div>
                            {:else}
                              <span class="badge badge-sm badge-success">Graded</span>
                            {/if}
                          {:else}
                            <span class="badge badge-sm badge-neutral">Not graded</span>
                          {/if}
                        </div>
                      </div>

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
                    </div>
                  {/each}
                </div>
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
                  <span class="ml-2">{bkp.Proposal?.companyName || "N/A"}</span>
                </div>
                <div>
                  <span class="font-semibold">Position:</span>
                  <span class="ml-2">{bkp.Proposal?.position || "N/A"}</span>
                </div>
                <div>
                  <span class="font-semibold">Type:</span>
                  <span class="ml-2">{bkp.Proposal?.bkpType || "N/A"}</span>
                </div>
                <div>
                  <span class="font-semibold">Duration:</span>
                  <span class="ml-2">
                    {bkp.Proposal?.monthDuration ? `${bkp.Proposal.monthDuration} months` : "N/A"}
                  </span>
                </div>
                <div>
                  <span class="font-semibold">Period:</span>
                  <span class="ml-2">{bkp.Proposal?.period || "N/A"}</span>
                </div>
                <div>
                  <span class="font-semibold">Status:</span>
                  <span class="ml-2">{bkp.status.replace(/_/g, " ")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/snippet}
    </Query>
  {/snippet}
</Query>
