import { TRPCClientError } from "@trpc/client";
import toast from "svelte-french-toast";
export { toast };

export function isTRPCClientError(cause: unknown): cause is TRPCClientError<any> {
  return cause instanceof TRPCClientError;
}
