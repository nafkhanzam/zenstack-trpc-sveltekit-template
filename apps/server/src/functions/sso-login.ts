import { TRPCError } from "@trpc/server";
import { hashPassword, generateTokensFromUser } from "../common.js";
import { z } from "../lib.js";
import { t } from "../trpc.js";
import { Role } from "../zenstack/models.js";

/**
 * Mock SSO login endpoint for testing
 * In production, this would integrate with real OAuth providers
 */
export const ssoLogin = t.procedure
  .input(
    z.object({
      provider: z.enum(["google", "github", "microsoft", "mock"]),
      // Mock user data that would normally come from OAuth provider
      email: z.string().email(),
      name: z.string().nonempty(),
    }),
  )
  .mutation(async ({ ctx, ctx: { db, auditLog }, input }) => {
    // Generate a unique username from email and provider
    const username = `${input.provider}:${input.email}`;

    // Check if user already exists
    let user = await db.user.findUnique({
      where: {
        username,
      },
    });

    // Auto-create user if they don't exist
    if (!user) {
      // For SSO users, we use a random hash since they won't use password login
      const passwordHash = hashPassword(
        `sso-${input.provider}-${Math.random()}`,
      );

      user = await db.user.create({
        data: {
          name: input.name,
          username,
          passwordHash,
          role: Role.USER,
        },
      });

      auditLog(`trpc.sso-login.created`, { input, userId: user.id });
    }

    const tokens = await generateTokensFromUser(ctx, user);

    auditLog(`trpc.sso-login`, { input, tokens });

    return tokens;
  });
