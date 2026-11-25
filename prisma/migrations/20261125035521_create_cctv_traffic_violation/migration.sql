-- CreateEnum
CREATE TYPE "CctvType" AS ENUM ('RTSP', 'STREAM');

-- CreateEnum
CREATE TYPE "CctvStatus" AS ENUM ('ON', 'OFF');

-- CreateEnum
CREATE TYPE "StreamType" AS ENUM ('HLS', 'RTSP', 'MJPEG', 'WEBRTC');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('RODA_DUA', 'RODA_TIGA', 'RODA_EMPAT', 'TRUK_BUS');

-- CreateEnum
CREATE TYPE "TrafficStatus" AS ENUM ('UNKNOWN', 'LANCAR', 'NORMAL', 'PADAT', 'MACET');

-- CreateEnum
CREATE TYPE "ViolationType" AS ENUM ('CONTRAFLOW');

-- CreateTable
CREATE TABLE "Cctv" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "streamUrl" TEXT NOT NULL,
    "type" "CctvType" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "owner" TEXT NOT NULL,
    "status" "CctvStatus" NOT NULL DEFAULT 'OFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "streamType" "StreamType" NOT NULL DEFAULT 'HLS',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "aiEnabled" BOOLEAN NOT NULL DEFAULT false,
    "aiConfig" JSONB,
    "currentStatus" "TrafficStatus" NOT NULL DEFAULT 'UNKNOWN',
    "statusUpdatedAt" TIMESTAMPTZ(3),
    "lastHeartbeatAt" TIMESTAMPTZ(3),

    CONSTRAINT "Cctv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrafficCount" (
    "id" SERIAL NOT NULL,
    "cctvId" INTEGER NOT NULL,
    "bucketStart" TIMESTAMPTZ(3) NOT NULL,
    "bucketMinutes" INTEGER NOT NULL DEFAULT 5,
    "vehicleType" "VehicleType" NOT NULL,
    "count" INTEGER NOT NULL,
    "avgSpeedKmh" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrafficCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Violation" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "cctvId" INTEGER NOT NULL,
    "type" "ViolationType" NOT NULL DEFAULT 'CONTRAFLOW',
    "vehicleType" "VehicleType" NOT NULL,
    "plateNumber" TEXT,
    "description" TEXT,
    "occurredAt" TIMESTAMPTZ(3) NOT NULL,
    "imageKey" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Violation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cctv_code_key" ON "Cctv"("code");

-- CreateIndex
CREATE INDEX "Cctv_status_idx" ON "Cctv"("status");

-- CreateIndex
CREATE INDEX "TrafficCount_bucketStart_idx" ON "TrafficCount"("bucketStart");

-- CreateIndex
CREATE UNIQUE INDEX "TrafficCount_cctvId_bucketStart_vehicleType_key" ON "TrafficCount"("cctvId", "bucketStart", "vehicleType");

-- CreateIndex
CREATE UNIQUE INDEX "Violation_externalId_key" ON "Violation"("externalId");

-- CreateIndex
CREATE INDEX "Violation_cctvId_occurredAt_idx" ON "Violation"("cctvId", "occurredAt");

-- CreateIndex
CREATE INDEX "Violation_occurredAt_idx" ON "Violation"("occurredAt");

-- AddForeignKey
ALTER TABLE "TrafficCount" ADD CONSTRAINT "TrafficCount_cctvId_fkey" FOREIGN KEY ("cctvId") REFERENCES "Cctv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Violation" ADD CONSTRAINT "Violation_cctvId_fkey" FOREIGN KEY ("cctvId") REFERENCES "Cctv"("id") ON DELETE CASCADE ON UPDATE CASCADE;
