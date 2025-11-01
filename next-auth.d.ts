declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      isAuthorized: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    isAuthorized: boolean;
    name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    email?: string;
    isAuthorized?: boolean;
  }
}
