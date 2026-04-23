"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { parseTripWaypoints, tripCreateSchema } from "@/lib/validations";
import type { ActionResult } from "./types";

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return session;
}

export async function createTrip(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return { ok: false, error: "Sessão expirada. Entre novamente." };

  const raw = {
    vehicleId: formData.get("vehicleId"),
    routeName: formData.get("routeName"),
    startedAt: formData.get("startedAt"),
    endedAt: formData.get("endedAt"),
    distanceKm: formData.get("distanceKm"),
    stops: formData.get("stops"),
    waypointsJson: formData.get("waypointsJson"),
  };

  const parsed = tripCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  let waypoints;
  try {
    waypoints = parseTripWaypoints(parsed.data.waypointsJson);
  } catch {
    return { ok: false, error: "JSON de pontos inválido." };
  }

  const d = parsed.data;
  const row = await prisma.routeTrip.create({
    data: {
      vehicleId: d.vehicleId,
      routeName: d.routeName,
      startedAt: new Date(d.startedAt),
      endedAt: new Date(d.endedAt),
      distanceKm: d.distanceKm,
      stops: d.stops,
      waypoints: {
        create: waypoints.map((p, orderIdx) => ({
          lat: p.lat,
          lng: p.lng,
          orderIdx,
        })),
      },
    },
  });
  await writeAuditLog({
    actorId: session.user.id,
    action: "trip.create",
    entity: "RouteTrip",
    entityId: row.id,
  });

  revalidatePath("/rotas");
  revalidatePath("/");
  revalidatePath(`/veiculos/${d.vehicleId}`);
  return { ok: true, message: "Viagem registrada." };
}
