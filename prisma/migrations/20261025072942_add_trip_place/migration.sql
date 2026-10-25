-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "place_id" INTEGER;

-- CreateIndex
CREATE INDEX "trips_place_id_idx" ON "trips"("place_id");

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE SET NULL ON UPDATE CASCADE;
