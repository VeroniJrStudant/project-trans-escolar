"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { uiKindToPrisma, uiStatusToPrisma } from "@/lib/mappers";
import { vehicleCreateSchema } from "@/lib/validations";
import type { ActionResult } from "./types";

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return session;
}

export async function createVehicle(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const raw = {
    plate: formData.get("plate"),
    label: formData.get("label"),
    kind: formData.get("kind"),
    capacity: formData.get("capacity"),
    odometerKm: formData.get("odometerKm"),
    status: formData.get("status"),
    nextInspectionDate: formData.get("nextInspectionDate"),
    driverName: formData.get("driverName") || undefined,
    schoolRouteName: formData.get("schoolRouteName") || undefined,
  };

  const parsed = vehicleCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const d = parsed.data;
  try {
    const row = await prisma.vehicle.create({
      data: {
        plate: d.plate,
        label: d.label,
        kind: uiKindToPrisma(d.kind),
        capacity: d.capacity,
        odometerKm: d.odometerKm,
        status: uiStatusToPrisma(d.status),
        nextInspectionDate: new Date(d.nextInspectionDate),
        driverName: d.driverName,
        schoolRouteName: d.schoolRouteName,
      },
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "vehicle.create",
      entity: "Vehicle",
      entityId: row.id,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, error: "Já existe veículo com esta placa." };
    }
    console.error(e);
    return { ok: false, error: "Não foi possível salvar. Tente novamente." };
  }

  revalidatePath("/");
  revalidatePath("/frota");
  revalidatePath("/veiculos");
  return { ok: true, message: "Veículo cadastrado." };
}
