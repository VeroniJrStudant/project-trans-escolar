"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { eventTripCreateSchema, tripPassengerCreateSchema } from "@/lib/validations";
import type { ActionResult } from "./types";

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return session;
}

export async function createEventTrip(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const raw = {
    title: formData.get("title"),
    origin: formData.get("origin"),
    destination: formData.get("destination"),
    direction: formData.get("direction"),
    departAt: formData.get("departAt"),
    returnAt: formData.get("returnAt") || undefined,
    priceBrl: formData.get("priceBrl") || undefined,
    notes: formData.get("notes") || undefined,
  };
  const parsed = eventTripCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }
  const d = parsed.data;

  const trip = await prisma.eventTrip.create({
    data: {
      title: d.title,
      origin: d.origin,
      destination: d.destination,
      direction: d.direction === "ida" ? "IDA" : "IDA_E_VOLTA",
      departAt: new Date(d.departAt),
      returnAt: d.returnAt ? new Date(d.returnAt) : undefined,
      priceBrl: d.priceBrl != null ? new Prisma.Decimal(d.priceBrl) : undefined,
      notes: d.notes,
      createdById: session.user.id,
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "eventTrip.create",
    entity: "EventTrip",
    entityId: trip.id,
  });

  revalidatePath("/viagens");
  return { ok: true, message: "Viagem cadastrada." };
}

export async function addTripPassenger(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const raw = {
    tripId: formData.get("tripId"),
    studentId: formData.get("studentId") || undefined,
    name: formData.get("name"),
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    notes: formData.get("notes") || undefined,
  };
  const parsed = tripPassengerCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }
  const d = parsed.data;

  const exists = await prisma.eventTrip.findUnique({ where: { id: d.tripId }, select: { id: true } });
  if (!exists) return { ok: false, error: "Viagem não encontrada." };

  try {
    const row = await prisma.tripPassenger.create({
      data: {
        tripId: d.tripId,
        studentId: d.studentId,
        name: d.name,
        phone: d.phone,
        email: d.email,
        notes: d.notes,
      },
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "eventTrip.passenger.add",
      entity: "TripPassenger",
      entityId: row.id,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, error: "Esse passageiro já está na lista desta viagem." };
    }
    throw e;
  }

  revalidatePath(`/viagens/${d.tripId}`);
  return { ok: true, message: "Passageiro adicionado." };
}

export async function setPassengerPaymentStatus(args: {
  passengerId: string;
  status: "PAGO" | "PENDENTE";
}): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const row = await prisma.tripPassenger.findUnique({
    where: { id: args.passengerId },
    select: { id: true, tripId: true },
  });
  if (!row) return { ok: false, error: "Passageiro não encontrado." };

  await prisma.tripPassenger.update({
    where: { id: args.passengerId },
    data: {
      status: args.status,
      paidAt: args.status === "PAGO" ? new Date() : null,
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: `eventTrip.passenger.${args.status === "PAGO" ? "paid" : "pending"}`,
    entity: "TripPassenger",
    entityId: args.passengerId,
  });

  revalidatePath(`/viagens/${row.tripId}`);
  return { ok: true, message: "Status atualizado." };
}

export async function removeTripPassenger(args: { passengerId: string }): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const row = await prisma.tripPassenger.findUnique({
    where: { id: args.passengerId },
    select: { id: true, tripId: true },
  });
  if (!row) return { ok: false, error: "Passageiro não encontrado." };

  await prisma.tripPassenger.delete({ where: { id: args.passengerId } });

  await writeAuditLog({
    actorId: session.user.id,
    action: "eventTrip.passenger.remove",
    entity: "TripPassenger",
    entityId: args.passengerId,
  });

  revalidatePath(`/viagens/${row.tripId}`);
  return { ok: true, message: "Passageiro removido." };
}

