export interface JWT {
  sub?: string;
  email?: string | null;
  name?: string | null;
  isAuthorized?: boolean;
  [key: string]: unknown;
}

export declare function getToken(params: {
  req: unknown;
  secret?: string;
}): Promise<JWT | null>;
