import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { ensureDevNextAuthUrl, resolveAuthSecret } from "./auth-secret";
import { prisma } from "./prisma";

ensureDevNextAuthUrl();

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/login" },
  secret: resolveAuthSecret(),
  /** Evita chamadas extras (ex.: /api/auth/_log) salvo depuração explícita. */
  debug: process.env.NEXTAUTH_DEBUG === "1",
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "E-mail e senha",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) return null;

        try {
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) return null;

          const valid = await bcrypt.compare(password, user.passwordHash);
          if (!valid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
            role: user.role,
          };
        } catch (err) {
          console.error("[auth] Falha ao consultar o banco (PostgreSQL acessível?)", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role ?? "OPERADOR") as "ADMIN" | "OPERADOR" | "LEITOR";
      }
      return session;
    },
  },
};
