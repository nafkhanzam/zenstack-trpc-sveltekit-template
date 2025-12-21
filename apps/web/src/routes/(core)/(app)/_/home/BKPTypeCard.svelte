<script lang="ts">
  import Icon from "@iconify/svelte";

  interface Props {
    title: string;
    description: string;
    icon: string;
    color: string;
    items: string[];
  }

  let { title, description, icon, color, items }: Props = $props();
</script>

<div
  class="card bg-base-100 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
>
  <div class="card-body">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="card-title text-base">{title}</h3>
      <div class="rounded-lg p-3 {color} text-base-100">
        <Icon {icon} class="h-6 w-6" />
      </div>
    </div>
    <p class="mb-4 text-sm text-base-content/70">{description}</p>
    {#if items.length > 0}
      <ul class="space-y-2">
        {#each items as item (item)}
          <li class="flex items-start gap-2">
            <Icon
              icon="heroicons:check-circle"
              class="mt-0.5 h-5 w-5 shrink-0 text-success"
            />
            <span>{item}</span>
          </li>
        {/each}
      </ul>
    {:else}
      <div class="rounded-lg bg-base-200 p-4 text-center">
        <p class="text-base-content/70">Professional practical work experience program</p>
      </div>
    {/if}
  </div>
</div>
