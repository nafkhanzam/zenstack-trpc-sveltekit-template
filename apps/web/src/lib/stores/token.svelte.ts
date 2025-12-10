import { localStore } from "./local-store.svelte";

export const token = localStore("token", null);
