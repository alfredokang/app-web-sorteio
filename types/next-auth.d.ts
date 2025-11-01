import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      isAuthorized: boolean;
    };
  }

  interface User {
    id: string;
    isAuthorized: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    isAuthorized?: boolean;
  }
}

