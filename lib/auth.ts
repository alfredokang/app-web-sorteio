import type { NextAuthOptions, Session } from "next-auth";
import { getServerSession as nextGetServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const MOCK_USER = {
  id: "mock-1",
  name: "Usuário Mock",
  email: "mock@example.com",
  password: "Mock@1234",
  isAuthorized: true,
} as const;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Informe e-mail e senha válidos.");
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        if (
          email === MOCK_USER.email.toLowerCase() &&
          password === MOCK_USER.password
        ) {
          return {
            id: MOCK_USER.id,
            name: MOCK_USER.name,
            email: MOCK_USER.email,
            isAuthorized: MOCK_USER.isAuthorized,
          };
        }

        throw new Error("Credenciais inválidas para este ambiente.");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.isAuthorized = (user as { isAuthorized?: boolean }).isAuthorized ?? false;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId ?? "");
        session.user.isAuthorized = Boolean(token.isAuthorized);
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export function getServerSession(): Promise<Session | null> {
  return nextGetServerSession(authOptions);
}

export async function requireAuthorizedSession(): Promise<Session> {
  const session = await getServerSession();

  if (!session || !session.user?.id) {
    throw new Error("Sessão não encontrada. Faça login novamente.");
  }

  if (!session.user.isAuthorized) {
    throw new Error("Usuário autenticado, porém aguardando autorização interna.");
  }

  return session;
}
