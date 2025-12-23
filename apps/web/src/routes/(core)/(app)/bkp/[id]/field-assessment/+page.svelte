<script lang="ts">
  import { page } from "$app/state";
  import Icon from "@iconify/svelte";
  import { setActiveStep, STEP_LABELS } from "../bkp-step.svelte";
  import { uploadFile, getFileUrl } from "$lib";
  import { client } from "$lib/client.svelte";
  import Query from "$lib/components/Query.svelte";
  import {toast} from "$lib";

  $effect(() => {
    setActiveStep(STEP_LABELS.FIELD_ASSESSMENT);
  });

  const bkpId = page.params.id;

  // Fetch BKP data
  const bkpQ = client.bKP.useFindUnique({
    where: { id: bkpId },
    include: {
      User: true,
    },
  });

  const bkpUpdateQ = client.bKP.useUpdate();

  // File upload state
  let fileInput: HTMLInputElement | null = $state(null);
  let selectedFile: File | null = $state(null);
  let isUploading: boolean = $state(false);

  // Modal state
  let deleteModal: HTMLDialogElement | null = $state(null);

  function getStatusBadge(status: string): string {
    const badges: Record<string, string> = {
      draft: "badge-neutral",
      UPLOADING_FIELD_ASSESSMENT: "badge-info",
      GRADING: "badge-warning",
      COMPLETED: "badge-success",
    };
    return badges[status] || "badge-neutral";
  }

  function getStatusText(status: string): string {
    const texts: Record<string, string> = {
      UPLOADING_FIELD_ASSESSMENT: "Pending Upload",
      GRADING: "Under Review",
      COMPLETED: "Completed",
    };
    return texts[status] || status;
  }

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        toast.error("Please select a PDF file");
        target.value = "";
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File size must be less than 10MB");
        target.value = "";
        return;
      }

      selectedFile = file;
    }
  }

  async function handleUpload() {
    if (!selectedFile) return;

    isUploading = true;
    try {
      // Upload file
      const result = await uploadFile({
        file: selectedFile,
        prefix: "field-assessments",
      });

      // Update BKP with assessment key
      await $bkpUpdateQ.mutateAsync({
        where: { id: bkpId },
        data: {
          FieldAssessment: {
            assessmentKey: result.key,
          },
          status: "GRADING",
        },
      });

      toast.success("Field assessment uploaded successfully!");
      selectedFile = null;
      if (fileInput) fileInput.value = "";
      $bkpQ.refetch();
    } catch (error) {
      console.error("Error uploading assessment:", error);
      toast.error("Failed to upload assessment");
    } finally {
      isUploading = false;
    }
  }

  async function handleDelete() {
    try {
      await $bkpUpdateQ.mutateAsync({
        where: { id: bkpId },
        data: {
          FieldAssessment: {
            assessmentKey: null,
          },
          status: "UPLOADING_FIELD_ASSESSMENT",
        },
      });

      toast.success("Assessment deleted successfully!");
      deleteModal?.close();
      $bkpQ.refetch();
    } catch (error) {
      console.error("Error deleting assessment:", error);
      toast.error("Failed to delete assessment");
    }
  }

  function openDeleteModal() {
    deleteModal?.showModal();
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }
</script>

