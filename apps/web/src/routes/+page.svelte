<script lang="ts">
  import { client, trpc } from "$lib/client.svelte";
  import Query from "$lib/components/Query.svelte";
  import { refresh, token } from "$lib/stores/token.svelte";
  import { createQuery } from "@tanstack/svelte-query";

  const trpcQuery = createQuery({
    queryKey: [],
    queryFn: async () => trpc.me.query(),
  });

  const zenstackQuery = client.user.useFindUnique({
    where: {
      id: "123"
    }
  });

  const onRegisterClick = async () => {
    const res = await trpc.register.mutate({
      name: `Dummy Name`,
      username: "dummy",
      password: "dummy",
    });
    token.value = res.accessToken;
    refresh.value = res.refreshToken;
  }

  const onLoginClick = async () => {
    const res = await trpc.login.mutate({
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
    {JSON.stringify(data)}
  {/snippet}
</Query>

<Query q={zenstackQuery}>
  {#snippet children(data)}
    {JSON.stringify(data)}
  {/snippet}
</Query>

<button class="btn btn-success" onclick={() => onRegisterClick()}>Register!</button>
<button class="btn btn-primary" onclick={() => onLoginClick()}>Login!</button>
