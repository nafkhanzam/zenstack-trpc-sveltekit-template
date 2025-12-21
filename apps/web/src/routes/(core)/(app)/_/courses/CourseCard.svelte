<script lang="ts">
  import Icon from "@iconify/svelte";

  interface Course {
    id: string;
    code: string;
    name: string;
    type: "REQUIRED" | "ELECTIVE";
    sks: number;
    cloList: string[];
    Major: {
      id: string;
      name: string;
    };
  }

  interface Props {
    course: Course;
  }

  let { course }: Props = $props();

  function getTypeConfig(type: Course["type"]) {
    const configs = {
      REQUIRED: {
        badge: "badge-primary",
        color: "bg-primary",
        icon: "heroicons:academic-cap",
        label: "Required (Wajib)",
      },
      ELECTIVE: {
        badge: "badge-secondary",
        color: "bg-secondary",
        icon: "heroicons:cog-6-tooth",
        label: "Elective (Pilihan)",
      },
    };
    return configs[type];
  }

  const typeConfig = $derived(getTypeConfig(course.type));
</script>

<div
  class="card bg-base-100 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
>
  <div class="card-body p-4 sm:p-6">
    <!-- Header -->
    <div class="mb-2 flex flex-wrap items-start justify-between gap-3">
      <div class="flex-1">
        <div class="mb-2 flex items-start gap-2">
          <div class="rounded-lg p-2 {typeConfig.color} text-base-100">
            <Icon icon={typeConfig.icon} class="h-5 w-5" />
          </div>
          <div class="flex-1">
            <h2 class="mb-1 card-title text-base">
              {course.name}
            </h2>
            <div class="flex flex-wrap gap-1.5">
              <span class="badge {typeConfig.badge} gap-1 badge-sm">
                {typeConfig.label}
              </span>
              <span class="badge badge-outline badge-sm">
                <Icon icon="heroicons:hashtag" class="mr-1 h-4 w-4" />
                {course.code}
              </span>
            </div>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="grid gap-2 sm:grid-cols-3">
          <div class="flex items-center gap-2">
            <div class="rounded bg-base-200 p-1.5">
              <Icon icon="heroicons:academic-cap" class="h-4 w-4" />
            </div>
            <div class="text-sm">
              <div class="text-xs text-base-content/70">Major</div>
              <div class="font-semibold">{course.Major.name}</div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <div class="rounded bg-base-200 p-1.5">
              <Icon icon="heroicons:clock" class="h-4 w-4" />
            </div>
            <div class="text-sm">
              <div class="text-xs text-base-content/70">Credits</div>
              <div class="font-semibold">{course.sks} SKS</div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <div class="rounded bg-base-200 p-1.5">
              <Icon icon="heroicons:check-circle" class="h-4 w-4" />
            </div>
            <div class="text-sm">
              <div class="text-xs text-base-content/70">Outcomes</div>
              <div class="font-semibold">{course.cloList.length} CLO</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CLO Section -->
    {#if course.cloList.length > 0}
      <div class="collapse-arrow collapse bg-base-200 mt-2">
        <input type="checkbox" name="clo-{course.id}" />
        <div class="collapse-title min-h-0 py-2 text-sm font-semibold">
          <div class="flex items-center gap-2">
            <Icon icon="heroicons:clipboard-document-check" class="h-4 w-4" />
            Course Learning Outcomes (CLO)
          </div>
        </div>
        <div class="collapse-content">
          <ul class="mt-2 space-y-2 text-sm">
            {#each course.cloList as cloItem, idx (idx)}
              <li class="flex gap-2">
                <div
                  class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success text-xs font-bold text-success-content"
                >
                  {idx + 1}
                </div>
                <span>{cloItem}</span>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    {/if}
  </div>
</div>
