-- CreateEnum
CREATE TYPE "VehicleKind" AS ENUM ('ONIBUS', 'MICROONIBUS', 'VAN', 'UTILITARIO');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('ATIVO', 'MANUTENCAO', 'INATIVO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "kind" "VehicleKind" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "odometerKm" INTEGER NOT NULL,
    "status" "VehicleStatus" NOT NULL DEFAULT 'ATIVO',
    "nextInspectionDate" TIMESTAMP(3) NOT NULL,
    "driverName" TEXT,
    "schoolRouteName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteTrip" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3) NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "stops" INTEGER NOT NULL,
    "routeName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RouteTrip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteWaypoint" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "orderIdx" INTEGER NOT NULL,

    CONSTRAINT "RouteWaypoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartMaintenance" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "description" TEXT NOT NULL,
    "partName" TEXT NOT NULL,
    "costBrl" DECIMAL(12,2) NOT NULL,
    "odometerKm" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartMaintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelLog" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "liters" DOUBLE PRECISION NOT NULL,
    "costBrl" DECIMAL(12,2) NOT NULL,
    "odometerKm" INTEGER NOT NULL,
    "station" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FuelLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceMaintenance" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "costBrl" DECIMAL(12,2) NOT NULL,
    "odometerKm" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceMaintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GpsPoint" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GpsPoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plate_key" ON "Vehicle"("plate");

-- CreateIndex
CREATE INDEX "RouteWaypoint_tripId_idx" ON "RouteWaypoint"("tripId");

-- CreateIndex
CREATE INDEX "GpsPoint_vehicleId_recordedAt_idx" ON "GpsPoint"("vehicleId", "recordedAt");

-- AddForeignKey
ALTER TABLE "RouteTrip" ADD CONSTRAINT "RouteTrip_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteWaypoint" ADD CONSTRAINT "RouteWaypoint_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "RouteTrip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartMaintenance" ADD CONSTRAINT "PartMaintenance_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelLog" ADD CONSTRAINT "FuelLog_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceMaintenance" ADD CONSTRAINT "ServiceMaintenance_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GpsPoint" ADD CONSTRAINT "GpsPoint_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

