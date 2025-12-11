import type { ExpressMiddlewareOptions } from "@zenstackhq/server/express";
import type { trpcExpress } from "./lib.js";
import type { SchemaType } from "./zenstack/schema-lite";
import { db } from "./db.js";

const getUserFromToken = async (token: string | undefined) => {
  if (!token) {
    return null;
  }
  return {
    username: "alex",
  };
};

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  const user = await getUserFromToken(req.headers.authorization);
  const dbauth = db.$setAuth(user ?? undefined);
  return {
    req,
    res,
    user,
    db,
  };
};
export const getClient: ExpressMiddlewareOptions<SchemaType>["getClient"] =
  async (req) => {
    const user = await getUserFromToken(req.headers.authorization);
    return db.$setAuth(user ?? undefined);
  };
export type Context = Awaited<ReturnType<typeof createContext>>;
