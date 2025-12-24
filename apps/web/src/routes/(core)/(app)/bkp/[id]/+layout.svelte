<script lang="ts">
  import { page } from "$app/state";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Icon from "@iconify/svelte";
  import type { ResolvedPathname } from "$app/types";
  import { getActiveStep, STEP_LABELS, type StepLabel } from "./bkp-step.svelte";
  import { client } from "$lib/client.svelte";
  import { BKPStatus } from "$lib/zenstack/models";

  interface Props {
    children: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  const bkpId = page.params.id;

  // Query real BKP data
  const bkpQ = client.bKP.useFindUnique({
    where: {
      id: bkpId,
    },
  });

  const bkp = $derived($bkpQ.data);

  function getProgressStep(status: BKPStatus, hasGrading: boolean): number {
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
        return hasGrading ? 7 : 6;
      default:
        return 0;
    }
  }

  const progressStep = $derived(
    bkp ? getProgressStep(bkp.status, bkp.Grading?.components?.length > 0) : 0
  );

  // Define steps configuration
  const steps: { label: StepLabel; path: ResolvedPathname }[] = [
    { label: STEP_LABELS.PROPOSAL, path: `/bkp/${bkpId}` },
    { label: STEP_LABELS.P_APPROVAL, path: `/bkp/${bkpId}/approval` },
    {
      label: STEP_LABELS.REGISTRATION,
      path: `/bkp/${bkpId}/register`,
    },
    {
      label: STEP_LABELS.R_APPROVAL,
      path: `/bkp/${bkpId}/registration-approval`,
    },
    {
      label: STEP_LABELS.WEEKLY_REPORTS,
      path: `/bkp/${bkpId}/weekly-reports`,
    },
    {
      label: STEP_LABELS.FIELD_ASSESSMENT,
      path: `/bkp/${bkpId}/field-assessment`,
    },
    { label: STEP_LABELS.GRADING, path: `/bkp/${bkpId}/grading` },
    { label: STEP_LABELS.COMPLETED, path: `/bkp/${bkpId}/completed` },
  ];

  // Get active step label from store
  const activeStepLabel = $derived(getActiveStep());
</script>

<div class="min-h-screen bg-base-100">
  <div class="container mx-auto px-4 py-8">
    <!-- Breadcrumbs -->
    <Breadcrumbs
      items={[
        {
          label: "Home",
          href: "/",
          icon: "mdi:home-outline",
        },
        {
          label: "My BKP",
          href: "/bkp",
          icon: "mdi:clipboard-text-outline",
        },
        {
          label: bkp ? `${bkp.Proposal.companyName} - ${bkp.Proposal.position}` : "Loading...",
          icon: "mdi:briefcase-outline",
        },
      ]}
    />

    <!-- Progress Steps -->
    <div class="mb-6 rounded-lg bg-base-100 p-4 shadow-lg">
      <ul class="steps steps-horizontal w-full">
        {#each steps as step, i (step.label)}
          <li
            class="step {progressStep >= i ? 'step-primary' : ''} {activeStepLabel === step.label
              ? 'step-active'
              : ''}"
          >
            {#if progressStep > i}
              <span class="step-icon">
                <Icon icon="mdi:check" class="h-4 w-4" />
              </span>
            {/if}
            <a
              href={step.path}
              class="hidden transition-colors hover:text-primary sm:inline {activeStepLabel ===
              step.label
                ? 'font-bold'
                : ''}"
            >
              {step.label}
            </a>
            <a
              href={step.path}
              class="transition-colors hover:text-primary sm:hidden {activeStepLabel === step.label
                ? 'font-bold'
                : ''}"
              aria-label={step.label}
            ></a>
          </li>
        {/each}
      </ul>
    </div>

    <!-- Page Content -->
    {@render children()}
  </div>
</div>
