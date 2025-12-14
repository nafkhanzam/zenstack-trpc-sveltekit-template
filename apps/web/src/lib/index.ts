import { TRPCClientError } from "@trpc/client";
import toast from "svelte-french-toast";
export { toast };
import * as z from "zod";
export { z };

export function isTRPCClientError(cause: unknown): cause is TRPCClientError<any> {
  return cause instanceof TRPCClientError;
}

const serverErrorV = z.object({
  status: z.number(),
  info: z.object({
    message: z.string(),
    stack: z.string().optional(),
    details: z.any().optional(),
  }),
});
export type ServerError = z.infer<typeof serverErrorV>;
export function isServerError(cause: unknown): cause is ServerError {
  const safe = serverErrorV.safeParse(cause);
  return safe.success;
}
