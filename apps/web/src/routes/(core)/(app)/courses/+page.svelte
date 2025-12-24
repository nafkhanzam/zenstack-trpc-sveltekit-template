<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Icon from "@iconify/svelte";
  import { Alert } from "../_/ui";
  import { CourseCard } from "../_/courses";
  import { client } from "$lib/client.svelte";
  import Query from "$lib/components/Query.svelte";
    import type { Course } from "$lib/zenstack/models";
    import type { ResultType } from "$lib";

  // Page content
  const pageTitle = "Course Catalog";
  const pageDescription = "Browse available courses for BKP conversion";
  const searchPlaceholder = "Search courses...";
  const searchLabel = "Search by Code or Name";
  const filterLabel = "Filter by Type";
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
      label: pageTitle,
      icon: "heroicons:book-open",
    },
  ];

  // Filter options
  const filterOptions = [
    { value: "all", label: "All Courses" },
    { value: "REQUIRED", label: "Required (Wajib)" },
    { value: "ELECTIVE", label: "Elective (Pilihan)" },
  ];

  // Fetch courses from API
  const coursesQ = client.course.useFindMany({
    include: {
      Major: true,
    },
    orderBy: {
      code: "asc",
    },
  });

  let searchQuery = $state("");
  let filterType = $state<string>("all");

  function filterCourses(courses: ResultType<typeof coursesQ>) {
    return courses.filter((course) => {
      const matchesSearch =
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || course.type === filterType;
      return matchesSearch && matchesType;
    });
  }
</script>

<Query q={coursesQ}>
  {#snippet children(courses)}
    {@const filteredCourses = filterCourses(courses)}

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
                <select id="filter" class="select-bordered select w-full" bind:value={filterType}>
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
                  Showing <strong>{filteredCourses.length}</strong> of
                  <strong>{courses.length}</strong>
                  courses
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Course list -->
        <div class="space-y-4">
          {#each filteredCourses as course (course.id)}
            <CourseCard {course} />
          {:else}
            <Alert type="warning" message="No courses found matching your criteria." />
          {/each}
        </div>
      </div>
    </div>
  {/snippet}
</Query>
