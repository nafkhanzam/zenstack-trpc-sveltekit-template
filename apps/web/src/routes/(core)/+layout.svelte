<script lang="ts">
  import { resolve } from '$app/paths';
  import { userState } from '$lib/stores/token.svelte';

  let {children} = $props();

  $effect(() => {
    if (userState.tokenInvalid) {
      // console.log(`goto(resolve("/login"));`)
      window.location.href = resolve("/login") + `?redirect=${window.location.toString()}`;
    }
  })
</script>

{@render children()}
