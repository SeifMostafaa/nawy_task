/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Apartment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Apartment" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
