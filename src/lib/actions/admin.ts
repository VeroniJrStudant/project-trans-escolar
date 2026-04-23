"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { adminUserCreateSchema } from "@/lib/validations";
import type { ActionResult } from "./types";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  if (session.user.role !== "ADMIN") return null;
  return session;
}

function uiRoleToPrisma(role: "admin" | "operador" | "leitor") {
  if (role === "admin") return "ADMIN" as const;
  if (role === "leitor") return "LEITOR" as const;
  return "OPERADOR" as const;
}

export async function adminCreateUser(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { ok: false, error: "Acesso negado." };

  const raw = {
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
    role: formData.get("role"),
  };
  const parsed = adminUserCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const d = parsed.data;
  const passwordHash = await bcrypt.hash(d.password, 12);

  try {
    const row = await prisma.user.create({
      data: {
        email: d.email,
        name: d.name,
        passwordHash,
        role: uiRoleToPrisma(d.role),
      },
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "admin.user.create",
      entity: "User",
      entityId: row.id,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, error: "Já existe usuário com este e-mail." };
    }
    console.error(e);
    return { ok: false, error: "Não foi possível criar o usuário." };
  }

  revalidatePath("/admin");
  return { ok: true, message: "Usuário criado." };
}

