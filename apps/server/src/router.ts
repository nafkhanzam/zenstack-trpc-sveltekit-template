import { changePassword } from "./functions/change-password.ts";
import { hello } from "./functions/hello.ts";
import { login } from "./functions/login.js";
import { me } from "./functions/me.ts";
import { refresh } from "./functions/refresh.ts";
import { register } from "./functions/register.ts";
import { t } from "./trpc.ts";

export const appRouter = t.router({
  hello,
  login,
  register,
  me,
  refresh,
  changePassword,
});

export type AppRouter = typeof appRouter;
