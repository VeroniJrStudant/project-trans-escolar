"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import {
  fuelCreateSchema,
  partCreateSchema,
  serviceCreateSchema,
} from "@/lib/validations";
import type { ActionResult } from "./types";

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return session;
}

export async function createPartMaintenance(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const raw = {
    vehicleId: formData.get("vehicleId"),
    date: formData.get("date"),
    partName: formData.get("partName"),
    description: formData.get("description"),
    costBrl: formData.get("costBrl"),
    odometerKm: formData.get("odometerKm"),
  };
  const parsed = partCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }
  const d = parsed.data;

  const row = await prisma.partMaintenance.create({
    data: {
      vehicleId: d.vehicleId,
      date: new Date(d.date),
      partName: d.partName,
      description: d.description,
      costBrl: d.costBrl,
      odometerKm: d.odometerKm,
    },
  });
  await writeAuditLog({
    actorId: session.user.id,
    action: "maintenance.part.create",
    entity: "PartMaintenance",
    entityId: row.id,
  });

  revalidatePath("/manutencao");
  revalidatePath("/");
  revalidatePath(`/veiculos/${d.vehicleId}`);
  return { ok: true, message: "Peça registrada." };
}

export async function createFuelLog(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const raw = {
    vehicleId: formData.get("vehicleId"),
    date: formData.get("date"),
    liters: formData.get("liters"),
    costBrl: formData.get("costBrl"),
    odometerKm: formData.get("odometerKm"),
    station: formData.get("station") || undefined,
  };
  const parsed = fuelCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }
  const d = parsed.data;

  const row = await prisma.fuelLog.create({
    data: {
      vehicleId: d.vehicleId,
      date: new Date(d.date),
      liters: d.liters,
      costBrl: d.costBrl,
      odometerKm: d.odometerKm,
      station: d.station,
    },
  });
  await writeAuditLog({
    actorId: session.user.id,
    action: "maintenance.fuel.create",
    entity: "FuelLog",
    entityId: row.id,
  });

  revalidatePath("/manutencao");
  revalidatePath("/");
  revalidatePath(`/veiculos/${d.vehicleId}`);
  return { ok: true, message: "Abastecimento registrado." };
}

export async function createServiceMaintenance(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const raw = {
    vehicleId: formData.get("vehicleId"),
    date: formData.get("date"),
    title: formData.get("title"),
    notes: formData.get("notes") || undefined,
    costBrl: formData.get("costBrl"),
    odometerKm: formData.get("odometerKm"),
  };
  const parsed = serviceCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }
  const d = parsed.data;

  const row = await prisma.serviceMaintenance.create({
    data: {
      vehicleId: d.vehicleId,
      date: new Date(d.date),
      title: d.title,
      notes: d.notes,
      costBrl: d.costBrl,
      odometerKm: d.odometerKm,
    },
  });
  await writeAuditLog({
    actorId: session.user.id,
    action: "maintenance.service.create",
    entity: "ServiceMaintenance",
    entityId: row.id,
  });

  revalidatePath("/manutencao");
  revalidatePath("/");
  revalidatePath(`/veiculos/${d.vehicleId}`);
  return { ok: true, message: "Serviço registrado." };
}
