import { z } from "../lib";
import { tuser } from "../trpc";

export const me = tuser
  .output(
    z.object({
      username: z.string(),
    }),
  )
  .query(async ({ ctx }) => {
    return { username: ctx.user.username };
  });
