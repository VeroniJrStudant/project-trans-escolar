"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { studentCreateSchema } from "@/lib/validations";
import type { ActionResult } from "./types";

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return session;
}

export async function createStudent(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const raw = {
    name: formData.get("name"),
    birthDate: formData.get("birthDate") || undefined,
    guardianName: formData.get("guardianName") || undefined,
    guardianPhone: formData.get("guardianPhone") || undefined,
    notes: formData.get("notes") || undefined,
    active: formData.get("active") !== "off",
  };
  const parsed = studentCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const d = parsed.data;
  const row = await prisma.student.create({
    data: {
      name: d.name,
      birthDate: d.birthDate ? new Date(d.birthDate) : undefined,
      guardianName: d.guardianName,
      guardianPhone: d.guardianPhone,
      notes: d.notes,
      active: d.active ?? true,
    },
  });
  await writeAuditLog({
    actorId: session.user.id,
    action: "student.create",
    entity: "Student",
    entityId: row.id,
  });

  revalidatePath("/alunos");
  return { ok: true, message: "Aluno cadastrado." };
}

