export const PUBLIC_ROUTES = ["/login", "/signup"] as const;

export type PublicRoute = (typeof PUBLIC_ROUTES)[number];

export function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
}
