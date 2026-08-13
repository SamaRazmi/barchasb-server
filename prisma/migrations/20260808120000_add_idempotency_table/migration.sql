
BEGIN;

CREATE TYPE "IdempotencyStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

CREATE TABLE "Idempotency" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "referenceId" TEXT,
    "status" "IdempotencyStatus" NOT NULL DEFAULT 'PENDING',
    "response" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Idempotency_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Idempotency_key_key" ON "Idempotency"("key");

CREATE INDEX "Idempotency_userId_idx" ON "Idempotency"("userId");
CREATE INDEX "Idempotency_createdAt_idx" ON "Idempotency"("createdAt");

COMMIT;