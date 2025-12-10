import { ZenStackClient } from "@zenstackhq/orm";
import { schema } from "./zenstack/schema-lite";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { env } from "./env";

export const db = new ZenStackClient(schema, {
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: env.DATABASE_URL,
    }),
  }),
});
