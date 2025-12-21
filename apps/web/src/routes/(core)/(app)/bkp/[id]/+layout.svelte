<script lang="ts">
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Icon from "@iconify/svelte";
  import type { ResolvedPathname } from "$app/types";
  import { getActiveStep, STEP_LABELS, type StepLabel } from "./bkp-step.svelte";

  interface Props {
    children: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  // In a real app, this would come from the load function with actual BKP data
  // For now, using mock data based on the id
  const bkpId = page.params.id!;

  // Mock BKP data - in real app, this would come from +layout.ts or +layout.server.ts
  const mockBkp = $derived({
    id: bkpId,
    status: "approved",
    isGraded: false,
  });

  function getProgressStep(bkp: typeof mockBkp): number {
    if (bkp.status === "draft") return 0;
    if (bkp.status === "submitted") return 1;
    if (bkp.status === "rejected") return 1;
    if (bkp.status === "approved") {
      if (bkp.isGraded) return 6;
      return 4;
    }
    return 0;
  }

  const progressStep = $derived(getProgressStep(mockBkp));

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
          label: mockBkp.id,
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
              href={resolve(step.path)}
              class="hidden transition-colors hover:text-primary sm:inline {activeStepLabel === step.label
                ? 'font-bold'
                : ''}"
            >
              {step.label}
            </a>
            <a
              href={resolve(step.path)}
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
