//? tRPC
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../server/src/router";
import { env } from "$env/dynamic/public";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${env.PUBLIC_BACKEND_URL}/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          // credentials: "include",
        });
      },
    }),
  ],
});

//? Zenstack V3 RPC
import { useClientQueries } from "@zenstackhq/tanstack-query/svelte";
import { schema } from "./zenstack/schema-lite";

export const client = useClientQueries(schema);
