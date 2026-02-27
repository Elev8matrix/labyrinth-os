-- CreateEnum
CREATE TYPE "AccountabilityEventType" AS ENUM ('REMINDER', 'WARNING', 'ESCALATION');

-- CreateTable
CREATE TABLE "accountability_policies" (
    "id" TEXT NOT NULL,
    "clientPackage" "ClientPackage" NOT NULL,
    "reminderHours" INTEGER NOT NULL DEFAULT 24,
    "warningHours" INTEGER NOT NULL DEFAULT 0,
    "escalationHours" INTEGER NOT NULL DEFAULT 24,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accountability_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accountability_events" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "type" "AccountabilityEventType" NOT NULL,
    "fromLevel" "EscalationLevel" NOT NULL,
    "toLevel" "EscalationLevel" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accountability_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accountability_policies_clientPackage_key" ON "accountability_policies"("clientPackage");

-- CreateIndex
CREATE INDEX "accountability_events_requestId_createdAt_idx" ON "accountability_events"("requestId", "createdAt");

-- AddForeignKey
ALTER TABLE "accountability_events" ADD CONSTRAINT "accountability_events_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
