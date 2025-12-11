import { hello } from "./functions/hello.ts";
import { login } from "./functions/login.js";
import { t } from "./trpc.ts";

export const appRouter = t.router({
  hello,
  login,
});

export type AppRouter = typeof appRouter;
