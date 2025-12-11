import type { ExpressMiddlewareOptions } from "@zenstackhq/server/express";
import { jwt, type trpcExpress } from "./lib.js";
import type { SchemaType } from "./zenstack/schema-lite";
import { db } from "./db.js";
import { env } from "./env.js";

const getUserFromToken = async (token: string | undefined) => {
  if (!token) {
    return null;
  }
  const jwtObject = jwt.verify(token, env.JWT_ACCESS_KEY);
  if (typeof jwtObject === "string") {
    return null;
  }
  const user = await db.user.findUnique({
    where: {
      id: jwtObject.id,
    },
  });
  return {
    id: user.id,
    username: user.username,
    role: user.role,
  };
};

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  const user = await getUserFromToken(req.headers.authorization);
  const dbauth = db.$setAuth(user ?? undefined);
  const auditLog = async (action: string, data: unknown = null) => {
    return db.auditLog
      .create({
        data: {
          action,
          data: {
            requestHeaders: Object.fromEntries(Object.entries(req.headers)),
            user,
            data: data as any,
          },
        },
      })
      .then();
  };
  return {
    req,
    res,
    user,
    db,
    dbauth,
    auditLog,
  };
};
export type Context = Awaited<ReturnType<typeof createContext>>;

export const getClient: ExpressMiddlewareOptions<SchemaType>["getClient"] =
  async (req) => {
    const user = await getUserFromToken(req.headers.authorization);
    return db.$setAuth(user ?? undefined);
  };
