import type { JWTPayload } from "$lib/shared/jwt";
import { userState } from "./token.svelte";

export const user = () => userState.data as JWTPayload;
