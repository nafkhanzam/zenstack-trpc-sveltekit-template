import { z } from "./lib";

export const jwtPayloadV = z.object({
  id: z.string(),
  username: z.string(),
  role: z.string(),
});
export type JWTPayload = z.infer<typeof jwtPayloadV>;
