"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PAYMENT_METHOD_OPTIONS, type PaymentMethodCode } from "@/lib/finance/payment-methods";

const ALLOWED = new Set<PaymentMethodCode>(PAYMENT_METHOD_OPTIONS.map((o) => o.code));

export type AcceptedMethodDraft = {
  code: PaymentMethodCode;
  active: boolean;
  sortOrder: number;
  notes: string;
};

export async function saveAcceptedPaymentMethodsSettings(
  rows: AcceptedMethodDraft[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  for (const r of rows) {
    if (!ALLOWED.has(r.code)) return { ok: false, error: `Forma inválida: ${r.code}` };
    if (!Number.isInteger(r.sortOrder) || r.sortOrder < 0 || r.sortOrder > 99) {
      return { ok: false, error: "Ordem deve ser um número entre 0 e 99." };
    }
  }

  try {
    await prisma.$transaction(
      rows.map((r) =>
        prisma.acceptedPaymentMethod.upsert({
          where: { code: r.code },
          update: {
            active: r.active,
            sortOrder: r.sortOrder,
            notes: r.notes.trim() ? r.notes.trim() : null,
          },
          create: {
            code: r.code,
            active: r.active,
            sortOrder: r.sortOrder,
            notes: r.notes.trim() ? r.notes.trim() : null,
          },
        }),
      ),
    );
    revalidatePath("/financeiro");
    revalidatePath("/financeiro/configuracao");
    return { ok: true };
  } catch {
    return { ok: false, error: "Não foi possível salvar. Atualize a página e tente de novo." };
  }
}

