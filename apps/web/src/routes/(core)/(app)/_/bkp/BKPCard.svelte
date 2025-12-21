<script lang="ts">
  import { resolve } from "$app/paths";
  import Icon from "@iconify/svelte";
  import StatusBadge from "../ui/StatusBadge.svelte";

  interface Props {
    id: string;
    companyName: string;
    position: string;
    bkpType: string;
    bkpCategory: string;
    status: "draft" | "submitted" | "approved" | "rejected";
    submittedDate?: string;
    periode: string;
    weeklyReportsSubmitted?: number;
    totalWeeklyReports?: number;
    isGraded?: boolean;
  }

  let props: Props = $props();

  function getProgressStep(bkp: Props): number {
    if (bkp.status === "draft") return 0;
    if (bkp.status === "submitted") return 1;
    if (bkp.status === "rejected") return 1;
    if (bkp.status === "approved") {
      if (bkp.isGraded) return 5;
      if (
        bkp.weeklyReportsSubmitted &&
        bkp.totalWeeklyReports &&
        bkp.weeklyReportsSubmitted >= bkp.totalWeeklyReports
      )
        return 4;
      return 3;
    }
    return 0;
  }

  function getProgressLabel(bkp: Props): string {
    const step = getProgressStep(bkp);
    const labels = [
      "Draft",
      "Pending Approval",
      "Upload Documents",
      "Weekly Reporting",
      "Grading",
      "Completed",
    ];
    return labels[step] || "";
  }

  function getBorderColor(status: Props["status"]): string {
    const colors = {
      draft: "border-neutral",
      submitted: "border-info",
      approved: "border-success",
      rejected: "border-error",
    };
    return colors[status];
  }

  const progressStep = $derived(getProgressStep(props));
</script>

<div
  class="card border-l-4 bg-base-100 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl {getBorderColor(
    props.status,
  )}"
>
  <div class="card-body p-4 sm:p-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex-1">
        <div class="mb-2 flex flex-wrap items-center gap-2">
          <h2 class="card-title text-base">{props.companyName}</h2>
          <StatusBadge status={props.status} size="sm" />
        </div>
        <p class="mb-3 text-base-content/70">{props.position}</p>

        <!-- Progress Bar -->
        <a href={resolve(`/bkp/${props.id}`)} class="group mb-3 block">
          <div class="mb-1 flex items-center justify-between">
            <span class="text-sm font-semibold transition-colors group-hover:text-primary"
              >Progress: {getProgressLabel(props)}</span
            >
            <span class="text-sm text-base-content/70">{Math.round((progressStep / 5) * 100)}%</span
            >
          </div>
          <progress
            class="progress w-full cursor-pointer progress-primary"
            value={(progressStep / 5) * 100}
            max="100"
          ></progress>
          {#if props.status === "approved" && props.weeklyReportsSubmitted !== undefined && props.totalWeeklyReports}
            <div class="mt-1 text-xs text-base-content/70">
              Weekly Reports: {props.weeklyReportsSubmitted}/{props.totalWeeklyReports}
            </div>
          {/if}
        </a>

        <div class="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span class="font-semibold">ID:</span>
            <span class="ml-1">{props.id}</span>
          </div>
          <div>
            <span class="font-semibold">Category:</span>
            <span class="ml-1">{props.bkpCategory}</span>
          </div>
          <div>
            <span class="font-semibold">Type:</span>
            <span class="ml-1">{props.bkpType}</span>
          </div>
          <div>
            <span class="font-semibold">Periode:</span>
            <span class="ml-1">{props.periode}</span>
          </div>
          {#if props.submittedDate}
            <div class="sm:col-span-2">
              <span class="font-semibold">Submitted:</span>
              <span class="ml-1"
                >{new Date(props.submittedDate).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span
              >
            </div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-4 card-actions justify-end">
      {#if props.status === "draft"}
        <a href={resolve(`/bkp/${props.id}`)} class="btn btn-sm btn-primary">
          <Icon icon="heroicons:pencil-square" class="h-4 w-4" />
          Edit
        </a>
      {:else}
        <a href={resolve(`/bkp/${props.id}`)} class="btn btn-outline btn-sm">
          <Icon icon="heroicons:eye" class="h-4 w-4" />
          View Details
        </a>
        {#if props.status === "approved"}
          <a href={resolve(`/bkp/weekly-report/${props.id}`)} class="btn btn-sm btn-primary">
            <Icon icon="heroicons:document-text" class="h-4 w-4" />
            Weekly Reports
          </a>
        {/if}
      {/if}
    </div>
  </div>
</div>
