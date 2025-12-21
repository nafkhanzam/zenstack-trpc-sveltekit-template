<script lang="ts">
  import { page } from "$app/stores";
  import { resolve } from "$app/paths";
  import { goto } from "$app/navigation";
  import { client } from "$lib/client.svelte";
  import { user } from "$lib/stores/user.svelte";
  import Query from "$lib/components/Query.svelte";
  import {toast} from "$lib";
  import Svelecte from "svelecte";
  import Icon from "@iconify/svelte";
  import { setActiveStep, STEP_LABELS } from "./bkp-step.svelte";

  $effect(() => {
    setActiveStep(STEP_LABELS.PROPOSAL);
  });

  const bkpId = $page.params.id;
  const isNew = bkpId === "new";

  // Fetch BKP data if editing
  const bkpQ = isNew
    ? null
    : client.bKP.useFindUnique({
        where: { id: bkpId },
        include: {
          User: true,
          ProposalApproval__reviewedBy_User: true,
        },
      });

  // Fetch courses for conversion dropdown
  const coursesQ = client.course.useFindMany({
    orderBy: { code: "asc" },
    include: {
      Major: true,
    },
  });

  // Mutations
  const createBKPMutation = client.bKP.useCreate();
  const updateBKPMutation = client.bKP.useUpdate();

  // Form state
  let periode = $state("");
  let companyName = $state("");
  let position = $state("");
  let jobDescription = $state("");
  let monthDuration = $state<number | "">("");
  let startDate = $state("");
  let endDate = $state("");
  let bkpType = $state("");
  let jobLink = $state("");
  let studentNotes = $state("");

  // Conversion courses (dynamic)
  interface ConversionCourse {
    id: string;
    courseId: string;
  }
  let conversionCourses = $state<ConversionCourse[]>([]);

  // Modal state
  let showHelpModal = $state(false);
  let helpContent = $state("");
  let isSubmitting = $state(false);

  function showHelp(content: string) {
    helpContent = content;
    showHelpModal = true;
  }

  function addConversionCourse() {
    conversionCourses.push({
      id: crypto.randomUUID(),
      courseId: "",
    });
  }

  function removeConversionCourse(id: string) {
    conversionCourses = conversionCourses.filter((course) => course.id !== id);
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!monthDuration || monthDuration < 1) {
      toast.error("Please enter a valid duration");
      return;
    }

    isSubmitting = true;
    try {
      const proposalData = {
        companyName,
        position,
        jobDescription,
        monthDuration: Number(monthDuration),
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        bkpType,
        period: periode,
        jobLink: jobLink || undefined,
        studentNotes: studentNotes || undefined,
        submittedAt: new Date(),
      };

      if (isNew) {
        await $createBKPMutation.mutateAsync({
          data: {
            userId: user().id,
            status: "WAITING_PROPOSAL_APPROVAL",
            Proposal: proposalData,
            BKPRegistration: {},
            WeeklyReports: { WeeklyReportList: [] },
            FieldAssessment: {},
            Grading: { components: [] },
          },
        });
        toast.success("BKP proposal submitted successfully!");
        goto(resolve("/bkp"));
      } else {
        await $updateBKPMutation.mutateAsync({
          where: { id: bkpId },
          data: {
            status: "WAITING_PROPOSAL_APPROVAL",
            Proposal: proposalData,
          },
        });
        toast.success("BKP proposal updated and submitted!");
        bkpQ?.refetch();
      }
    } catch (error) {
      console.error("Error submitting BKP:", error);
      toast.error("Failed to submit BKP proposal");
    } finally {
      isSubmitting = false;
    }
  }

  async function saveDraft() {
    isSubmitting = true;
    try {
      const proposalData = {
        companyName: companyName || undefined,
        position: position || undefined,
        jobDescription: jobDescription || undefined,
        monthDuration: monthDuration ? Number(monthDuration) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        bkpType: bkpType || undefined,
        period: periode || undefined,
        jobLink: jobLink || undefined,
        studentNotes: studentNotes || undefined,
      };

      if (isNew) {
        const result = await $createBKPMutation.mutateAsync({
          data: {
            userId: user().id,
            status: "PROPOSAL",
            Proposal: proposalData,
            BKPRegistration: {},
            WeeklyReports: { WeeklyReportList: [] },
            FieldAssessment: {},
            Grading: { components: [] },
          },
        });
        toast.success("Draft saved successfully!");
        goto(resolve(`/bkp/${result.id}`));
      } else {
        await $updateBKPMutation.mutateAsync({
          where: { id: bkpId },
          data: {
            status: "PROPOSAL",
            Proposal: proposalData,
          },
        });
        toast.success("Draft saved successfully!");
        bkpQ?.refetch();
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    } finally {
      isSubmitting = false;
    }
  }

  // Populate form when editing
  $effect(() => {
    if (!isNew && bkpQ && $bkpQ.data) {
      const bkp = $bkpQ.data;
      periode = bkp.Proposal?.period || "";
      companyName = bkp.Proposal?.companyName || "";
      position = bkp.Proposal?.position || "";
      jobDescription = bkp.Proposal?.jobDescription || "";
      monthDuration = bkp.Proposal?.monthDuration || "";
      startDate = bkp.Proposal?.startDate
        ? new Date(bkp.Proposal.startDate).toISOString().split("T")[0]
        : "";
      endDate = bkp.Proposal?.endDate
        ? new Date(bkp.Proposal.endDate).toISOString().split("T")[0]
        : "";
      bkpType = bkp.Proposal?.bkpType || "";
      jobLink = bkp.Proposal?.jobLink || "";
      studentNotes = bkp.Proposal?.studentNotes || "";
    }
  });
</script>

<Query q={isNew ? coursesQ : bkpQ}>
  {#snippet children(data)}
    {@const bkp = isNew ? null : data}
    {@const isRejected = bkp && bkp.ProposalApproval && bkp.status === "PROPOSAL"}

    <div class="max-w-5xl">
      <!-- Header -->
      <div class="mb-6">
        <div class="mb-2 flex items-center gap-2">
          {#if isRejected}
            <div class="badge gap-2 badge-error">
              <Icon icon="mdi:close-circle" class="h-4 w-4" />
              Rejected
            </div>
          {:else if isNew}
            <div class="badge gap-2 badge-success">
              <Icon icon="mdi:plus" class="h-4 w-4" />
              New
            </div>
          {:else if bkp?.status === "PROPOSAL"}
            <div class="badge gap-2 badge-warning">
              <Icon icon="mdi:file-document-edit" class="h-4 w-4" />
              Draft
            </div>
          {:else if bkp?.status === "WAITING_PROPOSAL_APPROVAL"}
            <div class="badge gap-2 badge-info">
              <Icon icon="mdi:clock-outline" class="h-4 w-4" />
              Waiting Approval
            </div>
          {/if}
        </div>
        <h1 class="mb-2 text-xl font-bold">
          {isNew ? "New BKP Proposal" : "Edit BKP Proposal"}
        </h1>
        <p class="text-xs text-base-content/70">
          Fill in all required information for your BKP submission
        </p>
      </div>

      <!-- Rejection Card -->
      {#if isRejected && bkp.ProposalApproval}
        <div class="mb-6 alert alert-error shadow-lg">
          <div class="flex-none">
            <Icon icon="mdi:alert-circle-outline" class="h-8 w-8" />
          </div>
          <div class="flex-1">
            <h3 class="text-base font-bold">Proposal Rejected</h3>
            <div class="mt-1 text-xs">
              <p class="mb-2">
                Your BKP proposal was rejected
                {#if bkp.ProposalApproval.reviewedAt}
                  on {new Date(bkp.ProposalApproval.reviewedAt).toLocaleDateString()}
                {/if}
                {#if bkp.ProposalApproval__reviewedBy_User}
                  by {bkp.ProposalApproval__reviewedBy_User.name}
                {/if}.
              </p>
              {#if bkp.ProposalApproval.reviewerNotes}
                <div class="card mt-3 bg-error-content/10">
                  <div class="card-body p-3">
                    <h4 class="flex items-center gap-2 text-sm font-semibold">
                      <Icon icon="mdi:comment-alert-outline" class="h-4 w-4" />
                      Rejection Reason:
                    </h4>
                    <p class="mt-1 text-xs">{bkp.ProposalApproval.reviewerNotes}</p>
                  </div>
                </div>
              {/if}
              <p class="mt-3 font-semibold">
                Please review the feedback above and update your proposal accordingly.
              </p>
            </div>
          </div>
        </div>
      {/if}

      <form onsubmit={handleSubmit}>
        <!-- Registration Details Section -->
        <div class="card mb-4 bg-base-100 shadow-xl transition-all hover:shadow-2xl">
          <div class="card-body p-4">
            <h2 class="card-title text-base">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Icon icon="mdi:file-document-outline" class="h-5 w-5 text-primary" />
              </div>
              Registration Information
            </h2>
            <div class="divider my-2"></div>

            <div class="space-y-3">
              <!-- Periode -->
              <div class="flex flex-col items-start gap-3 lg:flex-row">
                <label class="label flex flex-wrap items-center pt-3 lg:flex-1" for="periode">
                  <span class="label-text text-xs font-semibold text-wrap"
                    >Periode (FRS) <span class="text-error">*</span></span
                  >
                  <button
                    type="button"
                    class="label-text-alt flex link items-center gap-1 link-primary"
                    onclick={() =>
                      showHelp(
                        "Periode akademik saat Anda mengambil BKP ini. Contoh: Genap 2023/2024",
                      )}
                  >
                    <Icon icon="mdi:help-circle-outline" class="h-4 w-4" />
                    Help
                  </button>
                </label>
                <select
                  id="periode"
                  class="select-bordered select lg:flex-1"
                  bind:value={periode}
                  required
                >
                  <option value="">Select periode...</option>
                  <option value="Ganjil 2023/2024">Ganjil 2023/2024</option>
                  <option value="Genap 2023/2024">Genap 2023/2024</option>
                  <option value="Ganjil 2024/2025">Ganjil 2024/2025</option>
                  <option value="Genap 2024/2025">Genap 2024/2025</option>
                  <option value="Ganjil 2025/2026">Ganjil 2025/2026</option>
                </select>
              </div>

              <!-- BKP Type -->
              <div class="flex flex-col items-start gap-3 lg:flex-row">
                <label class="label flex flex-wrap items-center pt-3 lg:flex-1" for="bkpType">
                  <span class="label-text text-xs font-semibold text-wrap"
                    >Jenis BKP <span class="text-error">*</span></span
                  >
                </label>
                <select
                  id="bkpType"
                  class="select-bordered select lg:flex-1"
                  bind:value={bkpType}
                  required
                >
                  <option value="">Select BKP type...</option>
                  <option value="Magang Berdampak">Magang Berdampak</option>
                  <option value="Magang Mandiri">Magang Mandiri</option>
                  <option value="Lomba">Lomba</option>
                  <option value="Riset">Riset</option>
                  <option value="Startup">Startup</option>
                  <option value="Proyek Kemanusiaan">Proyek Kemanusiaan</option>
                </select>
              </div>

              <!-- Company Name -->
              <div class="flex flex-col items-start gap-3 lg:flex-row">
                <label class="label flex flex-wrap items-center pt-3 lg:flex-1" for="company">
                  <span class="label-text text-xs font-semibold text-wrap"
                    >Nama Perusahaan/Organisasi <span class="text-error">*</span></span
                  >
                  <button
                    type="button"
                    class="label-text-alt flex link items-center gap-1 link-primary"
                    onclick={() =>
                      showHelp("Masukkan nama perusahaan secara legal, contoh: PT Tokopedia")}
                  >
                    <Icon icon="mdi:help-circle-outline" class="h-4 w-4" />
                    Help
                  </button>
                </label>
                <input
                  id="company"
                  type="text"
                  placeholder="e.g., PT Tokopedia"
                  class="input-bordered input lg:flex-1"
                  bind:value={companyName}
                  required
                />
              </div>

              <!-- Position -->
              <div class="flex flex-col items-start gap-3 lg:flex-row">
                <label class="label flex flex-wrap items-center pt-3 lg:flex-1" for="position">
                  <span class="label-text text-xs font-semibold text-wrap"
                    >Nama Posisi (Role) <span class="text-error">*</span></span
                  >
                </label>
                <input
                  id="position"
                  type="text"
                  placeholder="e.g., Frontend Engineer Intern"
                  class="input-bordered input lg:flex-1"
                  bind:value={position}
                  required
                />
              </div>

              <!-- Job Description -->
              <div class="flex flex-col items-start gap-3 lg:flex-row">
                <label class="label pt-3 lg:flex-1" for="description">
                  <span class="label-text text-xs font-semibold text-wrap"
                    >Deskripsi Pekerjaan <span class="text-error">*</span></span
                  >
                </label>
                <textarea
                  id="description"
                  placeholder="Describe your job responsibilities..."
                  class="textarea-bordered textarea h-32 lg:flex-1"
                  bind:value={jobDescription}
                  required
                ></textarea>
              </div>

              <!-- Duration and Dates -->
              <div class="flex flex-col items-start gap-3 lg:flex-row">
                <label class="label flex flex-wrap items-center pt-3 lg:flex-1" for="monthDuration">
                  <span class="label-text text-xs font-semibold text-wrap"
                    >Durasi (Bulan) <span class="text-error">*</span></span
                  >
                </label>
                <input
                  id="monthDuration"
                  type="number"
                  placeholder="e.g., 3"
                  class="input-bordered input lg:flex-1"
                  bind:value={monthDuration}
                  min="1"
                  required
                />
              </div>

              <div class="flex flex-col items-start gap-3 lg:flex-row">
                <label class="label flex flex-wrap items-center pt-3 lg:flex-1" for="startDate">
                  <span class="label-text text-xs font-semibold text-wrap">Start Date</span>
                </label>
                <input
                  id="startDate"
                  type="date"
                  class="input-bordered input lg:flex-1"
                  bind:value={startDate}
                />
              </div>

              <div class="flex flex-col items-start gap-3 lg:flex-row">
                <label class="label flex flex-wrap items-center pt-3 lg:flex-1" for="endDate">
                  <span class="label-text text-xs font-semibold text-wrap">End Date</span>
                </label>
                <input
                  id="endDate"
                  type="date"
                  class="input-bordered input lg:flex-1"
                  bind:value={endDate}
                />
              </div>

              <!-- Job Link -->
              <div class="flex flex-col items-start gap-3 lg:flex-row">
                <label class="label flex flex-wrap items-center pt-3 lg:flex-1" for="jobLink">
                  <span class="label-text text-xs font-semibold text-wrap"
                    >Link Lowongan (optional)</span
                  >
                </label>
                <input
                  id="jobLink"
                  type="url"
                  placeholder="https://..."
                  class="input-bordered input lg:flex-1"
                  bind:value={jobLink}
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Conversion Courses Section -->
        <Query q={coursesQ}>
          {#snippet children(courses)}
            <div class="card mb-4 bg-base-100 shadow-xl transition-all hover:shadow-2xl">
              <div class="card-body p-4">
                <h2 class="card-title text-base">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-warning/10">
                    <Icon icon="mdi:school-outline" class="h-5 w-5 text-warning" />
                  </div>
                  Mata Kuliah Konversi
                  <a
                    href={resolve("/courses")}
                    class="label-text-alt ml-auto flex link items-center gap-1 link-primary"
                    target="_blank"
                  >
                    <Icon icon="mdi:open-in-new" class="h-4 w-4" />
                    View all courses
                  </a>
                </h2>
                <div class="divider my-2"></div>

                <div class="space-y-3">
                  {#if conversionCourses.length > 0}
                    <div>
                      <table class="table table-sm">
                        <thead>
                          <tr>
                            <th class="text-xs">No</th>
                            <th class="text-xs">Kode dan Nama Mata Kuliah</th>
                            <th class="text-xs">Jenis</th>
                            <th class="text-xs">SKS</th>
                            <th class="text-xs">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {#each conversionCourses as convCourse, idx (convCourse.id)}
                            {@const selectedCourseData = courses.find(
                              (c) => c.id === convCourse.courseId,
                            )}
                            <tr>
                              <td class="text-xs">{idx + 1}</td>
                              <td>
                                <Svelecte
                                  options={courses.map((c) => ({
                                    value: c.id,
                                    label: `${c.code} - ${c.name} (${c.sks} SKS)`,
                                  }))}
                                  bind:value={convCourse.courseId}
                                  placeholder="Select course..."
                                  class="min-w-[200px]"
                                  required
                                />
                              </td>
                              <td class="text-xs">{selectedCourseData?.type || "-"}</td>
                              <td class="text-xs">{selectedCourseData?.sks || "-"}</td>
                              <td>
                                <button
                                  type="button"
                                  class="btn btn-circle bg-error btn-ghost btn-xs"
                                  onclick={() => removeConversionCourse(convCourse.id)}
                                  aria-label="Remove course"
                                >
                                  <Icon icon="mdi:close" class="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          {/each}
                        </tbody>
                        <tfoot>
                          <tr class="font-semibold">
                            <td colspan="3" class="text-right text-xs">Total SKS:</td>
                            <td class="text-xs">
                              {conversionCourses.reduce((total, convCourse) => {
                                const courseData = courses.find(
                                  (c) => c.id === convCourse.courseId,
                                );
                                return total + (courseData?.sks || 0);
                              }, 0)}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  {/if}

                  <button
                    type="button"
                    class="btn gap-2 btn-outline btn-sm"
                    onclick={addConversionCourse}
                  >
                    <Icon icon="mdi:plus" class="h-5 w-5" />
                    Add Course
                  </button>
                </div>
              </div>
            </div>
          {/snippet}
        </Query>

        <!-- Notes Section -->
        <div class="card mb-8 bg-base-100 shadow-xl transition-all hover:shadow-2xl">
          <div class="card-body p-4">
            <h2 class="card-title text-base">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-info/10">
                <Icon icon="mdi:note-text-outline" class="h-5 w-5 text-info" />
              </div>
              Notes
            </h2>
            <div class="divider my-2"></div>

            <div class="space-y-4">
              <!-- Student Notes -->
              <div class="flex flex-col items-start gap-4 lg:flex-row">
                <label class="label flex flex-wrap items-center pt-4 lg:flex-1" for="studentNotes">
                  <span class="label-text text-xs font-semibold text-wrap">Student Notes</span>
                </label>
                <textarea
                  id="studentNotes"
                  placeholder="Add any additional notes or comments..."
                  class="textarea-bordered textarea h-32 lg:flex-1"
                  bind:value={studentNotes}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap justify-end gap-4">
          <a href={resolve("/bkp")} class="btn gap-2 btn-outline">
            <Icon icon="mdi:close" class="h-5 w-5" />
            Cancel
          </a>
          <button
            type="button"
            class="btn gap-2 btn-secondary"
            onclick={saveDraft}
            disabled={isSubmitting}
          >
            <Icon icon="mdi:content-save-outline" class="h-5 w-5" />
            {isSubmitting ? "Saving..." : "Save Draft"}
          </button>
          <button type="submit" class="btn gap-2 btn-primary" disabled={isSubmitting}>
            <Icon icon="mdi:send" class="h-5 w-5" />
            {isSubmitting ? "Submitting..." : "Submit for Approval"}
          </button>
        </div>
      </form>
    </div>
  {/snippet}
</Query>

<!-- Help Modal -->
{#if showHelpModal}
  <div class="modal-open modal" onclick={() => (showHelpModal = false)}>
    <div class="modal-box" onclick={(e) => e.stopPropagation()}>
      <h3 class="flex items-center gap-2 text-lg font-bold">
        <Icon icon="mdi:information-outline" class="h-6 w-6 text-primary" />
        Help
      </h3>
      <p class="py-4">{helpContent}</p>
      <div class="modal-action">
        <button class="btn btn-primary" onclick={() => (showHelpModal = false)}>Close</button>
      </div>
    </div>
  </div>
{/if}
