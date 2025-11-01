import type { NextRequest } from "next/server";

export type Awaitable<T> = T | Promise<T>;

export interface Session {
  user: {
    id: string;
    email: string;
    name?: string | null;
    isAuthorized: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  isAuthorized: boolean;
  name?: string | null;
}

export interface Logger {
  error(code: string, metadata: unknown): void;
}

export interface CredentialsConfig {
  name?: string;
  credentials?: Record<string, { label?: string; type?: string; placeholder?: string }>;
  authorize?(credentials?: Record<string, unknown>): Awaitable<unknown>;
}

export interface Callbacks {
  jwt?(params: { token: import("next-auth/jwt").JWT; user?: unknown; trigger?: string; session?: Session }): Awaitable<import("next-auth/jwt").JWT>;
  session?(params: { session: Session; token: import("next-auth/jwt").JWT; user?: User }): Awaitable<Session>;
}

export interface AuthOptions {
  secret?: string;
  session?: {
    strategy?: "jwt" | "database";
  };
  pages?: {
    signIn?: string;
    signOut?: string;
    error?: string;
    verifyRequest?: string;
    newUser?: string;
  };
  providers: Array<unknown>;
  callbacks?: Callbacks;
  logger?: Logger;
}

export type NextAuthOptions = AuthOptions;

export interface NextAuthResult {
  handlers: {
    GET: (request: Request) => Promise<Response>;
    POST: (request: Request) => Promise<Response>;
  };
  auth: (request: NextRequest) => Promise<Session | null>;
  signIn: (...args: unknown[]) => Promise<unknown>;
  signOut: (...args: unknown[]) => Promise<unknown>;
}

export default function NextAuth(options: NextAuthOptions): NextAuthResult;
