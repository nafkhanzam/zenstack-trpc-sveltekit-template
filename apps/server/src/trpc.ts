import { initTRPC } from "@trpc/server";
import type { Context } from "./context";
import { unauthorizedError } from "./common";

export const t = initTRPC.context<Context>().create();
export const tuser = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw unauthorizedError;
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
