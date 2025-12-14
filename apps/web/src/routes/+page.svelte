<script lang="ts">
  import { client, trpc } from "$lib/client.svelte";
  import Query from "$lib/components/Query.svelte";
  import { refresh, token } from "$lib/stores/token.svelte";
  import { createQuery } from "@tanstack/svelte-query";

  const trpcQuery = createQuery({
    queryKey: [],
    queryFn: async () => trpc.me.query(),
  });

  const zenstackQuery = client.user.useFindMany();

  const onBtnClick = async () => {
    const res = await trpc.register.mutate({
      name: `Dummy Name`,
      username: "dummy",
      password: "dummy",
    });
    token.value = res.accessToken;
    refresh.value = res.refreshToken;
  }
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

<button class="btn btn-success" onclick={() => onBtnClick()}>Register!</button>
