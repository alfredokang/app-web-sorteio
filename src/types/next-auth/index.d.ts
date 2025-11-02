import type { NextRequest } from "next/server";

export type Awaitable<T> = T | Promise<T>;

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  isAuthorized: boolean;
}

export interface Session {
  user?: SessionUser;
}

export interface User extends SessionUser {}

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
  session?(params: { session: Session; token: import("next-auth/jwt").JWT; user?: User | null }): Awaitable<Session>;
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

export type NextAuthHandler = (request: Request) => Promise<Response>;

export default function NextAuth(options: NextAuthOptions): NextAuthHandler;

export declare function auth(request: NextRequest): Promise<Session | null>;
export declare function signIn(...args: unknown[]): Promise<unknown>;
export declare function signOut(...args: unknown[]): Promise<unknown>;
