import { TRPCError } from "@trpc/server";
import { tuser } from "../trpc";
import { bcrypt, z } from "../lib";
import { hashPassword, unauthorizedError } from "../common";

export const me = tuser
  .output(
    z.object({
      username: z.string(),
    }),
  )
  .query(async ({ ctx }) => {
    return { username: ctx.user.username };
  });

export const changePassword = tuser
  .input(
    z.object({
      oldPassword: z.string(),
      newPassword: z.string(),
    }),
  )
  .mutation(async ({ ctx: { db, user }, input }) => {
    if (!user?.username) {
      throw unauthorizedError;
    }

    const found = await db.user.findUnique({
      where: { username: user.username },
      select: { username: true, password: true },
    });
    if (!found?.password) {
      throw unauthorizedError;
    }

    // old must match
    if (!bcrypt.compareSync(input.oldPassword, found.password)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Wrong old password.",
      });
    }

    // new must be different from old
    if (bcrypt.compareSync(input.newPassword, found.password)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "New password must be different from the old password.",
      });
    }

    const newHashed = hashPassword(input.newPassword);
    await db.user.update({
      where: { username: found.username },
      data: { password: newHashed },
    });

    return { success: true };
  });
