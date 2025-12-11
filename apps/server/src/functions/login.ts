import { TRPCError } from "@trpc/server";
import { t } from "../trpc.js";
import { bcrypt, z } from "../lib.js";
import { buildToken } from "../common.js";

const invalidCredentialsError = new TRPCError({
  code: "UNAUTHORIZED",
  message: `Invalid credentials`,
});
export const login = t.procedure
  .input(
    z.object({
      username: z.string().nonempty(),
      password: z.string().nonempty(),
    }),
  )
  .mutation(async ({ ctx: { db, req }, input }) => {
    const user = await db.user.findFirst({
      where: {
        username: input.username,
      },
    });
    if (!user) {
      throw invalidCredentialsError;
    }
    const compareResult = bcrypt.compareSync(input.password, user.passwordHash);
    if (!compareResult) {
      throw invalidCredentialsError;
    }

    const token = buildToken("access", {
      id: user.id,
      username: user.username,
      role: user.role,
    });

    db.auditLog
      .create({
        data: {
          action: `trpc.login`,
          data: {
            requestHeaders: req.headers,
            user,
          },
        },
      })
      .then();

    return {
      token,
    };
  });
