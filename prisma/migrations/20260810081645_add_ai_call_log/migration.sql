-- CreateTable
CREATE TABLE "ai_call_log" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_call_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_call_log_createdAt_idx" ON "ai_call_log"("createdAt");
