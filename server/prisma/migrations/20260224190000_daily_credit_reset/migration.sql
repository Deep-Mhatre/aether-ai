-- Add daily credit refresh tracking for users.
ALTER TABLE "user"
ADD COLUMN "creditsLastRefreshedAt" TIMESTAMP(3);

-- Backfill existing rows to a meaningful sentinel.
UPDATE "user"
SET "creditsLastRefreshedAt" = "createdAt"
WHERE "creditsLastRefreshedAt" IS NULL;

ALTER TABLE "user"
ALTER COLUMN "creditsLastRefreshedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "creditsLastRefreshedAt" SET NOT NULL;

