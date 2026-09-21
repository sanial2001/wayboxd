-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "published_at" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Draft';
