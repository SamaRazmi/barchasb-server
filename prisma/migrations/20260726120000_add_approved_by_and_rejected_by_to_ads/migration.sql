
-- DigitalAd
ALTER TABLE "DigitalAd" ADD COLUMN "approvedBy" TEXT;
ALTER TABLE "DigitalAd" ADD COLUMN "rejectedBy" TEXT;

-- EmployerAd
ALTER TABLE "EmployerAd" ADD COLUMN "approvedBy" TEXT;
ALTER TABLE "EmployerAd" ADD COLUMN "rejectedBy" TEXT;

-- JobSeekerAd
ALTER TABLE "JobSeekerAd" ADD COLUMN "approvedBy" TEXT;
ALTER TABLE "JobSeekerAd" ADD COLUMN "rejectedBy" TEXT;

-- SellerAd
ALTER TABLE "SellerAd" ADD COLUMN "approvedBy" TEXT;
ALTER TABLE "SellerAd" ADD COLUMN "rejectedBy" TEXT;