<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { setQuerySettingsContext, type FetchFn } from '@zenstackhq/tanstack-query/svelte';
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import { browser } from "$app/environment";
  import { toast } from "$lib";
  import { Toaster } from "svelte-french-toast";

  let { children } = $props();

    // custom fetch function that adds a custom header
    const myFetch: FetchFn = (url, options) => {
        options = options ?? {};
        options.headers = {
            ...options.headers,
            'x-my-custom-header': 'hello world',
        };
        return fetch(url, options);
    };

    setQuerySettingsContext({
        endpoint: '/api/model',
        fetch: myFetch,
    });

  const queryClient = new QueryClient({
    // queryCache: new QueryCache({}),
    // mutationCache: new MutationCache({}),
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
</svelte:head>

<QueryClientProvider client={queryClient}>
  {@render children()}
  <Toaster />
  <SvelteQueryDevtools />
</QueryClientProvider>
