<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { env } from "$env/dynamic/public";
  import { toast } from "$lib";
  import favicon from "$lib/assets/favicon.svg";
  import { trpc } from "$lib/client.svelte";
  import { refresh, token, user } from "$lib/stores/token.svelte";
  import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import { setQuerySettingsContext } from '@zenstackhq/tanstack-query/svelte';
  import { Toaster } from "svelte-french-toast";
  import "./layout.css";
    import { myFetch } from "$lib/my-fetch.svelte";

  let { children } = $props();

  $effect(() => {
    (async () => {
      const jwtToken = token.value;
      if (!jwtToken) {
        user.data = null;
      }
      const me = await trpc.me.query();
      user.data = me;
    })()
  });

  setQuerySettingsContext({
      endpoint: `${env.PUBLIC_BACKEND_URL}/api/model`,
      fetch: myFetch,
      logging: env.PUBLIC_ENVIRONMENT !== "production",
  });

  const queryClient = new QueryClient({
    queryCache: new QueryCache({}),
    mutationCache: new MutationCache({}),
    defaultOptions: {
      queries: {
        enabled: browser,
        throwOnError: true,
        retry: false,
        // refetchOnMount: "always",
        // refetchOnReconnect: true,
      },
      mutations: {
        throwOnError: true,
        onError(error) {
          toast.error(`${error.message}`);
          return true;
        },
        retry: false,
      },
    },
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>NZExam</title>
</svelte:head>

<QueryClientProvider client={queryClient}>
  {@render children()}
  <Toaster />
  <SvelteQueryDevtools />
</QueryClientProvider>
