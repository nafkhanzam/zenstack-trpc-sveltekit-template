<script lang="ts">
  import { goto } from "$app/navigation";
  import { client } from "$lib/client.svelte";
  import { user } from "$lib/stores/user.svelte";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Query from "$lib/components/Query.svelte";
  import BKPCard from "../_/bkp/BKPCard.svelte";
  import Alert from "../_/ui/Alert.svelte";
  import Icon from "@iconify/svelte";
  import { BKPStatus } from "$lib/zenstack/models";
  import { resolve } from "$app/paths";

  // Page content
  const pageTitle = "My BKP Submissions";
  const pageDescription = "View and manage your BKP submissions";
  const emptyStateTitle = "No BKP submissions yet";
  const emptyStateMessage = 'Click "Create BKP" to create your first submission.';

  // Breadcrumb configuration
  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
      icon: "heroicons:home",
    },
    {
      label: pageTitle,
      icon: "heroicons:clipboard-document-list",
    },
  ];

  const bkpsQ = client.bKP.useFindMany({
    where: {
      userId: user().id,
    },
    include: {
      User: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const createBkpQ = client.bKP.useCreate();

  let confirmModal: HTMLDialogElement;
  let isCreating = $state(false);

  function openConfirmModal() {
    confirmModal.showModal();
  }

  async function handleCreateBKP() {
    try {
      isCreating = true;
      // Create a new BKP with initial status and selected type
      const newBKP = await $createBkpQ.mutateAsync({
        data: {
          userId: user().id,
          status: BKPStatus.PROPOSAL,
          Proposal: {},
          BKPRegistration: {
            additionalDocuments: [],
          },
          WeeklyReports: {
            WeeklyReportList: [],
          },
          FieldAssessment: {},
          Grading: {
            components: [],
          },
          ProposalApproval: {},
          RegistrationApproval: {},
        },
      });

      // Close modal and redirect to the BKP detail page
      confirmModal.close();
      location.href = resolve(`/bkp/${newBKP.id}`);
    } catch (error) {
      console.error("Failed to create BKP:", error);
      // TODO: Show error message to user
    } finally {
      isCreating = false;
    }
  }
</script>

<div class="min-h-screen bg-base-100">
  <div class="container mx-auto px-4 py-8">
    <Breadcrumbs items={breadcrumbItems} />

    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="mb-2 text-2xl font-bold">{pageTitle}</h1>
      <p class="text-sm text-base-content/70">{pageDescription}</p>
    </div>

    <!-- Add BKP Section -->
    <div class="mb-6 card bg-base-200 shadow-lg">
      <div class="card-body">
        <h2 class="card-title">Create New BKP</h2>
        <div class="flex gap-2">
          <button class="btn btn-primary" onclick={openConfirmModal}>
            <Icon icon="heroicons:plus" class="h-5 w-5" />
            Create BKP
          </button>
          <a href="/bkp-info" class="btn btn-outline">
            <Icon icon="heroicons:information-circle" class="h-5 w-5" />
            BKP Info
          </a>
        </div>
      </div>
    </div>

    <!-- BKP List -->
    <Query q={bkpsQ}>
      {#snippet children(data)}
        {#if data.length > 0}
          <div class="space-y-4">
            {#each data as bkp (bkp.id)}
              <BKPCard
                id={bkp.id}
                companyName={bkp.Proposal.companyName ?? "N/A"}
                position={bkp.Proposal.position ?? "N/A"}
                bkpType={bkp.Proposal.bkpType ?? "N/A"}
                bkpCategory="BKP"
                status={bkp.status}
                submittedDate={bkp.Proposal.submittedAt
                  ? new Date(bkp.Proposal.submittedAt).toISOString().split("T")[0]
                  : undefined}
                periode={bkp.Proposal.period ?? "N/A"}
                weeklyReportsSubmitted={bkp.WeeklyReports?.WeeklyReportList?.length ?? 0}
                totalWeeklyReports={bkp.Proposal.monthDuration ?? 0}
                isGraded={bkp.Grading.components.length ? true : false}
              />
            {/each}
          </div>
        {:else}
          <Alert type="info">
            <div>
              <h3 class="font-bold">{emptyStateTitle}</h3>
              <p class="text-sm">{emptyStateMessage}</p>
            </div>
          </Alert>
        {/if}
      {/snippet}
    </Query>

    <!-- Confirmation Modal -->
    <dialog bind:this={confirmModal} class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">✕</button>
        </form>
        <h3 class="mb-4 text-lg font-bold">Create New BKP?</h3>
        <p class="mb-4">
          Are you sure you want to create a new BKP submission? You will be redirected to the BKP
          detail page to fill in the proposal information.
        </p>

        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-ghost">Cancel</button>
          </form>
          <button class="btn btn-primary" onclick={handleCreateBKP} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create BKP"}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</div>
