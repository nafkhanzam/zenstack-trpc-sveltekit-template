//? tRPC
import {
  createTRPCClient,
  httpBatchLink,
  httpSubscriptionLink,
  loggerLink,
  splitLink,
} from "@trpc/client";
import SuperJSON from "superjson";
import type { AppRouter } from "../../../server/src/router";
import { env } from "$env/dynamic/public";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    loggerLink({}),
    splitLink({
      // uses the httpSubscriptionLink for subscriptions
      condition: (op) => op.type === "subscription",
      true: httpSubscriptionLink({
        transformer: SuperJSON,
        url: `${env.PUBLIC_BACKEND_URL}/trpc`,
      }),
      false: httpBatchLink({
        transformer: SuperJSON,
        url: `${env.PUBLIC_BACKEND_URL}/trpc`,
      }),
    }),
  ],
});

//? Zenstack V3 RPC
import { useClientQueries } from "@zenstackhq/tanstack-query/svelte";
import { schema } from "../../../server/src/zenstack/schema-lite";

export const client = useClientQueries(schema);
