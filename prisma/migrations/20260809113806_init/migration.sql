-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "analyses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "inputType" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageUploadedAt" DATETIME,
    "characteristics" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "confidence" REAL NOT NULL DEFAULT 0.0,
    "alternatives" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "analyses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "palm_lines" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameCs" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "anatomy" TEXT NOT NULL,
    "characteristics" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "mounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameCs" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "meanings" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "hand_types" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameCs" TEXT NOT NULL,
    "element" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "personality" TEXT NOT NULL,
    "characteristics" TEXT NOT NULL,
    "strengths" TEXT NOT NULL,
    "challenges" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "interpretations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "criteria" TEXT NOT NULL,
    "personality" TEXT NOT NULL,
    "strengths" TEXT NOT NULL,
    "challenges" TEXT NOT NULL,
    "guidance" TEXT NOT NULL,
    "weight" REAL NOT NULL DEFAULT 1.0,
    "school" TEXT NOT NULL,
    "source" TEXT,
    "confidence" REAL NOT NULL DEFAULT 0.8,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "uploaded_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "analysisId" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "originalPath" TEXT NOT NULL,
    "processedPath" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "analyses_userId_idx" ON "analyses"("userId");

-- CreateIndex
CREATE INDEX "analyses_createdAt_idx" ON "analyses"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "palm_lines_nameCs_key" ON "palm_lines"("nameCs");

-- CreateIndex
CREATE UNIQUE INDEX "mounts_nameCs_key" ON "mounts"("nameCs");

-- CreateIndex
CREATE UNIQUE INDEX "hand_types_name_key" ON "hand_types"("name");

-- CreateIndex
CREATE INDEX "interpretations_school_idx" ON "interpretations"("school");

-- CreateIndex
CREATE INDEX "interpretations_confidence_idx" ON "interpretations"("confidence");

-- CreateIndex
CREATE INDEX "uploaded_images_analysisId_idx" ON "uploaded_images"("analysisId");

-- CreateIndex
CREATE INDEX "uploaded_images_expiresAt_idx" ON "uploaded_images"("expiresAt");
