-- CreateEnum
CREATE TYPE "TripDirection" AS ENUM ('IDA', 'IDA_E_VOLTA');

-- CreateEnum
CREATE TYPE "TripPaymentStatus" AS ENUM ('PENDENTE', 'PAGO');

-- CreateTable
CREATE TABLE "EventTrip" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "direction" "TripDirection" NOT NULL DEFAULT 'IDA_E_VOLTA',
    "departAt" TIMESTAMP(3) NOT NULL,
    "returnAt" TIMESTAMP(3),
    "priceBrl" DECIMAL(12,2),
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventTrip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripPassenger" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "studentId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "status" "TripPaymentStatus" NOT NULL DEFAULT 'PENDENTE',
    "paidAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TripPassenger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventTrip_departAt_idx" ON "EventTrip"("departAt");

-- CreateIndex
CREATE INDEX "EventTrip_createdById_idx" ON "EventTrip"("createdById");

-- CreateIndex
CREATE INDEX "TripPassenger_tripId_idx" ON "TripPassenger"("tripId");

-- CreateIndex
CREATE INDEX "TripPassenger_studentId_idx" ON "TripPassenger"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "TripPassenger_tripId_name_key" ON "TripPassenger"("tripId", "name");

-- AddForeignKey
ALTER TABLE "EventTrip" ADD CONSTRAINT "EventTrip_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripPassenger" ADD CONSTRAINT "TripPassenger_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "EventTrip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripPassenger" ADD CONSTRAINT "TripPassenger_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
