/*
  Warnings:

  - The values [admin,super_admin] on the enum `AdminRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `firstname` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Admin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullName` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('SHOP', 'EDUCATION', 'CLUB', 'MAIN');

-- AlterEnum
ALTER TYPE "AdStatus" ADD VALUE 'updated';

-- AlterEnum
BEGIN;
CREATE TYPE "AdminRole_new" AS ENUM ('OWNER', 'ADMIN', 'SUPPORTER');
ALTER TABLE "Admin" ALTER COLUMN "role" TYPE "AdminRole_new" USING ("role"::text::"AdminRole_new");
ALTER TYPE "AdminRole" RENAME TO "AdminRole_old";
ALTER TYPE "AdminRole_new" RENAME TO "AdminRole";
DROP TYPE "public"."AdminRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "firstname",
DROP COLUMN "lastname",
DROP COLUMN "verified",
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "permissions" JSONB,
ADD COLUMN     "platforms" "Platform"[],
ADD COLUMN     "status" "AdminStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'SUPPORTER',
ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DigitalAd" ADD COLUMN     "city" TEXT,
ADD COLUMN     "phoneOther" TEXT,
ADD COLUMN     "province" TEXT;

-- AlterTable
ALTER TABLE "EmployerAd" ADD COLUMN     "phoneOther" TEXT;

-- AlterTable
ALTER TABLE "JobSeekerAd" ADD COLUMN     "phoneOther" TEXT;

-- AlterTable
ALTER TABLE "SellerAd" ADD COLUMN     "phoneOther" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
