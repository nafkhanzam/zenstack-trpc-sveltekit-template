import { localStore } from "./local-store.svelte";

export const token = localStore<string | null>("token", null);
