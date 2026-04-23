import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "ADMIN" | "OPERADOR" | "LEITOR";
  }
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "ADMIN" | "OPERADOR" | "LEITOR";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "OPERADOR" | "LEITOR";
  }
}
