<script lang="ts">
  import Query from "$lib/components/Query.svelte";
  import { token } from "$lib/stores/token.svelte";
  import { client } from "$lib/client.svelte";

  const q = client.user.useFindMany({});
</script>

<p>Current token: {token.value}</p>
<input type="text" bind:value={token.value} />

<Query {q}>
  {#snippet children(data)}
    {data}
  {/snippet}
</Query>
