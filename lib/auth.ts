import type { NextAuthOptions, Session } from "next-auth";
import { getServerSession as nextGetServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import {
  ensureMockUser,
  findUserByEmail,
  MOCK_USER_EMAIL,
  MOCK_USER_PASSWORD,
  toPublicUser,
} from "@/lib/mockdb";

function isMockEnabled(): boolean {
  const value = String(process.env.ENABLE_MOCK ?? "false").toLowerCase();
  return value === "true" || value === "1";
}

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

        if (isMockEnabled() && email === MOCK_USER_EMAIL) {
          if (password !== MOCK_USER_PASSWORD) {
            throw new Error("Senha incorreta para o usuário mock.");
          }

          const mockUser = await ensureMockUser();
          const publicUser = toPublicUser(mockUser);

          return {
            id: publicUser.id,
            name: publicUser.name,
            email: publicUser.email,
            isAuthorized: publicUser.isAuthorized,
          };
        }

        if (email === MOCK_USER_EMAIL) {
          throw new Error("O usuário mock está desativado neste ambiente.");
        }

        const storedUser = await findUserByEmail(email);

        if (!storedUser) {
          throw new Error("Credenciais inválidas.");
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          storedUser.passwordHash,
        );

        if (!isPasswordValid) {
          throw new Error("Credenciais inválidas.");
        }

        return {
          id: storedUser.id,
          name: storedUser.name,
          email: storedUser.email,
          isAuthorized: storedUser.isAuthorized,
        };
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

