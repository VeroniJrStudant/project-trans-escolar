import { describe, expect, it } from "vitest";
import {
  parseTripWaypoints,
  telemetryIngestSchema,
  vehicleCreateSchema,
} from "../validations";

describe("vehicleCreateSchema", () => {
  it("aceita payload válido", () => {
    const r = vehicleCreateSchema.safeParse({
      plate: "abc-1d23",
      label: "Van teste",
      kind: "van",
      capacity: 16,
      odometerKm: 1000,
      status: "ativo",
      nextInspectionDate: "2026-12-01",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.plate).toMatch(/ABC/);
  });

  it("rejeita placa curta", () => {
    const r = vehicleCreateSchema.safeParse({
      plate: "AB",
      label: "X",
      kind: "van",
      capacity: 1,
      odometerKm: 0,
      status: "ativo",
      nextInspectionDate: "2026-12-01",
    });
    expect(r.success).toBe(false);
  });
});

describe("parseTripWaypoints", () => {
  it("interpreta JSON de pontos", () => {
    const pts = parseTripWaypoints(
      JSON.stringify([
        { lat: -23.5, lng: -46.6 },
        { lat: -23.51, lng: -46.61 },
      ]),
    );
    expect(pts).toHaveLength(2);
    expect(pts[0].lat).toBe(-23.5);
  });

  it("lança em JSON inválido", () => {
    expect(() => parseTripWaypoints("not json")).toThrow();
  });
});

describe("telemetryIngestSchema", () => {
  it("valida corpo de ingestão", () => {
    const r = telemetryIngestSchema.safeParse({
      vehicleId: "clx123",
      points: [
        {
          lat: 1,
          lng: 2,
          recordedAt: "2026-01-01T12:00:00.000Z",
        },
      ],
    });
    expect(r.success).toBe(true);
  });
});
