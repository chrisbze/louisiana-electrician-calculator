-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_quotes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "customerAddress" TEXT,
    "propertyType" TEXT,
    "services" TEXT NOT NULL,
    "subtotal" REAL NOT NULL,
    "materialsCost" REAL NOT NULL DEFAULT 0,
    "laborCost" REAL NOT NULL DEFAULT 0,
    "permitCost" REAL NOT NULL DEFAULT 0,
    "discount" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL,
    "estimatedDuration" INTEGER NOT NULL,
    "emergencyService" BOOLEAN NOT NULL DEFAULT false,
    "scheduledDate" DATETIME,
    "notes" TEXT,
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
    "serviceType" TEXT NOT NULL DEFAULT 'Installation',
    "duration" INTEGER NOT NULL,
    "materialCost" REAL,
    "laborRate" REAL,
    "minimumCharge" REAL,
    "requiresPermit" BOOLEAN NOT NULL DEFAULT false,
    "permitCost" REAL,
    "difficultyLevel" TEXT NOT NULL DEFAULT 'Standard',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_services" ("basePrice", "category", "createdAt", "description", "duration", "id", "name", "updatedAt") SELECT "basePrice", "category", "createdAt", "description", "duration", "id", "name", "updatedAt" FROM "services";
DROP TABLE "services";
ALTER TABLE "new_services" RENAME TO "services";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
