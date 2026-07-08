import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import bcrypt from "bcryptjs";
import { ensureUsersTable, findUserByEmail } from "@/lib/db";

interface DiscordProfile {
  id: string;
  username: string;
  global_name?: string | null;
  avatar: string | null;
  discriminator: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      authorization: {
        params: { scope: "identify guilds email" },
      },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await ensureUsersTable();
        const user = await findUserByEmail(credentials.email as string);

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.tokenProvider = account.provider;
        if (account.provider === "discord") {
          const dp = profile as DiscordProfile | undefined;
          token.discordId = dp?.id ?? token.sub;
          token.discordUsername = dp?.global_name ?? dp?.username;
          token.discordAvatar = dp?.avatar;
        }
      }
      if (token.tokenProvider === "credentials") {
        token.role = (token as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub as string;
      (session as unknown as Record<string, unknown>).accessToken = token.accessToken as string;
      (session as unknown as Record<string, unknown>).tokenProvider = token.tokenProvider as string;
      (session as unknown as Record<string, unknown>).discordId = token.discordId as string;
      (session as unknown as Record<string, unknown>).discordUsername = token.discordUsername as string;
      (session as unknown as Record<string, unknown>).discordAvatar = token.discordAvatar as string;
      if (token.tokenProvider === "credentials") {
        session.user.role = (token as { role?: string }).role ?? "";
        session.user.username = (token as { username?: string }).username;
      } else if (token.tokenProvider === "discord") {
        session.user.name = (token.discordUsername as string) ?? session.user.name;
        if (token.discordAvatar) {
          session.user.image = `https://cdn.discordapp.com/avatars/${token.discordId}/${token.discordAvatar}.png`;
        }
      }
      return session;
    },
  },
});
