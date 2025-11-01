import type { NextRequest } from "next/server";

export interface JWT {
  sub?: string;
  email?: string;
  isAuthorized?: boolean;
  [key: string]: unknown;
}

export interface GetTokenParams {
  req: NextRequest;
  secret?: string;
}

export function getToken(params: GetTokenParams): Promise<JWT | null>;
