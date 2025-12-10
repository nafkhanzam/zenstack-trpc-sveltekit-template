import type { ExpressMiddlewareOptions } from "@zenstackhq/server/express";
import type { trpcExpress } from "./lib.js";
import type { SchemaType } from "./zenstack/schema.js";
import { db } from "./db.js";

const getUserFromToken = (token: string | undefined) => {
  if (token !== "secret") {
    return null;
  }
  return {
    name: "alex",
  };
};

export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  return {
    req,
    res,
    user: getUserFromToken(req.headers.authorization),
  };
};
export const getClient: ExpressMiddlewareOptions<SchemaType>["getClient"] = (
  req,
) => {
  const user = getUserFromToken(req.headers.authorization);
  return db.$setAuth(user ?? undefined);
};
export type Context = Awaited<ReturnType<typeof createContext>>;
