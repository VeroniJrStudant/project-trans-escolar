import type {
  FuelLog,
  PartMaintenance,
  RouteTrip as PrismaRouteTrip,
  RouteWaypoint as PrismaRouteWaypoint,
  ServiceMaintenance,
  Vehicle,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { describe, expect, it } from "vitest";
import {
  mapFuel,
  mapPart,
  mapService,
  mapTrip,
  mapVehicle,
  uiKindToPrisma,
  uiStatusToPrisma,
} from "../mappers";

function vehicleRow(partial: Partial<Vehicle> & Pick<Vehicle, "id" | "plate">): Vehicle {
  return {
    label: "L",
    kind: "VAN",
    capacity: 16,
    odometerKm: 1000,
    status: "ATIVO",
    nextInspectionDate: new Date("2026-06-01"),
    driverName: null,
    schoolRouteName: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...partial,
  } as Vehicle;
}

describe("mapVehicle", () => {
  it("mapeia enums Prisma → UI", () => {
    const v = mapVehicle(
      vehicleRow({
        id: "1",
        plate: "TST-1A22",
        kind: "MICROONIBUS",
        status: "MANUTENCAO",
      }),
    );
    expect(v.kind).toBe("microonibus");
    expect(v.status).toBe("manutencao");
    expect(v.plate).toBe("TST-1A22");
  });
});

describe("mapTrip", () => {
  it("ordena waypoints por orderIdx", () => {
    const trip = {
      id: "t1",
      vehicleId: "v1",
      startedAt: new Date("2026-01-01T08:00:00Z"),
      endedAt: new Date("2026-01-01T09:00:00Z"),
      distanceKm: 10,
      stops: 2,
      routeName: "Rota A",
      createdAt: new Date(),
      waypoints: [
        { id: "w2", tripId: "t1", lat: 2, lng: 2, orderIdx: 1 },
        { id: "w1", tripId: "t1", lat: 1, lng: 1, orderIdx: 0 },
      ] as PrismaRouteWaypoint[],
    } as PrismaRouteTrip & { waypoints: PrismaRouteWaypoint[] };
    const m = mapTrip(trip);
    expect(m.path[0]).toEqual({ lat: 1, lng: 1 });
    expect(m.path[1]).toEqual({ lat: 2, lng: 2 });
  });
});

describe("mapPart / mapFuel / mapService", () => {
  it("converte Decimal e datas", () => {
    const part = {
      id: "p1",
      vehicleId: "v1",
      date: new Date("2026-03-15T12:00:00Z"),
      description: "d",
      partName: "Pastilha",
      costBrl: new Decimal("99.5"),
      odometerKm: 5000,
      createdAt: new Date(),
    } as PartMaintenance;
    expect(mapPart(part).costBrl).toBe(99.5);
    expect(mapPart(part).date).toBe("2026-03-15");

    const fuel = {
      id: "f1",
      vehicleId: "v1",
      date: new Date("2026-02-01"),
      liters: 45.5,
      costBrl: new Decimal(300),
      odometerKm: 4000,
      station: "X",
      createdAt: new Date(),
    } as FuelLog;
    expect(mapFuel(fuel).liters).toBe(45.5);

    const svc = {
      id: "s1",
      vehicleId: "v1",
      date: new Date("2026-01-10"),
      title: "Revisão",
      notes: null,
      costBrl: new Decimal(0),
      odometerKm: 3000,
      createdAt: new Date(),
    } as ServiceMaintenance;
    expect(mapService(svc).costBrl).toBe(0);
  });
});

describe("uiKindToPrisma / uiStatusToPrisma", () => {
  it("reduz ida e volta UI ↔ Prisma", () => {
    expect(uiKindToPrisma("onibus")).toBe("ONIBUS");
    expect(uiStatusToPrisma("ativo")).toBe("ATIVO");
  });
});
