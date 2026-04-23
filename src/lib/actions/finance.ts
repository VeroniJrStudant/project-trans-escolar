"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { financialEntryCreateSchema } from "@/lib/validations";
import type { ActionResult } from "./types";

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return session;
}

export async function createFinancialEntry(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const raw = {
    type: formData.get("type"),
    date: formData.get("date"),
    category: formData.get("category"),
    amountBrl: formData.get("amountBrl"),
    notes: formData.get("notes") || undefined,
    vehicleId: formData.get("vehicleId") || undefined,
    studentId: formData.get("studentId") || undefined,
  };
  const parsed = financialEntryCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const d = parsed.data;
  const row = await prisma.financialEntry.create({
    data: {
      type: d.type === "receita" ? "RECEITA" : "DESPESA",
      date: new Date(d.date),
      category: d.category,
      amountBrl: d.amountBrl,
      notes: d.notes,
      vehicleId: d.vehicleId,
      studentId: d.studentId,
      createdById: session.user.id,
    },
  });
  await writeAuditLog({
    actorId: session.user.id,
    action: "finance.create",
    entity: "FinancialEntry",
    entityId: row.id,
  });

  revalidatePath("/financeiro");
  revalidatePath("/");
  return { ok: true, message: "Lançamento financeiro registrado." };
}

