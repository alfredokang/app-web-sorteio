declare module "next-auth" {
  import type { DefaultSession, DefaultUser } from "next-auth";
  import type { JWT } from "next-auth/jwt";

  export interface NextAuthOptions {
    providers: any[];
    session?: Record<string, unknown>;
    jwt?: Record<string, unknown>;
    callbacks?: Record<string, any>;
    pages?: Record<string, any>;
    events?: Record<string, any>;
    debug?: boolean;
  }

  export interface Session extends DefaultSession {
    user?: {
      id?: string;
      email?: string;
      isAuthorized?: boolean;
    } & DefaultSession["user"];
  }

  export interface User extends DefaultUser {
    isAuthorized?: boolean;
  }

  export interface JWT {
    isAuthorized?: boolean;
  }
}
