import { TRPCError } from "@trpc/server";
import { Context } from "./context";
import { env } from "./env";
import type { JWTPayload } from "./jwt";
import { bcrypt, jwt } from "./lib";

export const unauthorizedError = new TRPCError({
  code: "UNAUTHORIZED",
  message: `You are not authorized.`,
});

export const forbiddenError = new TRPCError({
  code: "FORBIDDEN",
  message: `Access forbidden.`,
});

export const buildToken = (
  key: "access" | "refresh",
  payload: JWTPayload,
): string => {
  const [secretKey, expiresIn] = (() => {
    switch (key) {
      case "access":
        return [env.JWT_ACCESS_KEY, env.JWT_ACCESS_EXPIRES_IN];
      case "refresh":
        return [env.JWT_REFRESH_KEY, env.JWT_REFRESH_EXPIRES_IN];
    }
  })();
  const token = jwt.sign(payload, secretKey, { expiresIn: expiresIn as any });
  return token;
};

const SALT_ROUNDS = 12;

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, SALT_ROUNDS);
};
