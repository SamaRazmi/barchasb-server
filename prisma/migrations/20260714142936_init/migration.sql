-- CreateEnum
CREATE TYPE "AdType" AS ENUM ('EmployerAd', 'JobSeekerAd', 'SellerAd', 'DigitalAd');

-- CreateEnum
CREATE TYPE "MarkType" AS ENUM ('favorite', 'suspicious', 'seen');

-- CreateEnum
CREATE TYPE "PersonType" AS ENUM ('self', 'other');

-- CreateEnum
CREATE TYPE "AdStatus" AS ENUM ('pending_payment', 'pending', 'approved', 'rejected', 'expired', 'updated');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Subscription', 'Wallet', 'Bank_card');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('0', '1', '3', '5');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('employerAd', 'jobSeekerAd', 'sellerAd', 'DigitalAd', 'chat');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('pending', 'reviewed', 'rejected');

-- CreateEnum
CREATE TYPE "ReportReasonType" AS ENUM ('general', 'employerAd', 'jobSeekerAd', 'sellerAd', 'DigitalAd', 'chat_employerAd', 'chat_jobSeekerAd', 'chat_sellerAd', 'chat_DigitalAd');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('open', 'in_progress', 'closed');

-- CreateEnum
CREATE TYPE "TestSessionStatus" AS ENUM ('in_progress', 'completed');

-- CreateEnum
CREATE TYPE "ScoringMethod" AS ENUM ('weighted_level', 'trait_accumulation', 'forced_choice_mbti', 'likert_sum', 'mbti_polar');

-- CreateEnum
CREATE TYPE "TimeUnit" AS ENUM ('minute', 'hour', 'day', 'month', 'year');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('OWNER', 'ADMIN', 'SUPPORTER');

