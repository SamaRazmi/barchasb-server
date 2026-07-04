/*
  Warnings:

  - You are about to drop the column `isStepped` on the `AdEnhancement` table. All the data in the column will be lost.
  - You are about to drop the column `stepScheduledAt` on the `AdEnhancement` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "AdStatus" ADD VALUE 'expired';

-- AlterTable
ALTER TABLE "AdEnhancement" DROP COLUMN "isStepped",
DROP COLUMN "stepScheduledAt";

-- AlterTable
ALTER TABLE "DigitalAd" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "EmployerAd" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "JobSeekerAd" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SellerAd" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "SuggestionView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "adType" "AdType" NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuggestionView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSuggestionPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalAllowed" INTEGER NOT NULL DEFAULT 100,
    "resetPeriod" TEXT NOT NULL DEFAULT 'monthly',
    "lastResetDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preferredAdTypes" "AdType"[] DEFAULT ARRAY[]::"AdType"[],
    "preferredCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "filterWeights" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserSuggestionPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuggestionDailyLimit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "countUsed" INTEGER NOT NULL DEFAULT 0,
    "dailyLimit" INTEGER NOT NULL DEFAULT 20,

    CONSTRAINT "SuggestionDailyLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdSimilarityScore" (
    "id" TEXT NOT NULL,
    "adId1" TEXT NOT NULL,
    "adType1" "AdType" NOT NULL,
    "adId2" TEXT NOT NULL,
    "adType2" "AdType" NOT NULL,
    "similarityScore" DOUBLE PRECISION NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "AdSimilarityScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CachedUserSuggestions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "suggestionIds" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CachedUserSuggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdLadder" (
    "id" TEXT NOT NULL,
    "adEnhancementId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "executedAt" TIMESTAMP(3),
    "isExecuted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdLadder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SuggestionView_userId_viewedAt_idx" ON "SuggestionView"("userId", "viewedAt");

-- CreateIndex
CREATE INDEX "SuggestionView_adId_adType_idx" ON "SuggestionView"("adId", "adType");

-- CreateIndex
CREATE UNIQUE INDEX "SuggestionView_userId_adId_adType_key" ON "SuggestionView"("userId", "adId", "adType");

-- CreateIndex
CREATE UNIQUE INDEX "UserSuggestionPreference_userId_key" ON "UserSuggestionPreference"("userId");

-- CreateIndex
CREATE INDEX "SuggestionDailyLimit_userId_date_idx" ON "SuggestionDailyLimit"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "SuggestionDailyLimit_userId_date_key" ON "SuggestionDailyLimit"("userId", "date");

-- CreateIndex
CREATE INDEX "AdSimilarityScore_adId1_adType1_idx" ON "AdSimilarityScore"("adId1", "adType1");

-- CreateIndex
CREATE INDEX "AdSimilarityScore_adId2_adType2_idx" ON "AdSimilarityScore"("adId2", "adType2");

-- CreateIndex
CREATE UNIQUE INDEX "AdSimilarityScore_adId1_adType1_adId2_adType2_key" ON "AdSimilarityScore"("adId1", "adType1", "adId2", "adType2");

-- CreateIndex
CREATE UNIQUE INDEX "CachedUserSuggestions_userId_key" ON "CachedUserSuggestions"("userId");

-- CreateIndex
CREATE INDEX "CachedUserSuggestions_expiresAt_idx" ON "CachedUserSuggestions"("expiresAt");

-- AddForeignKey
ALTER TABLE "SuggestionView" ADD CONSTRAINT "SuggestionView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSuggestionPreference" ADD CONSTRAINT "UserSuggestionPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestionDailyLimit" ADD CONSTRAINT "SuggestionDailyLimit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CachedUserSuggestions" ADD CONSTRAINT "CachedUserSuggestions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdLadder" ADD CONSTRAINT "AdLadder_adEnhancementId_fkey" FOREIGN KEY ("adEnhancementId") REFERENCES "AdEnhancement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
