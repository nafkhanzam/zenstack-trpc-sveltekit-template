<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import Icon from "@iconify/svelte";
  import { client } from "$lib/client.svelte";
  import Query from "$lib/components/Query.svelte";
  import { nanoid, uploadFile } from "$lib";
  import { toast } from "$lib";
  import { setActiveStep, STEP_LABELS } from "../bkp-step.svelte";
    import type { BKP } from "$lib/zenstack/models";

  $effect(() => {
    setActiveStep(STEP_LABELS.REGISTRATION);
  });

  const bkpId = page.params.id;

  // Fetch BKP data
  const bkpQ = client.bKP.useFindUnique({
    where: { id: bkpId },
    include: {
      User: true,
      RegistrationApproval__reviewedBy_User: true,
    },
  });

  // Update mutation
  const updateBKPMutation = client.bKP.useUpdate();

  // Document uploads
  interface DocumentUpload {
    id: string;
    name: string;
    description: string;
    required: boolean;
    file: File | null;
    templateLink?: string;
    fieldKey: keyof {
      pksKey: string;
      integrityTreatyKey: string;
      acceptanceProofKey: string;
      parentsApprovalKey: string;
      implementationArrangementKey: string;
    };
  }

  let documents = $state<DocumentUpload[]>([
    {
      id: "pks",
      name: "Perjanjian Kerja Sama (PKS)",
      description: "Pakta integritas yang telah ditandatangani",
      required: true,
      file: null,
      templateLink: "https://docs.google.com/document/d/1hOtFe37YraBbhZUulmGaQye-I5GhOaIQ/edit",
      fieldKey: "pksKey",
    },
    {
      id: "integrity",
      name: "Pakta Integritas Magang",
      description: "Pakta integritas yang telah ditandatangani",
      required: true,
      file: null,
      templateLink: "https://its.id/PaktaIntegritas_MagangITS",
      fieldKey: "integrityTreatyKey",
    },
    {
      id: "acceptance",
      name: "Bukti Diterima Magang",
      description: "Surat penerimaan atau konfirmasi magang dari perusahaan",
      required: true,
      file: null,
      fieldKey: "acceptanceProofKey",
    },
    {
      id: "parents",
      name: "Surat Persetujuan Orang Tua",
      description: "Surat persetujuan orang tua untuk magang",
      required: true,
      file: null,
      templateLink: "https://its.id/SuratPersetujuanOT_Magang",
      fieldKey: "parentsApprovalKey",
    },
    {
      id: "ia",
      name: "Implementation Arrangement (IA)",
      description: "Dokumen pengaturan pelaksanaan magang",
      required: true,
      file: null,
      templateLink: "https://its.id/TemplateSPTJM_MagangBerdampak2025",
      fieldKey: "implementationArrangementKey",
    },
  ]);

  // Additional documents (dynamic)
  interface AdditionalDocument {
    id: string;
    name: string;
    notes: string;
    file: File | null;
    key?: string; // S3 key for already uploaded documents
  }

  let additionalDocuments = $state<AdditionalDocument[]>([]);
  let studentNotes = $state("");
  let isSubmitting = $state(false);

  function addAdditionalDocument() {
    additionalDocuments.push({
      id: crypto.randomUUID(),
      name: "",
      notes: "",
      file: null,
    });
  }

  function removeAdditionalDocument(id: string) {
    additionalDocuments = additionalDocuments.filter((doc) => doc.id !== id);
  }

  function handleFileChange(docId: string, event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const doc = documents.find((d) => d.id === docId);
      if (doc) {
        doc.file = target.files[0];
      }
    }
  }

  function handleAdditionalFileChange(docId: string, event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const doc = additionalDocuments.find((d) => d.id === docId);
      if (doc) {
        doc.file = target.files[0];
      }
    }
  }

  async function uploadFiles(currentBKP: BKP) {
    // Upload any selected files
    const uploadPromises = documents
      .filter((doc) => doc.file)
      .map(async (doc) => {
        const result = await uploadFile({
          file: doc.file!,
          prefix: "bkp-registration",
        });
        return { fieldKey: doc.fieldKey, key: result.key };
      });

    const additionalUploadPromises = additionalDocuments
      .filter((doc) => doc.file && doc.name)
      .map(async (doc) => {
        const result = await uploadFile({
          file: doc.file!,
          prefix: "bkp-registration-additional",
        });
        doc.key = result.key;
        return { name: doc.name, notes: doc.notes, key: result.key };
      });

    const uploadedDocs = await Promise.all(uploadPromises);
    const uploadedAdditional = await Promise.all(additionalUploadPromises);

    // Build registration data
    const registrationData: BKP["BKPRegistration"] = {
      ...currentBKP.BKPRegistration,
      studentNotes: studentNotes || undefined,
      // additionalDocuments: [
      //   ...currentBKP.BKPRegistration?.additionalDocuments,
      //   ...uploadedAdditional,
      // ],
      additionalDocuments: additionalDocuments.map(v => ({
        key: v.key,
        name: v.name,
        notes: v.notes,
      }))
    };

    uploadedDocs.forEach(({ fieldKey, key }) => {
      registrationData[fieldKey] = key;
    });

    return registrationData;
  }

  async function handleSubmit(event: Event, currentBKP: BKP) {
    event.preventDefault();

    // Check if all required documents are uploaded
    const missingDocs = documents.filter((doc) => {
      const existingKey = currentBKP.BKPRegistration?.[doc.fieldKey];
      return doc.required && !doc.file && !existingKey;
    });

    if (missingDocs.length > 0) {
      toast.error(`Please upload all required documents: ${missingDocs.map((d) => d.name).join(", ")}`);
      return;
    }

    isSubmitting = true;
    try {
      const registrationData = await uploadFiles(currentBKP);

      // Update BKP with registration data and change status
      await $updateBKPMutation.mutateAsync({
        where: { id: bkpId },
        data: {
          BKPRegistration: registrationData,
          status: "WAITING_REGISTRATION_APPROVAL",
        },
      });

      toast.success("Documents submitted successfully!");
      goto(resolve(`/bkp/${bkpId}/registration-approval`));
    } catch (error) {
      console.error("Error submitting documents:", error);
      toast.error("Failed to submit documents");
    } finally {
      isSubmitting = false;
    }
  }

  async function saveDraft(currentBKP: BKP) {
    isSubmitting = true;
    try {
      const registrationData = await uploadFiles(currentBKP);

      await $updateBKPMutation.mutateAsync({
        where: { id: bkpId },
        data: {
          BKPRegistration: registrationData,
        },
      });

      toast.success("Draft saved successfully!");
      $bkpQ.refetch();

      // Clear file inputs after saving but keep the keys
      documents.forEach((doc) => (doc.file = null));
      additionalDocuments.forEach((doc) => {
        doc.file = null;
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    } finally {
      isSubmitting = false;
    }
  }

  function getUploadStatus(bkp: BKP): "pending" | "uploaded" | "verified" {
    if (bkp.status === "REGISTRATION") return "pending";
    if (bkp.status === "WAITING_REGISTRATION_APPROVAL") return "uploaded";
    if (
      bkp.status === "WEEKLY_REPORTING" ||
      bkp.status === "UPLOADING_FIELD_ASSESSMENT" ||
      bkp.status === "GRADING" ||
      bkp.status === "COMPLETED"
    ) {
      return "verified";
    }
    return "pending";
  }

  function isRejected(bkp: BKP): boolean {
    return bkp.status === "REGISTRATION" && bkp.RegistrationApproval.rejected === true;
  }

  function getStatusBadge(status: "pending" | "uploaded" | "verified"): string {
    const badges = {
      pending: "badge-warning",
      uploaded: "badge-info",
      verified: "badge-success",
    };
    return badges[status];
  }

  function getStatusText(status: "pending" | "uploaded" | "verified"): string {
    const texts = {
      pending: "Pending Upload",
      uploaded: "Uploaded - Awaiting Verification",
      verified: "Verified",
    };
    return texts[status];
  }

  function getStatusIcon(status: "pending" | "uploaded" | "verified"): string {
    if (status === "verified") return "mdi:check-circle-outline";
    if (status === "uploaded") return "mdi:clock-outline";
    return "mdi:upload";
  }

  // Populate form when editing
  $effect(() => {
    if (bkpQ && $bkpQ.data) {
      const bkp = $bkpQ.data;
      studentNotes = bkp.BKPRegistration?.studentNotes || "";

      // Load additional documents
      if (bkp.BKPRegistration?.additionalDocuments) {
        additionalDocuments = bkp.BKPRegistration.additionalDocuments.map((doc: BKP["BKPRegistration"]["additionalDocuments"][number]) => ({
          id: nanoid(),
          name: doc.name || "",
          notes: doc.notes || "",
          file: null, // Already uploaded, no file object
          key: doc.key || undefined,
        }));
      }
    }
  });
</script>

<Query q={bkpQ}>
  {#snippet children(bkp)}
    {@const uploadStatus = getUploadStatus(bkp)}
    {@const canEdit = bkp.status === "REGISTRATION"}
    {@const rejected = isRejected(bkp)}

    <div class="max-w-5xl">
      <!-- Header -->
      <div class="mb-6">
        <div class="mb-2 flex items-center gap-2">
          {#if rejected}
            <div class="badge gap-2 badge-error">
              <Icon icon="mdi:close-circle" class="h-4 w-4" />
              Rejected
            </div>
          {/if}
        </div>
        <h1 class="mb-2 text-xl font-bold">Upload Documents</h1>
        <p class="text-xs text-base-content/70">
          Upload all required documents for your BKP registration
        </p>
      </div>

      <!-- Rejection Card -->
      {#if rejected}
        <div class="mb-6 alert alert-error shadow-lg">
          <div class="flex-none">
            <Icon icon="mdi:alert-circle-outline" class="h-8 w-8" />
          </div>
          <div class="flex-1">
            <h3 class="text-base font-bold">Registration Rejected</h3>
            <div class="mt-1 text-xs">
              <p class="mb-2">
                Your BKP registration was rejected
                {#if bkp.RegistrationApproval.reviewedAt}
                  on {new Date(bkp.RegistrationApproval.reviewedAt).toLocaleDateString()}
                {/if}
                {#if bkp.RegistrationApproval__reviewedBy_User}
                  by {bkp.RegistrationApproval__reviewedBy_User.name}
                {/if}.
              </p>
              {#if bkp.RegistrationApproval.reviewerNotes}
                <div class="card mt-3 bg-error-content/10">
                  <div class="card-body p-3">
                    <h4 class="flex items-center gap-2 text-sm font-semibold">
                      <Icon icon="mdi:comment-alert-outline" class="h-4 w-4" />
                      Rejection Reason:
                    </h4>
                    <p class="mt-1 text-xs whitespace-pre-wrap">{bkp.RegistrationApproval.reviewerNotes}</p>
                  </div>
                </div>
              {/if}
              <p class="mt-3 font-semibold">
                Please review the feedback above and update your documents accordingly.
              </p>
            </div>
          </div>
        </div>
      {/if}

      <!-- Status Card -->
      <div class="card mb-4 bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 class="card-title text-base">Upload Status</h2>
            <span class="badge {getStatusBadge(uploadStatus)} gap-2">
              <Icon icon={getStatusIcon(uploadStatus)} class="h-4 w-4" />
              {getStatusText(uploadStatus)}
            </span>
          </div>

          <div class="divider my-2"></div>

          <div class="grid gap-3 text-sm md:grid-cols-2">
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

            {#if bkp.RegistrationApproval__reviewedBy_User}
              <div>
                <span class="font-semibold">Verified By:</span>
                <span class="ml-2">{bkp.RegistrationApproval__reviewedBy_User.name}</span>
              </div>
            {/if}

            {#if bkp.RegistrationApproval.reviewedAt}
              <div>
                <span class="font-semibold">Verified Date:</span>
                <span class="ml-2">
                  {new Date(bkp.RegistrationApproval.reviewedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            {/if}
          </div>

          {#if bkp.RegistrationApproval.reviewerNotes}
            <div class="mt-3">
              <p class="mb-1 text-sm font-semibold">Comments:</p>
              <div class="rounded-lg bg-base-200 p-3">
                <p class="text-xs whitespace-pre-wrap">{bkp.RegistrationApproval.reviewerNotes}</p>
              </div>
            </div>
          {/if}

          {#if uploadStatus === "pending"}
            <div class="mt-3">
              <div class="alert py-2 alert-warning">
                <Icon icon="mdi:alert-outline" class="h-5 w-5 shrink-0" />
                <div>
                  <h3 class="text-sm font-bold">Documents Required</h3>
                  <p class="text-xs">
                    Please upload all required documents to proceed to the next step.
                  </p>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- BKP Details Card -->
      <div class="card mb-4 bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <h2 class="card-title text-base">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Icon icon="mdi:briefcase-outline" class="h-5 w-5 text-primary" />
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
              <span class="font-semibold">Dates:</span>
              <span class="ml-2">
                {#if bkp.Proposal?.startDate && bkp.Proposal?.endDate}
                  {new Date(bkp.Proposal.startDate).toLocaleDateString()} - {new Date(
                    bkp.Proposal.endDate,
                  ).toLocaleDateString()}
                {:else}
                  N/A
                {/if}
              </span>
            </div>
          </div>
        </div>
      </div>

      <form onsubmit={(e) => handleSubmit(e, bkp)}>
        <!-- Required Documents Section -->
        <div class="card mb-4 bg-base-100 shadow-xl transition-all hover:shadow-2xl">
          <div class="card-body p-4">
            <h2 class="card-title text-base">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10">
                <Icon icon="mdi:file-document-outline" class="h-5 w-5 text-secondary" />
              </div>
              Required Documents
            </h2>
            <div class="divider my-2"></div>

            <div class="grid gap-4 md:grid-cols-2">
              {#each documents as doc (doc.id)}
                {@const existingKey = bkp.BKPRegistration[doc.fieldKey]?.split("/").at(-1)}
                {@const hasFile = !!existingKey}
                <div
                  class="rounded-lg border-2 border-base-300 p-4 transition-all hover:border-primary/50"
                >
                  <div class="mb-3 flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="text-sm font-semibold">
                        {doc.name}
                        {#if doc.required}
                          <span class="text-error">*</span>
                        {/if}
                      </h3>
                      <p class="text-xs text-base-content/70">{doc.description}</p>
                      {#if doc.templateLink}
                        <a
                          href={doc.templateLink}
                          target="_blank"
                          class="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <Icon icon="mdi:download" class="h-3 w-3" />
                          Download Template
                        </a>
                      {/if}
                    </div>
                    {#if hasFile}
                      <span class="badge gap-2 badge-sm badge-success">
                        <Icon icon="mdi:check-circle-outline" class="h-3 w-3" />
                        Uploaded
                      </span>
                    {/if}
                  </div>

                  {#if hasFile}
                    <div class="mb-3 rounded bg-base-200 p-2 text-xs">
                      <div class="flex items-center justify-between">
                        <span class="font-semibold">{existingKey}</span>
                      </div>
                    </div>
                  {/if}

                  {#if canEdit}
                    <div class="form-control">
                      <input
                        id="doc-{doc.id}"
                        type="file"
                        class="file-input-bordered file-input w-full file-input-sm"
                        onchange={(e) => handleFileChange(doc.id, e)}
                        accept=".pdf"
                        required={doc.required && !hasFile}
                      />
                      <label class="label" for="doc-{doc.id}">
                        <span class="label-text-alt">Accepted: PDF</span>
                      </label>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        </div>

        <!-- Additional Documents Section -->
        <div class="card mb-4 bg-base-100 shadow-xl transition-all hover:shadow-2xl">
          <div class="card-body p-4">
            <h2 class="card-title text-base">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                <Icon icon="mdi:plus-circle-outline" class="h-5 w-5 text-accent" />
              </div>
              Additional Documents
              <span class="badge badge-ghost badge-sm">Optional</span>
            </h2>
            <div class="divider my-2"></div>

            <div class="space-y-3">
              {#each additionalDocuments as doc (doc.id)}
                {@const existingFileName = doc.key?.split("/").at(-1)}
                {@const hasFile = !!existingFileName}
                <div
                  class="bg-base-50 rounded-lg border-2 border-base-300 p-3 transition-all hover:border-primary/50"
                >
                  <div class="mb-3 flex items-center justify-between">
                    <div class="flex-1">
                      <h3 class="text-sm font-semibold">
                        {doc.name || "Additional Document"}
                      </h3>
                      {#if doc.notes}
                        <p class="text-xs text-base-content/70">{doc.notes}</p>
                      {/if}
                    </div>
                    <div class="flex items-center gap-2">
                      {#if hasFile}
                        <span class="badge gap-2 badge-sm badge-success">
                          <Icon icon="mdi:check-circle-outline" class="h-3 w-3" />
                          Uploaded
                        </span>
                      {/if}
                      {#if canEdit}
                        <button
                          type="button"
                          class="btn btn-circle btn-ghost btn-sm"
                          onclick={() => removeAdditionalDocument(doc.id)}
                          aria-label="Remove document"
                        >
                          <Icon icon="mdi:close" class="h-5 w-5" />
                        </button>
                      {/if}
                    </div>
                  </div>

                  {#if hasFile}
                    <div class="mb-3 rounded bg-base-200 p-2 text-xs">
                      <div class="flex items-center justify-between">
                        <span class="font-semibold">{existingFileName}</span>
                      </div>
                    </div>
                  {/if}

                  {#if canEdit}
                    <div class="flex flex-col gap-3">
                      {#if !hasFile}
                        <div class="flex flex-col items-start gap-3 lg:flex-row">
                          <label
                            class="label flex flex-wrap items-center pt-3 lg:flex-1"
                            for="doc-name-{doc.id}"
                          >
                            <span class="label-text text-xs font-semibold text-wrap"
                              >Document Name</span
                            >
                          </label>
                          <input
                            id="doc-name-{doc.id}"
                            type="text"
                            placeholder="e.g., Additional Portfolio"
                            class="input-bordered input lg:flex-1"
                            bind:value={doc.name}
                          />
                        </div>
                        <div class="flex flex-col items-start gap-3 lg:flex-row">
                          <label
                            class="label flex flex-wrap items-center pt-3 lg:flex-1"
                            for="doc-notes-{doc.id}"
                          >
                            <span class="label-text text-xs font-semibold text-wrap">Notes</span>
                          </label>
                          <input
                            id="doc-notes-{doc.id}"
                            type="text"
                            placeholder="Additional notes about this document..."
                            class="input-bordered input lg:flex-1"
                            bind:value={doc.notes}
                          />
                        </div>
                      {/if}
                      <div class="flex flex-col items-start gap-3 lg:flex-row">
                        <label
                          class="label flex flex-wrap items-center pt-3 lg:flex-1"
                          for="doc-file-{doc.id}"
                        >
                          <span class="label-text text-xs font-semibold text-wrap">
                            {hasFile ? "Replace File" : "File"}
                          </span>
                        </label>
                        <input
                          id="doc-file-{doc.id}"
                          type="file"
                          class="file-input-bordered file-input w-full lg:flex-1"
                          onchange={(e) => handleAdditionalFileChange(doc.id, e)}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                        />
                      </div>
                    </div>
                  {/if}
                </div>
              {/each}

              {#if canEdit}
                <button
                  type="button"
                  class="btn gap-2 btn-outline btn-sm"
                  onclick={addAdditionalDocument}
                >
                  <Icon icon="mdi:plus" class="h-5 w-5" />
                  Add Document
                </button>
              {/if}
            </div>
          </div>
        </div>

        <!-- Notes Section -->
        {#if canEdit}
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
                <div class="flex flex-col items-start gap-4 lg:flex-row">
                  <label
                    class="label flex flex-wrap items-center pt-4 lg:flex-1"
                    for="studentNotes"
                  >
                    <span class="label-text text-xs font-semibold text-wrap">Student Notes</span>
                  </label>
                  <textarea
                    id="studentNotes"
                    placeholder="Add any additional notes or comments about the documents..."
                    class="textarea-bordered textarea h-32 lg:flex-1"
                    bind:value={studentNotes}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        {/if}

        <!-- User Action Buttons -->
        <div class="mt-6 flex flex-wrap justify-center gap-4">
          <a href={resolve(`/bkp/${bkpId}/approval`)} class="btn gap-2 btn-outline">
            <Icon icon="mdi:arrow-left" class="h-5 w-5" />
            Back to Proposal Approval
          </a>
          {#if canEdit}
            <button
              type="button"
              class="btn gap-2 btn-secondary"
              onclick={() => saveDraft(bkp)}
              disabled={isSubmitting}
            >
              <Icon icon="mdi:content-save-outline" class="h-5 w-5" />
              {isSubmitting ? "Saving..." : "Save Draft"}
            </button>
            <button type="submit" class="btn gap-2 btn-primary" disabled={isSubmitting}>
              <Icon icon="mdi:upload" class="h-5 w-5" />
              {isSubmitting ? "Submitting..." : "Submit Documents"}
            </button>
          {:else}
            <a href={resolve(`/bkp/${bkpId}/registration-approval`)} class="btn gap-2 btn-primary">
              <Icon icon="mdi:file-check-outline" class="h-5 w-5" />
              Go to Registration Approval
            </a>
          {/if}
        </div>
      </form>
    </div>
  {/snippet}
</Query>
