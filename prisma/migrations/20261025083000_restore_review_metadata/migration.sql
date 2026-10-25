-- Restore the review columns removed for the text-only version.
-- The table is empty, so the required columns can be added directly.

ALTER TABLE "reviews"
ADD COLUMN "place_id" INTEGER NOT NULL,
ADD COLUMN "title" TEXT NOT NULL,
ADD COLUMN "rating" INTEGER NOT NULL,
ADD COLUMN "would_go_again" BOOLEAN,
ADD COLUMN "visit_date" TIMESTAMP(3),
ADD COLUMN "tags" TEXT[];

ALTER TABLE "reviews" ALTER COLUMN "body" DROP NOT NULL;

CREATE INDEX "reviews_place_id_idx" ON "reviews"("place_id");

CREATE UNIQUE INDEX "reviews_user_id_place_id_key" ON "reviews"("user_id", "place_id");

ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_fkey";

ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "reviews" ADD CONSTRAINT "reviews_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
