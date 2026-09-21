-- AlterTable
ALTER TABLE "trips" ALTER COLUMN "outbound_url" DROP NOT NULL;

UPDATE "trips" SET "outbound_url" = NULL WHERE "outbound_url" = '';
