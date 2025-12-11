import { sleep, z } from "../lib.ts";
import { t } from "../trpc.ts";

export const hello = t.procedure
  .input(z.string().nullish())
  .query(async (opts) => {
    await sleep(3000);
    return `hello ${opts.input ?? opts.ctx.user?.username ?? "world"}`;
  });
