<script lang="ts">
  import Icon from "@iconify/svelte";

  interface Props {
    label: string;
    href: string;
    icon: string;
    style: string;
  }

  let { label, href, icon, style }: Props = $props();
</script>

<a
  {href}
  class="card bg-base-100 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
>
  <div class="card-body items-center text-center">
    <div class="rounded-full p-4 {style}">
      <Icon {icon} class="h-8 w-8" />
    </div>
    <h3 class="card-title text-base">{label}</h3>
  </div>
</a>
