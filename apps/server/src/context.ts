import type { ExpressMiddlewareOptions } from "@zenstackhq/server/express";
import { JsonObject, JsonValue, jwt, type trpcExpress } from "./lib.js";
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
  const dbauth = db.$setAuth(user ?? undefined);
  const auditLog = async (
    action: string,
    data: JsonValue | null | undefined = null,
  ) => {
    return db.auditLog
      .create({
        data: {
          action,
          data: {
            requestHeaders: headersToObject(req.rawHeaders),
            user,
            data: data,
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
