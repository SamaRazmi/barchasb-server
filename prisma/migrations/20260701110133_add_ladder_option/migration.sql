/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_fromUserId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- AlterTable
ALTER TABLE "AdLadder" ADD COLUMN     "option" TEXT,
ALTER COLUMN "scheduledAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "refreshToken";

-- DropTable
DROP TABLE "Notification";
