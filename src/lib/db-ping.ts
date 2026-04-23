import { prisma } from "./prisma";

/** Verifica se o PostgreSQL responde (usado na tela de login). */
export async function isDatabaseReachable(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
