import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyUserCredentials } from "@/lib/mock-users";

type AuthorizedUser = {
  id: string;
  email: string;
  name?: string | null;
  isAuthorized: boolean;
};

function isAuthorizedUser(value: unknown): value is AuthorizedUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.isAuthorized === "boolean"
  );
}

const authSecret = process.env.NEXTAUTH_SECRET ?? "development-secret";

const authConfig = NextAuth({
  secret: authSecret,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        if (!email || !password) {
          return null;
        }

        const user = await verifyUserCredentials(email, password);

        if (!user) {
          return null;
        }

        const authorizedUser: AuthorizedUser = {
          id: user.id,
          email: user.email,
          name: user.fullName ?? user.email,
          isAuthorized: user.isAuthorized,
        };

        return authorizedUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (isAuthorizedUser(user)) {
        token.sub = user.id;
        token.email = user.email;
        token.isAuthorized = user.isAuthorized;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (typeof token.email === "string") {
          session.user.email = token.email;
        }
        if (typeof token.sub === "string") {
          session.user.id = token.sub;
        }
        session.user.isAuthorized = Boolean(token.isAuthorized);
      }
      return session;
    },
  },
});

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = authConfig;
