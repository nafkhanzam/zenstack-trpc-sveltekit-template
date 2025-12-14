import type { ExpressMiddlewareOptions } from "@zenstackhq/server/express";
import { JsonObject, JsonValue, jwt, type trpcExpress } from "./lib.js";
import type { SchemaType } from "./zenstack/schema-lite";
import { authDb, db } from "./db.js";
import { verifyAccessToken } from "./common.js";
import { prod } from "./env.js";

const getUserFromToken = async (token: string | undefined) => {
  if (!token) {
    return null;
  }
  const jwtObject = verifyAccessToken(token);
  if (!jwtObject) {
    return null;
  }
  const user = await db.user.findUnique({
    where: {
      id: jwtObject.id,
    },
  });
  if (!user) {
    return null;
  }
  return {
    id: user.id,
    username: user.username,
    role: user.role,
  };
};

const headersToObject = (rawHeaders: string[]) => {
  const headers: JsonObject = {};
  for (let i = 0; i < rawHeaders.length; i += 2) {
    const key = rawHeaders[i];
    const value = rawHeaders.at(i + 1) ?? null;
    headers[key] = value;
  }
  return headers;
};
export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  const user = await getUserFromToken(req.headers.authorization);
  const userDb = authDb.$setAuth(user ?? undefined);
  const auditLog = async (
    action: string,
    rawData: JsonValue | null | undefined = null,
  ) => {
    const data = {
      requestHeaders: headersToObject(req.rawHeaders),
      user,
      data: rawData,
    };
    if (!prod()) {
      console.log(action, data);
    }
    return db.auditLog
      .create({
        data: {
          action,
          data,
        },
      })
      .then();
  };
  return {
    req,
    res,
    user,
    db,
    userDb,
    auditLog,
  };
};
export type Context = Awaited<ReturnType<typeof createContext>>;

export const getClient: ExpressMiddlewareOptions<SchemaType>["getClient"] =
  async (req) => {
    const user = await getUserFromToken(req.headers.authorization);
    return authDb.$setAuth(user ?? undefined);
  };
