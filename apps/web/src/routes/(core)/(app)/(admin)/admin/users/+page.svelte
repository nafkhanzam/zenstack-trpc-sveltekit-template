<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Query from "$lib/components/Query.svelte";
  import Alert from "../../../_/ui/Alert.svelte";
  import Icon from "@iconify/svelte";
  import { client } from "$lib/client.svelte";

  // Page content
  const pageTitle = "User Management";
  const pageDescription = "Manage system users and their roles";
  const searchPlaceholder = "Search by username or name...";
  const searchLabel = "Search Users";
  const filterLabel = "Filter by Role";
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
      icon: "heroicons:users",
    },
  ];

  // Filter options
  const filterOptions = [
    { value: "all", label: "All Roles" },
    { value: "SUPERADMIN", label: "Super Admin" },
    { value: "ADMIN", label: "Admin" },
    { value: "USER", label: "User" },
  ];

  // Fetch users from API
  const usersQ = client.user.useFindMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  let searchQuery = $state("");
  let filterRole = $state<string>("all");

  function filterUsers(users: any[]) {
    return users.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === "all" || user.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }

  function getRoleBadgeClass(role: string) {
    switch (role) {
      case "SUPERADMIN":
        return "badge-error";
      case "ADMIN":
        return "badge-warning";
      case "USER":
        return "badge-primary";
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
</script>

<Query q={usersQ}>
  {#snippet children(users)}
    {@const filteredUsers = filterUsers(users)}

    <div class="min-h-screen bg-base-100">
      <div class="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="mb-2 text-2xl font-bold">{pageTitle}</h1>
          <p class="text-sm text-base-content/70">{pageDescription}</p>
        </div>

        <!-- Filters -->
        <div class="card mb-8 bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="mb-4 card-title">
              <Icon icon={filterIcon} class="h-6 w-6" />
              Search & Filter
            </h2>

            <div class="grid gap-4 md:grid-cols-2">
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
                <label class="label" for="filter">
                  <span class="label-text font-semibold">{filterLabel}</span>
                </label>
                <select id="filter" class="select-bordered select w-full" bind:value={filterRole}>
                  {#each filterOptions as option (option.value)}
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
                  Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong>
                  users
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- User List -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title mb-4">
              <Icon icon="heroicons:users" class="h-6 w-6" />
              Users
            </h2>

            {#if filteredUsers.length > 0}
              <div class="overflow-x-auto">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each filteredUsers as user (user.id)}
                      <tr class="hover">
                        <td>
                          <div class="flex items-center gap-2">
                            <Icon icon="heroicons:user-circle" class="h-5 w-5 opacity-70" />
                            <span class="font-medium">{user.username}</span>
                          </div>
                        </td>
                        <td>{user.name}</td>
                        <td>
                          <span class="badge {getRoleBadgeClass(user.role)}">
                            {user.role}
                          </span>
                        </td>
                        <td class="text-sm opacity-70">{formatDate(user.createdAt)}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {:else}
              <Alert type="info">
                <div>
                  <h3 class="font-bold">No users found</h3>
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
