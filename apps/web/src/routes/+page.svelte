<script lang="ts">
  import { token } from "$lib/stores/token.svelte";

</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<p>Current token: {token.value}</p>
<input type="text" bind:value={token.value} />
