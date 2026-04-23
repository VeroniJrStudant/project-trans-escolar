import { afterEach, describe, expect, it, vi } from "vitest";
import { ensureDevNextAuthUrl, resolveAuthSecret } from "../auth-secret";

describe("resolveAuthSecret", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("usa NEXTAUTH_SECRET quando tem tamanho suficiente", () => {
    vi.stubEnv("NEXTAUTH_SECRET", "abcdefgh-secret-min-8");
    vi.stubEnv("NODE_ENV", "development");
    expect(resolveAuthSecret()).toBe("abcdefgh-secret-min-8");
  });

  it("ignora secret vazio e usa fallback em desenvolvimento", () => {
    vi.stubEnv("NEXTAUTH_SECRET", "   ");
    vi.stubEnv("NODE_ENV", "development");
    expect(resolveAuthSecret()).toContain("dev-transescolar");
  });

  it("AUTH_SECRET funciona como alternativa", () => {
    vi.stubEnv("NEXTAUTH_SECRET", "");
    vi.stubEnv("AUTH_SECRET", "12345678-auth-secret");
    vi.stubEnv("NODE_ENV", "development");
    expect(resolveAuthSecret()).toBe("12345678-auth-secret");
  });
});

describe("ensureDevNextAuthUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    delete process.env.NEXTAUTH_URL;
  });

  it("define localhost em desenvolvimento quando ausente", () => {
    vi.stubEnv("NODE_ENV", "development");
    delete process.env.NEXTAUTH_URL;
    ensureDevNextAuthUrl();
    expect(process.env.NEXTAUTH_URL).toBe("http://localhost:3000");
  });
});