-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('SHOP', 'EDUCATION', 'CLUB', 'MAIN');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'HOLD', 'REFUND');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELED', 'VERIFYING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT,
    "nationalCode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "acceptTerms" BOOLEAN NOT NULL DEFAULT false,
    "role" "UserRole" NOT NULL DEFAULT '0',
    "joinedAt" TEXT NOT NULL,
    "email" TEXT,
    "email_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "tempEmail" TEXT,
    "emailVerificationCode" TEXT,
    "emailVerificationExpires" TIMESTAMP(3),
    "phone_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "email_log_num" INTEGER NOT NULL DEFAULT 0,
    "phone_log_num" INTEGER NOT NULL DEFAULT 0,
    "referralCode" TEXT NOT NULL DEFAULT '',
    "online" BOOLEAN NOT NULL DEFAULT false,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vipExpiresAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "educationLevel" TEXT,
    "aboutMe" TEXT,
    "interests" TEXT[],
    "skills" TEXT[],
    "resumeFile" TEXT,
    "portfolioFiles" TEXT[],
    "documents" JSONB[],
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "walletId" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Province" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cities" TEXT[],

    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parent" TEXT,

    CONSTRAINT "AdCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdCategoryAttributes" (
    "id" TEXT NOT NULL,
    "adCategoryId" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "attributes" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "AdCategoryAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdMark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "adType" "AdType" NOT NULL,
    "type" "MarkType" NOT NULL DEFAULT 'favorite',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdMark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdView" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "adType" "AdType" NOT NULL,
    "ownerId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "adType" "AdType" NOT NULL,
    "conversationId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT DEFAULT 'text',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "participants" TEXT[],
    "adId" TEXT NOT NULL,
    "adType" TEXT NOT NULL,
    "lastMessage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalAd" (
    "id" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "images" JSONB[],
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "digitalTotalDesc" TEXT,
    "projectNames" TEXT[],
    "projectDescriptions" TEXT[],
    "minBudget" TEXT,
    "maxBudget" TEXT,
    "requiredSkills" JSONB[],
    "person" "PersonType" NOT NULL DEFAULT 'self',
    "remote" BOOLEAN NOT NULL DEFAULT false,
    "thursdayHalf" BOOLEAN NOT NULL DEFAULT false,
    "verifyCode" TEXT,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'Bank_card',
    "adStatus" "AdStatus" NOT NULL DEFAULT 'pending',
    "requestType" TEXT,
    "durationUnit" "TimeUnit" DEFAULT 'day',
    "durationAmount" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "isPaid" BOOLEAN NOT NULL DEFAULT true,
    "province" TEXT,
    "city" TEXT,
    "phoneOther" TEXT,

    CONSTRAINT "DigitalAd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailOTP" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailOTP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployerAd" (
    "id" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "images" JSONB[],
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "categories" JSONB[],
    "state" TEXT,
    "city" TEXT,
    "cooperationType" TEXT,
    "gender" TEXT,
    "militaryStatus" TEXT DEFAULT 'None',
    "experience" TEXT,
    "paymentMethod" TEXT,
    "isRemote" BOOLEAN NOT NULL DEFAULT false,
    "thursdayUntilNoon" BOOLEAN NOT NULL DEFAULT false,
    "startTime" TEXT,
    "endTime" TEXT,
    "minSalary" TEXT,
    "maxSalary" TEXT,
    "companyName" TEXT,
    "companyType" TEXT,
    "benefits" TEXT,
    "insurance" TEXT,
    "education" TEXT,
    "companyDescription" TEXT,
    "jobDetails" JSONB[],
    "rating" JSONB NOT NULL DEFAULT '{"average":0,"count":0}',
    "person" "PersonType" NOT NULL DEFAULT 'self',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "enableChat" BOOLEAN NOT NULL DEFAULT false,
    "enablePhone" BOOLEAN NOT NULL DEFAULT false,
    "adPaymentMethod" "PaymentMethod" NOT NULL DEFAULT 'Bank_card',
    "adStatus" "AdStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "isPaid" BOOLEAN NOT NULL DEFAULT true,
    "phoneOther" TEXT,

    CONSTRAINT "EmployerAd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parent" TEXT,

    CONSTRAINT "JobCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSeekerAd" (
    "id" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "images" JSONB[],
    "name" TEXT NOT NULL,
    "age" TEXT,
    "gender" TEXT,
    "maritalStatus" TEXT,
    "militaryStatus" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "state" TEXT,
    "city" TEXT,
    "category" TEXT NOT NULL,
    "resumeFile" TEXT,
    "workSampleFile" TEXT,
    "education" TEXT,
    "skills" TEXT[],
    "suggestedSalaryIRT" TEXT,
    "aboutMe" TEXT,
    "instagram" TEXT,
    "linkedIn" TEXT,
    "gitHub" TEXT,
    "careerHistory" JSONB[],
    "rating" JSONB NOT NULL DEFAULT '{"average":0,"count":0}',
    "person" "PersonType" NOT NULL DEFAULT 'self',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "enableChat" BOOLEAN NOT NULL DEFAULT true,
    "enablePhone" BOOLEAN NOT NULL DEFAULT false,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'Bank_card',
    "adStatus" "AdStatus" NOT NULL DEFAULT 'pending',
    "userDesc" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "phoneOther" TEXT,

    CONSTRAINT "JobSeekerAd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "purpose" TEXT NOT NULL DEFAULT 'default',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "options" JSONB[],
    "dimension" TEXT,
    "isReverseScored" BOOLEAN NOT NULL DEFAULT false,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecentView" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "adType" "AdType" NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecentView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporterUserId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "reportType" "ReportType" NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportReason" (
    "id" TEXT NOT NULL,
    "type" "ReportReasonType" NOT NULL DEFAULT 'general',
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "ReportReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "updateCount" INTEGER NOT NULL DEFAULT 0,
    "fullName" TEXT,
    "phoneNumber" TEXT,
    "birthDate" TEXT,
    "gender" TEXT,
    "maritalStatus" TEXT,
    "address" TEXT,
    "expectedSalary" TEXT,
    "cooperationType" TEXT,
    "hasInsuranceHistory" BOOLEAN NOT NULL DEFAULT false,
    "willingToGoOnMission" BOOLEAN NOT NULL DEFAULT false,
    "skills" TEXT[],
    "education" JSONB[],
    "workExperience" JSONB[],
    "certificates" JSONB[],
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerAd" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "application" TEXT,
    "status" TEXT,
    "images" JSONB[],
    "priceIRT" INTEGER NOT NULL DEFAULT 0,
    "isFixedPrice" BOOLEAN NOT NULL DEFAULT false,
    "isNegotiable" BOOLEAN NOT NULL DEFAULT false,
    "hasWarranty" BOOLEAN NOT NULL DEFAULT false,
    "isShippable" BOOLEAN NOT NULL DEFAULT false,
    "extraFeatures" JSONB NOT NULL DEFAULT '{}',
    "rating" JSONB NOT NULL DEFAULT '{"average":0,"count":0}',
    "person" "PersonType" NOT NULL DEFAULT 'self',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "enableChat" BOOLEAN NOT NULL DEFAULT false,
    "enablePhone" BOOLEAN NOT NULL DEFAULT false,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'Bank_card',
    "adStatus" "AdStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner" TEXT NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "phoneOther" TEXT,

    CONSTRAINT "SellerAd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "deviceInfo" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestType" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tags" TEXT[],
    "description" TEXT,
    "scoringMethod" "ScoringMethod" NOT NULL,
    "dimensions" TEXT[],
    "blueprint" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "questions" JSONB[],
    "score" INTEGER,
    "assignedLevel" TEXT,
    "levelResults" JSONB,
    "status" "TestSessionStatus" NOT NULL DEFAULT 'in_progress',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "quickResult" JSONB,
    "detailedResult" JSONB,

    CONSTRAINT "TestSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'open',
    "statusHistory" JSONB[],
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketReply" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolUsageLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "toolName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "metadata" JSONB,
    "durationMs" INTEGER,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToolUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'SUPPORTER',
    "status" "AdminStatus" NOT NULL DEFAULT 'PENDING',
    "platforms" "Platform"[],
    "permissions" JSONB,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Pricing" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdLadder" (
    "id" TEXT NOT NULL,
    "adEnhancementId" TEXT NOT NULL,
    "option" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "executedAt" TIMESTAMP(3),
    "isExecuted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdLadder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdEnhancement" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "adType" "AdType" NOT NULL,
    "isSpecial" BOOLEAN NOT NULL DEFAULT false,
    "specialStartDate" TIMESTAMP(3),
    "specialEndDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdEnhancement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 1000000,
    "heldBalance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT NOT NULL,
    "referenceId" TEXT,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "authority" TEXT,
    "refId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "PaymentMethod" NOT NULL,
    "description" TEXT,
    "referenceId" TEXT,
    "referenceType" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VipCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "maxUses" INTEGER NOT NULL DEFAULT 1,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "vipDuration" INTEGER NOT NULL DEFAULT 30,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "targetUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VipCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VipCodeUsage" (
    "id" TEXT NOT NULL,
    "vipCodeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "VipCodeUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_nationalCode_key" ON "User"("nationalCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_tempEmail_key" ON "User"("tempEmail");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_user_key" ON "UserProfile"("user");

-- CreateIndex
CREATE UNIQUE INDEX "AdCategoryAttributes_adCategoryId_key" ON "AdCategoryAttributes"("adCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "AdMark_userId_adId_adType_key" ON "AdMark"("userId", "adId", "adType");

-- CreateIndex
CREATE INDEX "AdView_ownerId_viewedAt_idx" ON "AdView"("ownerId", "viewedAt");

-- CreateIndex
CREATE INDEX "Chat_conversationId_idx" ON "Chat"("conversationId");

-- CreateIndex
CREATE INDEX "EmailOTP_createdAt_idx" ON "EmailOTP"("createdAt");

-- CreateIndex
CREATE INDEX "Otp_purpose_idx" ON "Otp"("purpose");

-- CreateIndex
CREATE INDEX "Otp_createdAt_idx" ON "Otp"("createdAt");

-- CreateIndex
CREATE INDEX "RecentView_user_viewedAt_idx" ON "RecentView"("user", "viewedAt");

-- CreateIndex
CREATE INDEX "RecentView_user_adType_viewedAt_idx" ON "RecentView"("user", "adType", "viewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RecentView_user_ad_key" ON "RecentView"("user", "ad");

-- CreateIndex
CREATE INDEX "ReportReason_type_order_idx" ON "ReportReason"("type", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ReportReason_type_key_key" ON "ReportReason"("type", "key");

-- CreateIndex
CREATE UNIQUE INDEX "TestCategory_name_key" ON "TestCategory"("name");

-- CreateIndex
CREATE INDEX "ToolUsageLog_createdAt_idx" ON "ToolUsageLog"("createdAt");

-- CreateIndex
CREATE INDEX "ToolUsageLog_toolName_status_createdAt_idx" ON "ToolUsageLog"("toolName", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ToolUsageLog_userId_createdAt_idx" ON "ToolUsageLog"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_phone_key" ON "Admin"("phone");

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

-- CreateIndex
CREATE UNIQUE INDEX "Pricing_key_key" ON "Pricing"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VipCode_code_key" ON "VipCode"("code");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdCategory" ADD CONSTRAINT "AdCategory_parent_fkey" FOREIGN KEY ("parent") REFERENCES "AdCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdCategoryAttributes" ADD CONSTRAINT "AdCategoryAttributes_adCategoryId_fkey" FOREIGN KEY ("adCategoryId") REFERENCES "AdCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdMark" ADD CONSTRAINT "AdMark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdView" ADD CONSTRAINT "AdView_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_from_fkey" FOREIGN KEY ("from") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_to_fkey" FOREIGN KEY ("to") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalAd" ADD CONSTRAINT "DigitalAd_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployerAd" ADD CONSTRAINT "EmployerAd_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCategory" ADD CONSTRAINT "JobCategory_parent_fkey" FOREIGN KEY ("parent") REFERENCES "JobCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSeekerAd" ADD CONSTRAINT "JobSeekerAd_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "TestType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentView" ADD CONSTRAINT "RecentView_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterUserId_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportReason" ADD CONSTRAINT "ReportReason_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerAd" ADD CONSTRAINT "SellerAd_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestType" ADD CONSTRAINT "TestType_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TestCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSession" ADD CONSTRAINT "TestSession_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "TestType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSession" ADD CONSTRAINT "TestSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketReply" ADD CONSTRAINT "TicketReply_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketReply" ADD CONSTRAINT "TicketReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolUsageLog" ADD CONSTRAINT "ToolUsageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VipCode" ADD CONSTRAINT "VipCode_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VipCodeUsage" ADD CONSTRAINT "VipCodeUsage_vipCodeId_fkey" FOREIGN KEY ("vipCodeId") REFERENCES "VipCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VipCodeUsage" ADD CONSTRAINT "VipCodeUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
