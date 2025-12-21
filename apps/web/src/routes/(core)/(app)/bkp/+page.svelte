<script lang="ts">
  import { resolve } from "$app/paths";
  import { client } from "$lib/client.svelte";
  import { user } from "$lib/stores/user.svelte";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Query from "$lib/components/Query.svelte";
  import BKPCard from "../_/bkp/BKPCard.svelte";
  import Alert from "../_/ui/Alert.svelte";
  import Icon from "@iconify/svelte";

  interface BKP {
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

  // Page content
  const pageTitle = "My BKP Submissions";
  const pageDescription = "View and manage your BKP submissions";
  const addButtonText = "Add New BKP";
  const addButtonIcon = "heroicons:plus";
  const emptyStateTitle = "No BKP submissions yet";
  const emptyStateMessage = 'Click "Add New BKP" to create your first submission.';

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
</script>

<div class="min-h-screen bg-base-100">
  <div class="container mx-auto px-4 py-8">
    <Breadcrumbs items={breadcrumbItems} />

    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="mb-2 text-2xl font-bold">{pageTitle}</h1>
      <p class="text-sm text-base-content/70">{pageDescription}</p>
    </div>

    <!-- Add BKP Button -->
    <div class="mb-6">
      <a href={resolve(`/new-bkp`)} class="btn btn-primary">
        <Icon icon={addButtonIcon} class="h-5 w-5" />
        {addButtonText}
      </a>
    </div>

    <!-- BKP List -->
    <Query q={bkpsQ}>
      {#snippet children(data)}
        {#if data.length > 0}
          <div class="space-y-4">
            {#each data as bkp (bkp.id)}
              <BKPCard
                id={bkp.id}
                companyName={bkp.Proposal?.companyName ?? "N/A"}
                position={bkp.Proposal?.position ?? "N/A"}
                bkpType={bkp.Proposal?.bkpType ?? "N/A"}
                bkpCategory="BKP"
                status={bkp.status.toLowerCase() as "draft" | "submitted" | "approved" | "rejected"}
                submittedDate={bkp.Proposal?.submittedAt
                  ? new Date(bkp.Proposal.submittedAt).toISOString().split("T")[0]
                  : undefined}
                periode={bkp.Proposal?.period ?? "N/A"}
                weeklyReportsSubmitted={bkp.WeeklyReports?.WeeklyReportList?.length ?? 0}
                totalWeeklyReports={bkp.Proposal?.monthDuration ?? 0}
                isGraded={bkp.Grading?.components?.length ? true : false}
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
  </div>
</div>
