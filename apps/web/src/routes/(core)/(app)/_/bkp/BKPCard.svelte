<script lang="ts">
  import { resolve } from "$app/paths";
  import Icon from "@iconify/svelte";
  import StatusBadge from "../ui/StatusBadge.svelte";
  import { BKPStatus } from "$lib/zenstack/models";

  interface Props {
    id: string;
    companyName: string;
    position: string;
    bkpType: string;
    bkpCategory: string;
    status: BKPStatus;
    submittedDate?: string;
    periode: string;
    weeklyReportsSubmitted?: number;
    totalWeeklyReports?: number;
    isGraded?: boolean;
  }

  let props: Props = $props();

  function getProgressStep(status: BKPStatus): number {
    switch (status) {
      case BKPStatus.PROPOSAL:
        return 0;
      case BKPStatus.WAITING_PROPOSAL_APPROVAL:
        return 1;
      case BKPStatus.REGISTRATION:
        return 2;
      case BKPStatus.WAITING_REGISTRATION_APPROVAL:
        return 3;
      case BKPStatus.WEEKLY_REPORTING:
        return 4;
      case BKPStatus.UPLOADING_FIELD_ASSESSMENT:
        return 5;
      case BKPStatus.GRADING:
        return 6;
      case BKPStatus.COMPLETED:
        return 7;
      case BKPStatus.DELETED:
        return 0;
      default:
        return 0;
    }
  }

  function getProgressLabel(status: BKPStatus): string {
    switch (status) {
      case BKPStatus.PROPOSAL:
        return "Creating Proposal";
      case BKPStatus.WAITING_PROPOSAL_APPROVAL:
        return "Pending Proposal Approval";
      case BKPStatus.REGISTRATION:
        return "Uploading Registration Documents";
      case BKPStatus.WAITING_REGISTRATION_APPROVAL:
        return "Pending Registration Approval";
      case BKPStatus.WEEKLY_REPORTING:
        return "Weekly Reporting";
      case BKPStatus.UPLOADING_FIELD_ASSESSMENT:
        return "Uploading Field Assessment";
      case BKPStatus.GRADING:
        return "Being Graded";
      case BKPStatus.COMPLETED:
        return "Completed";
      case BKPStatus.DELETED:
        return "Deleted";
      default:
        return "Unknown";
    }
  }

  function getBorderColor(status: BKPStatus): string {
    switch (status) {
      case BKPStatus.PROPOSAL:
        return "border-neutral";
      case BKPStatus.WAITING_PROPOSAL_APPROVAL:
      case BKPStatus.WAITING_REGISTRATION_APPROVAL:
        return "border-info";
      case BKPStatus.REGISTRATION:
      case BKPStatus.WEEKLY_REPORTING:
      case BKPStatus.UPLOADING_FIELD_ASSESSMENT:
        return "border-warning";
      case BKPStatus.GRADING:
        return "border-secondary";
      case BKPStatus.COMPLETED:
        return "border-success";
      case BKPStatus.DELETED:
        return "border-error";
      default:
        return "border-neutral";
    }
  }

  const progressStep = $derived(getProgressStep(props.status));
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
              >Progress: {getProgressLabel(props.status)}</span
            >
            <span class="text-sm text-base-content/70">{Math.round((progressStep / 7) * 100)}%</span
            >
          </div>
          <progress
            class="progress w-full cursor-pointer progress-primary"
            value={(progressStep / 7) * 100}
            max="100"
          ></progress>
          {#if props.status === BKPStatus.WEEKLY_REPORTING && props.weeklyReportsSubmitted !== undefined && props.totalWeeklyReports}
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
      {#if props.status === BKPStatus.PROPOSAL}
        <a href={resolve(`/bkp/${props.id}`)} class="btn btn-sm btn-primary">
          <Icon icon="heroicons:pencil-square" class="h-4 w-4" />
          Edit
        </a>
      {:else}
        <a href={resolve(`/bkp/${props.id}`)} class="btn btn-outline btn-sm">
          <Icon icon="heroicons:eye" class="h-4 w-4" />
          View Details
        </a>
        {#if props.status === BKPStatus.WEEKLY_REPORTING}
          <a href={resolve(`/bkp/weekly-report/${props.id}`)} class="btn btn-sm btn-primary">
            <Icon icon="heroicons:document-text" class="h-4 w-4" />
            Weekly Reports
          </a>
        {/if}
      {/if}
    </div>
  </div>
</div>
