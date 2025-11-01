// Rotas declaradas aqui ficam públicas e não passam pelo middleware de autenticação.
// Adicione caminhos conforme necessário (ex.: "/about").
export const PUBLIC_ROUTES: readonly string[] = ["/login", "/signup"];

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
