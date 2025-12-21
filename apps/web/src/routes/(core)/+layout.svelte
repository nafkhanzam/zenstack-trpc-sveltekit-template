<script lang="ts">
  import { resolve } from '$app/paths';
  import { userState } from '$lib/stores/token.svelte';
  import Footer from "./_/Footer.svelte";
  import Navbar from './_/Navbar.svelte';

  let {children} = $props();

  $effect(() => {
    if (userState.tokenInvalid) {
      // console.log(`goto(resolve("/login"));`)
      window.location.href = resolve("/login") + `?redirect=${window.location.toString()}`;
    }
  })
</script>

<Navbar />

<main class="min-h-screen">
  {@render children()}
</main>

<Footer />
