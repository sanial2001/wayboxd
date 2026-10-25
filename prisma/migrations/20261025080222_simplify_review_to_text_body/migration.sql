/*
  Warnings:

  - You are about to drop the column `place_id` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `visit_date` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `would_go_again` on the `reviews` table. All the data in the column will be lost.
  - Made the column `body` on table `reviews` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_place_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_fkey";

-- DropIndex
DROP INDEX "reviews_place_id_idx";

-- DropIndex
DROP INDEX "reviews_user_id_place_id_key";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "place_id",
DROP COLUMN "rating",
DROP COLUMN "tags",
DROP COLUMN "title",
DROP COLUMN "visit_date",
DROP COLUMN "would_go_again",
ALTER COLUMN "body" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
