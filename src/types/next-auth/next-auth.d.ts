import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extende o `User` retornado pelo provider
   */
  interface User extends DefaultUser {
    id: string;
    email: string;
    name?: string | null;
    isAuthorized: boolean;
  }

  /**
   * Extende o `Session` exposto no client e server
   */
  interface Session {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    sub?: string;
    email?: string | null;
    name?: string | null;
    isAuthorized?: boolean;
  }
}
