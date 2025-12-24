<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Query from "$lib/components/Query.svelte";
  import Alert from "../../../_/ui/Alert.svelte";
  import Icon from "@iconify/svelte";
  import { client } from "$lib/client.svelte";
  import { BKPStatus, BKPType, type BKP } from "$lib/zenstack/models";
  import Svelecte from "svelecte";
  import { toast, type ResultType } from "$lib";
    import type { CreateQueryResult } from "@tanstack/svelte-query";

  // Page content
  const pageTitle = "BKP Management";
  const pageDescription = "Manage all BKP submissions across the system";
  const searchPlaceholder = "Search by company, position, or student name...";
  const searchLabel = "Search BKPs";
  const filterStatusLabel = "Filter by Status";
  const filterTypeLabel = "Filter by Type";
  const filterIcon = "heroicons:funnel";
  const searchIcon = "heroicons:magnifying-glass";
  const infoIcon = "heroicons:information-circle";

  // Breadcrumb configuration
  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
      icon: "heroicons:home",
    },
    {
      label: "Admin",
      href: "/admin",
      icon: "heroicons:shield-check",
    },
    {
      label: pageTitle,
      icon: "heroicons:clipboard-document-list",
    },
  ];

  // Status filter options
  const statusFilterOptions = [
    { value: "all", label: "All Statuses" },
    { value: BKPStatus.PROPOSAL, label: "Proposal" },
    { value: BKPStatus.WAITING_PROPOSAL_APPROVAL, label: "Waiting Proposal Approval" },
    { value: BKPStatus.REGISTRATION, label: "Registration" },
    { value: BKPStatus.WAITING_REGISTRATION_APPROVAL, label: "Waiting Registration Approval" },
    { value: BKPStatus.WEEKLY_REPORTING, label: "Weekly Reporting" },
    { value: BKPStatus.UPLOADING_FIELD_ASSESSMENT, label: "Uploading Field Assessment" },
    { value: BKPStatus.GRADING, label: "Grading" },
    { value: BKPStatus.COMPLETED, label: "Completed" },
    { value: BKPStatus.DELETED, label: "Deleted" },
  ];

  // BKP Type filter options
  const typeFilterOptions = [
    { value: "all", label: "All Types" },
    { value: BKPType.MAGANG_BERDAMPAK, label: "Magang Berdampak" },
    { value: BKPType.MAGANG_MAGENTA, label: "Magang Magenta" },
    { value: BKPType.MAGANG_KERJASAMA, label: "Magang Kerjasama" },
    { value: BKPType.MAGANG_MANDIRI, label: "Magang Mandiri" },
    { value: BKPType.INDEPENDENT_STUDY, label: "Independent Study" },
    { value: BKPType.LOMBA, label: "Lomba" },
    { value: BKPType.PROYEK, label: "Proyek" },
    { value: BKPType.WIRAUSAHA, label: "Wirausaha" },
    { value: BKPType.MAGANG_INTERNAL, label: "Magang Internal" },
    { value: BKPType.KERJA_PRAKTIK, label: "Kerja Praktik" },
  ];

  // Fetch all BKPs with user information
  const bkpsQ = client.bKP.useFindMany({
    include: {
      User: true,
      Grading__User: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch all users for grader selection
  const usersQ = client.user.useFindMany({
    orderBy: {
      name: "asc",
    },
  });

  // Mutation for updating grader
  const updateBKPMutation = client.bKP.useUpdate();

  let searchQuery = $state("");
  let filterStatus = $state<string>("all");
  let filterType = $state<string>("all");

  function filterBKPs(bkps: ResultType<typeof bkpsQ>) {
    return bkps.filter((bkp) => {
      // Search filter
      const companyName = bkp.Proposal.companyName?.toLowerCase() || "";
      const position = bkp.Proposal.position?.toLowerCase() || "";
      const userName = bkp.Grading__User?.name?.toLowerCase() || "";
      const userUsername = bkp.Grading__User?.username?.toLowerCase() || "";
      const searchLower = searchQuery.toLowerCase();

      const matchesSearch =
        companyName.includes(searchLower) ||
        position.includes(searchLower) ||
        userName.includes(searchLower) ||
        userUsername.includes(searchLower);

      // Status filter
      const matchesStatus = filterStatus === "all" || bkp.status === filterStatus;

      // Type filter
      const matchesType =
        filterType === "all" || bkp.Proposal.bkpType === filterType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }

  function getStatusCount(bkps: any[], status: BKPStatus) {
    return bkps.filter((bkp) => bkp.status === status).length;
  }

  function getStatusLabel(status: BKPStatus): string {
    switch (status) {
      case BKPStatus.PROPOSAL:
        return "Proposal";
      case BKPStatus.WAITING_PROPOSAL_APPROVAL:
        return "Pending Approval";
      case BKPStatus.REGISTRATION:
        return "Registration";
      case BKPStatus.WAITING_REGISTRATION_APPROVAL:
        return "Pending Reg. Approval";
      case BKPStatus.WEEKLY_REPORTING:
        return "Weekly Reporting";
      case BKPStatus.UPLOADING_FIELD_ASSESSMENT:
        return "Field Assessment";
      case BKPStatus.GRADING:
        return "Grading";
      case BKPStatus.COMPLETED:
        return "Completed";
      case BKPStatus.DELETED:
        return "Deleted";
      default:
        return "Unknown";
    }
  }

  function getStatusBadgeClass(status: BKPStatus): string {
    switch (status) {
      case BKPStatus.PROPOSAL:
        return "badge-ghost";
      case BKPStatus.WAITING_PROPOSAL_APPROVAL:
      case BKPStatus.WAITING_REGISTRATION_APPROVAL:
        return "badge-info";
      case BKPStatus.REGISTRATION:
      case BKPStatus.WEEKLY_REPORTING:
      case BKPStatus.UPLOADING_FIELD_ASSESSMENT:
        return "badge-warning";
      case BKPStatus.GRADING:
        return "badge-secondary";
      case BKPStatus.COMPLETED:
        return "badge-success";
      case BKPStatus.DELETED:
        return "badge-error";
      default:
        return "badge-ghost";
    }
  }

  function formatDate(date: Date | string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  let graderAssignments = $state<Record<string, string | null>>({});

  async function updateGrader(bkpId: string, userId: string | null) {
    try {
      await $updateBKPMutation.mutateAsync({
        where: { id: bkpId },
        data: {
          Grading__UserId: userId,
        },
      });
      toast.success("Grader updated successfully");
    } catch (error) {
      console.error("Failed to update grader:", error);
      toast.error("Failed to update grader");
    }
  }

  function handleGraderChange(bkpId: string) {
    updateGrader(bkpId, graderAssignments[bkpId]);
  }
</script>

<Query q={usersQ}>
  {#snippet children(users)}
    {@const userOptions = users.map((u) => ({
      value: u.id,
      label: `${u.name} (${u.username})`,
    }))}

    <Query q={bkpsQ}>
      {#snippet children(bkps)}
        {@const filteredBKPs = filterBKPs(bkps)}

        <div class="min-h-screen bg-base-100">
          <div class="container mx-auto px-4 py-8">
            <Breadcrumbs items={breadcrumbItems} />

            <!-- Page Header -->
            <div class="mb-8">
              <h1 class="mb-2 text-2xl font-bold">{pageTitle}</h1>
              <p class="text-sm text-base-content/70">{pageDescription}</p>
            </div>

            <!-- Statistics Cards -->
            <div class="mb-8 grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
              <div class="stat bg-base-200 rounded-lg shadow">
                <div class="stat-title">Total BKPs</div>
                <div class="stat-value text-primary">{bkps.length}</div>
              </div>
              <div class="stat bg-base-200 rounded-lg shadow">
                <div class="stat-title">Pending Approval</div>
                <div class="stat-value text-warning">
                  {getStatusCount(bkps, BKPStatus.WAITING_PROPOSAL_APPROVAL) +
                    getStatusCount(bkps, BKPStatus.WAITING_REGISTRATION_APPROVAL)}
                </div>
              </div>
              <div class="stat bg-base-200 rounded-lg shadow">
                <div class="stat-title">In Progress</div>
                <div class="stat-value text-info">
                  {getStatusCount(bkps, BKPStatus.WEEKLY_REPORTING) +
                    getStatusCount(bkps, BKPStatus.UPLOADING_FIELD_ASSESSMENT)}
                </div>
              </div>
              <div class="stat bg-base-200 rounded-lg shadow">
                <div class="stat-title">Grading</div>
                <div class="stat-value text-secondary">
                  {getStatusCount(bkps, BKPStatus.GRADING)}
                </div>
              </div>
              <div class="stat bg-base-200 rounded-lg shadow">
                <div class="stat-title">Completed</div>
                <div class="stat-value text-success">
                  {getStatusCount(bkps, BKPStatus.COMPLETED)}
                </div>
              </div>
            </div>

            <!-- Filters -->
            <div class="card mb-8 bg-base-100 shadow-xl">
              <div class="card-body">
                <h2 class="mb-4 card-title">
                  <Icon icon={filterIcon} class="h-6 w-6" />
                  Search & Filter
                </h2>

                <div class="grid gap-4 md:grid-cols-3">
                  <div class="form-control">
                    <label class="label" for="search">
                      <span class="label-text font-semibold">{searchLabel}</span>
                    </label>
                    <label class="input-bordered input flex items-center gap-2">
                      <Icon icon={searchIcon} class="h-5 w-5 opacity-70" />
                      <input
                        id="search"
                        type="text"
                        placeholder={searchPlaceholder}
                        class="grow"
                        bind:value={searchQuery}
                      />
                    </label>
                  </div>

                  <div class="form-control">
                    <label class="label" for="status-filter">
                      <span class="label-text font-semibold">{filterStatusLabel}</span>
                    </label>
                    <select
                      id="status-filter"
                      class="select-bordered select w-full"
                      bind:value={filterStatus}
                    >
                      {#each statusFilterOptions as option (option.value)}
                        <option value={option.value}>{option.label}</option>
                      {/each}
                    </select>
                  </div>

                  <div class="form-control">
                    <label class="label" for="type-filter">
                      <span class="label-text font-semibold">{filterTypeLabel}</span>
                    </label>
                    <select
                      id="type-filter"
                      class="select-bordered select w-full"
                      bind:value={filterType}
                    >
                      {#each typeFilterOptions as option (option.value)}
                        <option value={option.value}>{option.label}</option>
                      {/each}
                    </select>
                  </div>
                </div>

                <!-- Results count -->
                <div class="mt-4">
                  <div class="alert">
                    <Icon icon={infoIcon} class="h-6 w-6 shrink-0" />
                    <span>
                      Showing <strong>{filteredBKPs.length}</strong> of
                      <strong>{bkps.length}</strong>
                      BKP submissions
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- BKP List -->
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <h2 class="card-title mb-4">
                  <Icon icon="heroicons:clipboard-document-list" class="h-6 w-6" />
                  BKP Submissions
                </h2>

                {#if filteredBKPs.length > 0}
                  <div class="overflow-x-auto">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Company</th>
                          <th>Position</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Grader</th>
                          <th>Period</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each filteredBKPs as bkp (bkp.id)}
                          <tr class="hover">
                            <td>
                              <div class="flex flex-col">
                                <span class="font-medium">{bkp.User.name}</span>
                                <span class="text-xs opacity-70">{bkp.User.username}</span>
                              </div>
                            </td>
                            <td>{bkp.Proposal.companyName ?? "N/A"}</td>
                            <td>{bkp.Proposal.position ?? "N/A"}</td>
                            <td>
                              <span class="badge badge-outline badge-sm">
                                {bkp.Proposal.bkpType ?? "N/A"}
                              </span>
                            </td>
                            <td>
                              <span class="badge badge-sm {getStatusBadgeClass(bkp.status)}">
                                {getStatusLabel(bkp.status)}
                              </span>
                            </td>
                            <td>
                              <div class="w-48">
                                <Svelecte
                                  options={userOptions}
                                  bind:value={graderAssignments[bkp.id]}
                                  placeholder="Select grader..."
                                  searchable
                                  clearable
                                  class="svelecte-control-sm"
                                  onChange={() => handleGraderChange(bkp.id)}
                                />
                              </div>
                            </td>
                            <td class="text-sm">{bkp.Proposal.period ?? "N/A"}</td>
                            <td class="text-sm opacity-70">{formatDate(bkp.createdAt)}</td>
                            <td>
                              <a href="/bkp/{bkp.id}" class="btn btn-ghost btn-xs">
                                <Icon icon="heroicons:eye" class="h-4 w-4" />
                                View
                              </a>
                            </td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                {:else}
                  <Alert type="info">
                    <div>
                      <h3 class="font-bold">No BKP submissions found</h3>
                      <p class="text-sm">Try adjusting your search or filter criteria.</p>
                    </div>
                  </Alert>
                {/if}
              </div>
            </div>
          </div>
        </div>
      {/snippet}
    </Query>
  {/snippet}
</Query>

<style>
  :global(.svelecte-control-sm) {
    font-size: 0.875rem;
  }
  :global(.svelecte-control-sm .sv-control) {
    min-height: 2rem;
  }
</style>
