import { prisma } from "./prisma";
import {
  mapFuel,
  mapGps,
  mapPart,
  mapService,
  mapTrip,
  mapVehicle,
} from "./mappers";

export async function listVehicles() {
  const rows = await prisma.vehicle.findMany({ orderBy: { plate: "asc" } });
  return rows.map(mapVehicle);
}

export async function listStudents() {
  return prisma.student.findMany({ orderBy: { name: "asc" } });
}

export async function listAnnouncements(limit = 20) {
  return prisma.announcement.findMany({
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
    take: limit,
    include: { author: { select: { name: true, email: true } } },
  });
}

export async function listFinancialEntries(limit = 50) {
  return prisma.financialEntry.findMany({
    orderBy: { date: "desc" },
    take: limit,
    include: {
      vehicle: { select: { plate: true } },
      student: { select: { name: true } },
      createdBy: { select: { name: true, email: true } },
    },
  });
}

export async function listAcceptedPaymentMethods() {
  return prisma.acceptedPaymentMethod.findMany({
    orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
    select: { code: true, active: true, sortOrder: true, notes: true },
  });
}

export async function listEventTrips(limit = 50) {
  return prisma.eventTrip.findMany({
    orderBy: { departAt: "desc" },
    take: limit,
    include: {
      passengers: { select: { status: true, name: true } },
      createdBy: { select: { name: true, email: true } },
    },
  });
}

export async function getEventTripById(id: string) {
  return prisma.eventTrip.findUnique({
    where: { id },
    include: {
      passengers: {
        orderBy: [{ status: "asc" }, { name: "asc" }],
        include: { student: { select: { name: true, guardianPhone: true, guardianName: true } } },
      },
      createdBy: { select: { name: true, email: true } },
    },
  });
}

export async function listAuditLogs(limit = 80) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { actor: { select: { name: true, email: true, role: true } } },
  });
}

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: [{ role: "asc" }, { email: "asc" }],
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
}

export async function getVehicleById(id: string) {
  const v = await prisma.vehicle.findUnique({ where: { id } });
  return v ? mapVehicle(v) : null;
}

export async function listTripsWithWaypoints() {
  const rows = await prisma.routeTrip.findMany({
    orderBy: { startedAt: "desc" },
    include: { waypoints: true },
  });
  return rows.map(mapTrip);
}

export async function listTripsForVehicle(vehicleId: string) {
  const rows = await prisma.routeTrip.findMany({
    where: { vehicleId },
    orderBy: { startedAt: "desc" },
    include: { waypoints: true },
  });
  return rows.map(mapTrip);
}

export async function listPartMaintenances() {
  const rows = await prisma.partMaintenance.findMany({
    orderBy: { date: "desc" },
  });
  return rows.map(mapPart);
}

export async function listFuelLogs() {
  const rows = await prisma.fuelLog.findMany({
    orderBy: { date: "desc" },
  });
  return rows.map(mapFuel);
}

export async function listServiceMaintenances() {
  const rows = await prisma.serviceMaintenance.findMany({
    orderBy: { date: "desc" },
  });
  return rows.map(mapService);
}

export async function listRecentGps(limit = 30) {
  const rows = await prisma.gpsPoint.findMany({
    orderBy: { recordedAt: "desc" },
    take: limit,
    include: { vehicle: { select: { plate: true } } },
  });
  return rows.map((r) => ({
    ...mapGps(r),
    plate: r.vehicle.plate,
  }));
}

export async function listPartsForVehicle(vehicleId: string) {
  const rows = await prisma.partMaintenance.findMany({
    where: { vehicleId },
    orderBy: { date: "desc" },
  });
  return rows.map(mapPart);
}

export async function listFuelForVehicle(vehicleId: string) {
  const rows = await prisma.fuelLog.findMany({
    where: { vehicleId },
    orderBy: { date: "desc" },
  });
  return rows.map(mapFuel);
}

export async function listServicesForVehicle(vehicleId: string) {
  const rows = await prisma.serviceMaintenance.findMany({
    where: { vehicleId },
    orderBy: { date: "desc" },
  });
  return rows.map(mapService);
}
