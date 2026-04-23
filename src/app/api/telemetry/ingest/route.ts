import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { telemetryIngestSchema } from "@/lib/validations";

function extractApiKey(request: Request): string | null {
  const header =
    request.headers.get("x-api-key") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    null;
  return header?.trim() || null;
}

export async function POST(request: Request) {
  const expected = process.env.GPS_INGEST_API_KEY;
  if (!expected) {
    return NextResponse.json(
      { error: "GPS_INGEST_API_KEY não configurada no servidor." },
      { status: 503 },
    );
  }

  const key = extractApiKey(request);
  if (!key || key !== expected) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = telemetryIngestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Payload inválido." },
      { status: 400 },
    );
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: parsed.data.vehicleId },
    select: { id: true },
  });
  if (!vehicle) {
    return NextResponse.json({ error: "Veículo não encontrado." }, { status: 404 });
  }

  const { vehicleId, points } = parsed.data;
  const data = points.map((p) => ({
    vehicleId,
    lat: p.lat,
    lng: p.lng,
    recordedAt: new Date(p.recordedAt),
    source: p.source,
  }));

  const result = await prisma.gpsPoint.createMany({ data });

  return NextResponse.json({
    inserted: result.count,
    vehicleId,
  });
}
