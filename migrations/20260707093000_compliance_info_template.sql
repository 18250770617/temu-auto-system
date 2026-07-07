CREATE TABLE IF NOT EXISTS "ComplianceInfoTemplate" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "companyId" text NOT NULL,
  "shopId" text NOT NULL,
  "platform" text NOT NULL DEFAULT 'TEMU',
  "siteKey" text NOT NULL DEFAULT 'agentseller.temu.com',
  "spuId" text,
  "productTitle" text,
  "category" text,
  "sourceUrl" text,
  "templateInfoJson" jsonb NOT NULL,
  "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "ComplianceInfoTemplate_companyId_shopId_name_key"
  ON "ComplianceInfoTemplate" ("companyId", "shopId", "name");

CREATE INDEX IF NOT EXISTS "ComplianceInfoTemplate_companyId_shopId_idx"
  ON "ComplianceInfoTemplate" ("companyId", "shopId");

CREATE INDEX IF NOT EXISTS "ComplianceInfoTemplate_siteKey_idx"
  ON "ComplianceInfoTemplate" ("siteKey");
