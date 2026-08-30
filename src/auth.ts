import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { authConfig } from "@/auth.config";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;
const OAUTH_PROVIDERS = new Set(["github", "google"]);

export class AccountLockedError extends CredentialsSignin {
  code = "account_locked";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new AccountLockedError();
        }

        const passwordMatches = user.passwordHash
          ? await bcrypt.compare(password, user.passwordHash)
          : false;

        if (!passwordMatches) {
          const attempts = user.failedLoginAttempts + 1;
          const isNowLocked = attempts >= MAX_LOGIN_ATTEMPTS;

          await prisma.user.update({
            where: { id: user.id },
            data: isNowLocked
              ? { failedLoginAttempts: 0, lockedUntil: new Date(Date.now() + LOCK_DURATION_MS) }
              : { failedLoginAttempts: attempts },
          });

          if (isNowLocked) throw new AccountLockedError();
          return null;
        }

        if (user.failedLoginAttempts > 0 || user.lockedUntil) {
          await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: 0, lockedUntil: null },
          });
        }

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
    ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET ? [GitHub] : []),
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET ? [Google] : []),
  ],
  callbacks: {
    ...authConfig.callbacks,
    signIn: async ({ user, account }) => {
      if (account && OAUTH_PROVIDERS.has(account.provider)) {
        if (!user.email) return false;
        await prisma.user.upsert({
          where: { email: user.email },
          update: { name: user.name ?? user.email },
          create: { email: user.email, name: user.name ?? user.email },
        });
      }
      return true;
    },
    jwt: async ({ token, user, account }) => {
      if (user) {
        if (account && OAUTH_PROVIDERS.has(account.provider) && user.email) {
          const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
          if (dbUser) token.id = dbUser.id;
        } else if (user.id) {
          token.id = user.id;
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