<Query q={bkpQ}>
  {#snippet children(bkp)}
    <div class="max-w-5xl">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="mb-2 text-xl font-bold">Field Assessment</h1>
        <p class="text-xs text-base-content/70">
          Upload the field assessment PDF document from your company
        </p>
      </div>

      <!-- Status Overview -->
      <div class="card mb-4 bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="card-title text-base">Assessment Status</h2>
            <span class="badge {getStatusBadge(bkp.status)} badge-lg">
              {getStatusText(bkp.status)}
            </span>
          </div>
          <div class="divider my-2"></div>

          <div class="flex items-center gap-3">
            {#if bkp.FieldAssessment?.assessmentKey}
              <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-error/10">
                <Icon icon="mdi:file-pdf-box" class="h-6 w-6 text-error" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold">Field Assessment Document</p>
                <p class="text-xs text-base-content/70">PDF Document</p>
              </div>
              <div class="badge badge-success">Uploaded</div>
            {:else}
              <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-base-200">
                <Icon icon="mdi:file-document-outline" class="h-6 w-6 text-base-content/50" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold">No document uploaded</p>
                <p class="text-xs text-base-content/70">Please upload the assessment PDF</p>
              </div>
            {/if}
          </div>

          {#if bkp.status === "GRADING" || bkp.status === "COMPLETED"}
            <div class="mt-3 text-xs text-base-content/70">
              Submitted on: {new Date(bkp.updatedAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          {/if}
        </div>
      </div>

      <!-- Upload Section -->
      {#if bkp.status === "UPLOADING_FIELD_ASSESSMENT" && !bkp.FieldAssessment?.assessmentKey}
        <div class="card mb-4 bg-base-100 shadow-xl">
          <div class="card-body p-4">
            <h2 class="mb-3 card-title text-base">Upload Assessment Document</h2>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Select PDF File</span>
                <span class="label-text-alt text-xs text-base-content/70">Max size: 10MB</span>
              </label>
              <input
                type="file"
                bind:this={fileInput}
                accept="application/pdf"
                class="file-input-bordered file-input w-full"
                onchange={handleFileSelect}
                disabled={isUploading}
              />
            </div>

            {#if selectedFile}
              <div class="mt-3 rounded-lg bg-base-200 p-3">
                <div class="flex items-center gap-3">
                  <Icon icon="mdi:file-pdf-box" class="h-6 w-6 text-error" />
                  <div class="flex-1">
                    <p class="text-sm font-semibold">{selectedFile.name}</p>
                    <p class="text-xs text-base-content/70">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
              </div>
            {/if}

            {#if isUploading}
              <div class="mt-3">
                <div class="mb-2 flex items-center justify-between text-xs">
                  <span>Uploading...</span>
                  <span class="loading loading-spinner loading-sm"></span>
                </div>
                <progress class="progress w-full progress-primary"></progress>
              </div>
            {/if}

            <div class="mt-4 flex gap-2">
              <button
                class="btn gap-2 btn-primary"
                onclick={handleUpload}
                disabled={!selectedFile || isUploading}
              >
                <Icon icon="mdi:upload" class="h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload Document"}
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Uploaded Document Card -->
      {#if bkp.FieldAssessment?.assessmentKey}
        <div class="card mb-4 bg-base-100 shadow-xl">
          <div class="card-body p-4">
            <h2 class="mb-3 card-title text-base">Uploaded Document</h2>

            <div class="rounded-lg border border-base-300 p-4">
              <div class="flex items-start gap-4">
                <div class="flex h-16 w-16 items-center justify-center rounded-lg bg-error/10">
                  <Icon icon="mdi:file-pdf-box" class="h-8 w-8 text-error" />
                </div>
                <div class="flex-1">
                  <h3 class="mb-1 text-sm font-bold">Field Assessment Document</h3>
                  <div class="mb-2 space-y-1 text-xs text-base-content/70">
                    <p>Type: PDF Document</p>
                    <p>
                      Uploaded: {new Date(bkp.updatedAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div class="mt-4 flex gap-2">
                <a
                  href={getFileUrl(bkp.FieldAssessment.assessmentKey)}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn gap-2 btn-outline btn-sm"
                >
                  <Icon icon="mdi:eye-outline" class="h-4 w-4" />
                  View
                </a>
                {#if bkp.status === "UPLOADING_FIELD_ASSESSMENT"}
                  <button class="btn gap-2 btn-outline btn-sm btn-error" onclick={openDeleteModal}>
                    <Icon icon="mdi:delete" class="h-4 w-4" />
                    Delete
                  </button>
                {/if}
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- Info Alert -->
      {#if !bkp.FieldAssessment?.assessmentKey && bkp.status === "UPLOADING_FIELD_ASSESSMENT"}
        <div class="alert alert-info">
          <Icon icon="mdi:information-outline" class="h-5 w-5 shrink-0" />
          <div>
            <h3 class="text-sm font-bold">Upload Required</h3>
            <p class="text-xs">
              Please upload the field assessment PDF document provided by your company.
            </p>
          </div>
        </div>
      {/if}
    </div>
  {/snippet}
</Query>

<!-- Delete Confirmation Modal -->
<dialog bind:this={deleteModal} class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">✕</button>
    </form>
    <h3 class="mb-4 text-lg font-bold">Delete Assessment Document</h3>
    <p class="mb-4">
      Are you sure you want to delete the field assessment document? This action cannot be undone.
    </p>

    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-ghost">Cancel</button>
      </form>
      <button class="btn btn-error" onclick={handleDelete}>Delete</button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
