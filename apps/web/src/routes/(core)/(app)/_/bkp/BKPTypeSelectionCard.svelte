<script lang="ts">
  import Icon from "@iconify/svelte";
  import { resolve } from "$app/paths";

  interface Props {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    onSelect?: (id: string) => void;
    detailsHref?: string;
  }

  let { id, name, description, icon, color, onSelect, detailsHref }: Props = $props();

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    onSelect?.(id);
  }
</script>

<div
  class="card bg-base-100 text-left shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
>
  <div class="card-body p-4">
    <div class="mb-3 flex items-center gap-3">
      <div class="rounded-lg bg-linear-to-br p-3 {color}">
        <Icon {icon} class="h-6 w-6 text-white" />
      </div>
      <h3 class="card-title text-base">{name}</h3>
    </div>
    <p class="mb-4 text-sm text-base-content/70">{description}</p>
    <div class="card-actions justify-end">
      {#if detailsHref}
        <a href={resolve(detailsHref)} class="btn btn-sm btn-ghost">
          Details
          <Icon icon="heroicons:information-circle" class="h-4 w-4" />
        </a>
      {/if}
      <button onclick={handleClick} class="btn btn-sm btn-primary">
        Select
        <Icon icon="heroicons:arrow-right" class="h-4 w-4" />
      </button>
    </div>
  </div>
</div>
