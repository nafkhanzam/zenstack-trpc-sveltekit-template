import { TRPCError } from "@trpc/server";
import { env } from "./env";
import { jwtPayloadV, type JWTPayload } from "./jwt";
import { bcrypt, jwt, z } from "./lib";
import { Context } from "./context";

export const unauthorizedError = new TRPCError({
  code: "UNAUTHORIZED",
  message: `You are not authorized.`,
});

export const forbiddenError = new TRPCError({
  code: "FORBIDDEN",
  message: `Access forbidden.`,
});

export const buildAccessToken = (payload: JWTPayload): string => {
  const token = jwt.sign(payload, env.JWT_ACCESS_KEY, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
  });
  return token;
};

export const verifyAccessToken = (token: string): JWTPayload => {
  const payload = jwt.verify(token, env.JWT_ACCESS_KEY);
  const jwtObject = jwtPayloadV.parse(payload);
  return jwtObject;
};

export const buildRefreshToken = async (ctx: Context, userId: string) => {
  const { db } = ctx;
  const refreshToken = await db.refreshToken.create({
    data: {
      userId,
    },
  });
  const token = jwt.sign(refreshToken.id, env.JWT_REFRESH_KEY, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });
  return token;
};

export const verifyRefreshToken = (token: string) => {
  const payload = jwt.verify(token, env.JWT_REFRESH_KEY);
  const refreshTokenId = z.string().nonempty().parse(payload);
  return refreshTokenId;
};

const SALT_ROUNDS = 12;

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, SALT_ROUNDS);
};
