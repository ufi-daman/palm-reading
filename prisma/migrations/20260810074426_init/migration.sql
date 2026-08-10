-- CreateTable
CREATE TABLE "analysis_stats" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inputType" TEXT NOT NULL,
    "handType" TEXT NOT NULL,
    "linesDetected" INTEGER NOT NULL DEFAULT 0,
    "linesManual" INTEGER NOT NULL DEFAULT 0,
    "usedAi" BOOLEAN NOT NULL DEFAULT false,
    "confidence" DOUBLE PRECISION NOT NULL,
    "detectionDetail" TEXT,

    CONSTRAINT "analysis_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analysis_stats_createdAt_idx" ON "analysis_stats"("createdAt");
