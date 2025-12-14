<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { setQuerySettingsContext, type FetchFn } from '@zenstackhq/tanstack-query/svelte';
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import { browser } from "$app/environment";
  import { toast } from "$lib";
  import { Toaster } from "svelte-french-toast";
  import { env } from "$env/dynamic/public";
  import { refresh, token } from "$lib/stores/token.svelte";
  import { trpc } from "$lib/client.svelte";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";

  let { children } = $props();

  // custom fetch function that adds a custom header
  const myFetch = async (url: string, options?: RequestInit, refreshed = false): Promise<Response> => {
      options = options ?? {};
      options.headers = {
          ...options.headers,
      };
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: token.value,
        };
      }
      const res = await fetch(url, options);
      if (res.status === 401 && !refreshed) {
        function getLoginError() {
            token.value = null;
            refresh.value = null;
            // TODO: Change to login.
            goto(resolve("/"));
            return new Error(`Token expired.`);

        }
        try {
          if (!refresh.value) {
            throw getLoginError();
          }
          const {accessToken, refreshToken} = await trpc.refresh.mutate({
            refreshToken: refresh.value,
          });
          token.value = accessToken;
          refresh.value = refreshToken;

          // Retry original request with new token
          return myFetch(url, options, true);
        } catch (error) {
          throw getLoginError();
        }
      }
      return res;
  };

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
