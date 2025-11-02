import type { Session } from "next-auth";
import type { ReactNode } from "react";

export type SessionStatus = "authenticated" | "unauthenticated" | "loading";

export interface SessionContextValue {
  data: Session | null;
  status: SessionStatus;
}

export interface SessionProviderProps {
  children: ReactNode;
  session?: Session | null;
}

export declare function useSession(): SessionContextValue;
export declare function signIn(
  provider?: string,
  options?: Record<string, unknown>,
  authorizationParams?: Record<string, unknown>
): Promise<{ error?: string; url?: string | null } | undefined>;
export declare function signOut(...args: unknown[]): Promise<unknown>;
export declare function SessionProvider(props: SessionProviderProps): JSX.Element;
