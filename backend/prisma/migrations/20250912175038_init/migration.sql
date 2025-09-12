/*
  Warnings:

  - You are about to alter the column `createdAt` on the `quotes` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("timestamp(3)")` to `DateTime`.
  - You are about to alter the column `discount` on the `quotes` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("double precision")` to `Float`.
  - You are about to alter the column `subtotal` on the `quotes` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("double precision")` to `Float`.
  - You are about to alter the column `total` on the `quotes` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("double precision")` to `Float`.
  - You are about to alter the column `updatedAt` on the `quotes` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("timestamp(3)")` to `DateTime`.
  - You are about to alter the column `basePrice` on the `services` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("double precision")` to `Float`.
  - You are about to alter the column `createdAt` on the `services` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("timestamp(3)")` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `services` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("timestamp(3)")` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_quotes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "services" TEXT NOT NULL,
    "subtotal" REAL NOT NULL,
    "discount" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL,
    "estimatedDuration" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_quotes" ("createdAt", "customerEmail", "customerName", "customerPhone", "discount", "estimatedDuration", "id", "services", "subtotal", "total", "updatedAt") SELECT "createdAt", "customerEmail", "customerName", "customerPhone", "discount", "estimatedDuration", "id", "services", "subtotal", "total", "updatedAt" FROM "quotes";
DROP TABLE "quotes";
ALTER TABLE "new_quotes" RENAME TO "quotes";
CREATE TABLE "new_services" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "basePrice" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_services" ("basePrice", "category", "createdAt", "description", "duration", "id", "name", "updatedAt") SELECT "basePrice", "category", "createdAt", "description", "duration", "id", "name", "updatedAt" FROM "services";
DROP TABLE "services";
ALTER TABLE "new_services" RENAME TO "services";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
