/*
  Warnings:

  - You are about to drop the column `userHospitalOwnerId` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `userHospitalOwnerId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserHospitalOwner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hospitalId]` on the table `UserHospitalOwner` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Hospital" DROP CONSTRAINT "Hospital_userHospitalOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userHospitalOwnerId_fkey";

-- AlterTable
ALTER TABLE "Hospital" DROP COLUMN "userHospitalOwnerId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userHospitalOwnerId";

-- CreateIndex
CREATE UNIQUE INDEX "UserHospitalOwner_userId_key" ON "UserHospitalOwner"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserHospitalOwner_hospitalId_key" ON "UserHospitalOwner"("hospitalId");

-- AddForeignKey
ALTER TABLE "UserHospitalOwner" ADD CONSTRAINT "UserHospitalOwner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHospitalOwner" ADD CONSTRAINT "UserHospitalOwner_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
