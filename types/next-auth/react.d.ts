import type { ReactNode } from "react";
import type { Session } from "next-auth";

export interface UseSessionResult {
  data: Session | null;
  status: "authenticated" | "unauthenticated" | "loading";
}

export function SessionProvider({ children, session }: { children?: ReactNode; session?: Session | null }): ReactNode;
export function useSession(): UseSessionResult;
export interface SignInResponse {
  error?: string | null;
  status?: number;
  ok?: boolean;
  url?: string | null;
}

export function signIn(
  provider?: string,
  options?: Record<string, unknown>,
  authorizationParams?: Record<string, string>
): Promise<SignInResponse>;
export function signOut(options?: Record<string, unknown>): Promise<void>;
