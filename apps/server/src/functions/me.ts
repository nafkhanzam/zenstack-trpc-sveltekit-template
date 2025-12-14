import { tuser } from "../trpc";

export const me = tuser.query(async ({ ctx: { user, auditLog } }) => {
  auditLog(`me`);
  return user;
});
