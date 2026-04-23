import type {
  FuelLog,
  PartMaintenance,
  RouteTrip,
  RouteWaypoint,
  ServiceMaintenance,
  Vehicle,
  VehicleKind,
  VehicleStatus,
} from "./types";
import type {
  FuelLog as PrismaFuel,
  GpsPoint,
  PartMaintenance as PrismaPart,
  RouteTrip as PrismaTrip,
  RouteWaypoint as PrismaWp,
  ServiceMaintenance as PrismaService,
  Vehicle as PrismaVehicle,
  VehicleKind as PrismaKind,
  VehicleStatus as PrismaStatus,
} from "@prisma/client";

const kindMap: Record<PrismaKind, VehicleKind> = {
  ONIBUS: "onibus",
  MICROONIBUS: "microonibus",
  VAN: "van",
  UTILITARIO: "utilitario",
};

const statusMap: Record<PrismaStatus, VehicleStatus> = {
  ATIVO: "ativo",
  MANUTENCAO: "manutencao",
  INATIVO: "inativo",
};

export function mapVehicle(v: PrismaVehicle): Vehicle {
  return {
    id: v.id,
    plate: v.plate,
    label: v.label,
    kind: kindMap[v.kind],
    capacity: v.capacity,
    odometerKm: v.odometerKm,
    status: statusMap[v.status],
    nextInspectionDate: v.nextInspectionDate.toISOString().slice(0, 10),
    driverName: v.driverName ?? undefined,
    schoolRouteName: v.schoolRouteName ?? undefined,
  };
}

export function mapWaypoint(w: PrismaWp): RouteWaypoint {
  return { lat: w.lat, lng: w.lng };
}

export function mapTrip(
  t: PrismaTrip & { waypoints: PrismaWp[] },
): RouteTrip {
  const ordered = [...t.waypoints].sort((a, b) => a.orderIdx - b.orderIdx);
  return {
    id: t.id,
    vehicleId: t.vehicleId,
    startedAt: t.startedAt.toISOString(),
    endedAt: t.endedAt.toISOString(),
    distanceKm: t.distanceKm,
    stops: t.stops,
    routeName: t.routeName,
    path: ordered.map(mapWaypoint),
  };
}

export function mapPart(p: PrismaPart): PartMaintenance {
  return {
    id: p.id,
    vehicleId: p.vehicleId,
    date: p.date.toISOString().slice(0, 10),
    description: p.description,
    partName: p.partName,
    costBrl: Number(p.costBrl),
    odometerKm: p.odometerKm,
  };
}

export function mapFuel(f: PrismaFuel): FuelLog {
  return {
    id: f.id,
    vehicleId: f.vehicleId,
    date: f.date.toISOString().slice(0, 10),
    liters: f.liters,
    costBrl: Number(f.costBrl),
    odometerKm: f.odometerKm,
    station: f.station ?? undefined,
  };
}

export function mapService(s: PrismaService): ServiceMaintenance {
  return {
    id: s.id,
    vehicleId: s.vehicleId,
    date: s.date.toISOString().slice(0, 10),
    title: s.title,
    notes: s.notes ?? undefined,
    costBrl: Number(s.costBrl),
    odometerKm: s.odometerKm,
  };
}

export function mapGps(g: GpsPoint) {
  return {
    id: g.id,
    vehicleId: g.vehicleId,
    lat: g.lat,
    lng: g.lng,
    recordedAt: g.recordedAt.toISOString(),
    source: g.source ?? undefined,
  };
}

export function uiKindToPrisma(kind: VehicleKind): PrismaKind {
  const rev: Record<VehicleKind, PrismaKind> = {
    onibus: "ONIBUS",
    microonibus: "MICROONIBUS",
    van: "VAN",
    utilitario: "UTILITARIO",
  };
  return rev[kind];
}

export function uiStatusToPrisma(status: VehicleStatus): PrismaStatus {
  const rev: Record<VehicleStatus, PrismaStatus> = {
    ativo: "ATIVO",
    manutencao: "MANUTENCAO",
    inativo: "INATIVO",
  };
  return rev[status];
}
