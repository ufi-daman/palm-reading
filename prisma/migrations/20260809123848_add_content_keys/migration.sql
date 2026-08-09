/*
  Warnings:

  - Added the required column `key` to the `mounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `palm_lines` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_mounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "nameCs" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "meanings" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_mounts" ("createdAt", "description", "id", "location", "meanings", "nameCs", "nameEn", "updatedAt") SELECT "createdAt", "description", "id", "location", "meanings", "nameCs", "nameEn", "updatedAt" FROM "mounts";
DROP TABLE "mounts";
ALTER TABLE "new_mounts" RENAME TO "mounts";
CREATE UNIQUE INDEX "mounts_key_key" ON "mounts"("key");
CREATE UNIQUE INDEX "mounts_nameCs_key" ON "mounts"("nameCs");
CREATE TABLE "new_palm_lines" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "nameCs" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "anatomy" TEXT NOT NULL,
    "characteristics" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_palm_lines" ("anatomy", "characteristics", "createdAt", "description", "id", "nameCs", "nameEn", "type", "updatedAt") SELECT "anatomy", "characteristics", "createdAt", "description", "id", "nameCs", "nameEn", "type", "updatedAt" FROM "palm_lines";
DROP TABLE "palm_lines";
ALTER TABLE "new_palm_lines" RENAME TO "palm_lines";
CREATE UNIQUE INDEX "palm_lines_key_key" ON "palm_lines"("key");
CREATE UNIQUE INDEX "palm_lines_nameCs_key" ON "palm_lines"("nameCs");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
