import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { Context } from "./context.ts";

const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  hello: t.procedure.input(z.string().nullish()).query((opts) => {
    return `hello ${opts.input ?? opts.ctx.user?.name ?? "world"}`;
  }),
  // ...
});

export type AppRouter = typeof appRouter;
