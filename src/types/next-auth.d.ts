import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      username?: string;
    } & DefaultSession["user"];
    accessToken?: string;
    tokenProvider?: string;
    discordId?: string;
    discordUsername?: string;
    discordAvatar?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    username?: string;
    accessToken?: string;
    tokenProvider?: string;
    discordId?: string;
    discordUsername?: string;
    discordAvatar?: string;
  }
}
