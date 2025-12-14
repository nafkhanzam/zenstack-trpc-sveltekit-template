import type { JWTPayload } from "$lib/shared/jwt";
import { localStore } from "./store.svelte";

export const token = localStore<string | null>("token", null);
export const refresh = localStore<string | null>("refresh", null);
export const user = $state<{ data: JWTPayload | null }>({
  data: null,
});
