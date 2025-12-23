import type { JWTPayload } from "$lib/shared/jwt";
import { userState } from "./token.svelte";

export const user = (): JWTPayload =>
  // userState.data ?? {
  //   id: "",
  //   role: "USER",
  //   name: "Loading...",
  //   username: "Loading...",
  // };
  userState.data as JWTPayload;
