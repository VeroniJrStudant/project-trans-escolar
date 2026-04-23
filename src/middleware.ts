import { withAuth } from "next-auth/middleware";
import { ensureDevNextAuthUrl, resolveAuthSecret } from "@/lib/auth-secret";

ensureDevNextAuthUrl();

export default withAuth({
  secret: resolveAuthSecret(),
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ token, req }) => {
      if (!token) return false;
      const path = req.nextUrl.pathname;
      if (path.startsWith("/admin")) {
        return token.role === "ADMIN";
      }
      return true;
    },
  },
});

export const config = {
  matcher: [
    "/",
    "/frota/:path*",
    "/veiculos/:path*",
    "/rotas/:path*",
    "/manutencao/:path*",
    "/lancamentos/:path*",
    "/financeiro/:path*",
    "/mural/:path*",
    "/alunos/:path*",
    "/seguranca/:path*",
    "/admin/:path*",
  ],
};
