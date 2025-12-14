<script lang="ts">
  import { client, trpc } from "$lib/client.svelte";
  import Query from "$lib/components/Query.svelte";
  import { refresh, token } from "$lib/stores/token.svelte";
  import { createQuery } from "@tanstack/svelte-query";

  const trpcQuery = createQuery({
    queryKey: [],
    queryFn: async () => trpc.hello.query("Nafkhan"),
  });

  const zenstackQuery = client.user.useFindMany();
</script>

<p>accessToken: {token.value}</p>
<p>refreshToken: {refresh.value}</p>
<input type="text" bind:value={token.value} />

<Query q={trpcQuery}>
  {#snippet children(data)}
    {data}
  {/snippet}
</Query>

<Query q={zenstackQuery}>
  {#snippet children(data)}
    {JSON.stringify(data)}
  {/snippet}
</Query>
