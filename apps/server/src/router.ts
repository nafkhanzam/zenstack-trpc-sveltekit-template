import { initTRPC } from "@trpc/server";
import { z } from "zod";
import type { Context } from "./context.ts";
import { sleep } from "./lib.ts";

const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  hello: t.procedure.input(z.string().nullish()).query(async (opts) => {
    await sleep(3000);
    return `hello ${opts.input ?? opts.ctx.user?.name ?? "world"}`;
  }),
  // ...
});

export type AppRouter = typeof appRouter;
