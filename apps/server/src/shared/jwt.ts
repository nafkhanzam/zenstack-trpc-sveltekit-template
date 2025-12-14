import { z } from ".";

export const jwtPayloadV = z.object({
  id: z.string(),
  username: z.string(),
  role: z.enum(["SUPERADMIN", "ADMIN", "USER"]),
});
export type JWTPayload = z.infer<typeof jwtPayloadV>;
