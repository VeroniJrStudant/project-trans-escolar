/**
 * Secret usado pelo NextAuth no Node (route handler) e no Edge (middleware).
 * Não importar Prisma aqui — este módulo é carregado pelo middleware.
 */
export function resolveAuthSecret(): string {
  const fromEnv =
    process.env.NEXTAUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim();
  if (fromEnv && fromEnv.length >= 8) {
    return fromEnv;
  }
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[auth] NEXTAUTH_SECRET ausente ou curto (<8). Defina no .env. Usando fallback só para não derrubar o build.",
    );
    return "unsafe-fallback-prod-set-NEXTAUTH_SECRET-at-least-32-chars";
  }
  return "dev-transescolar-local-nextauth-secret-min-32-chars";
}

/** Garante URL base em desenvolvimento quando o .env omite NEXTAUTH_URL. */
export function ensureDevNextAuthUrl(): void {
  if (process.env.NODE_ENV === "production") return;
  if (!process.env.NEXTAUTH_URL?.trim()) {
    process.env.NEXTAUTH_URL = "http://localhost:3000";
  }
}
