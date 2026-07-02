import prisma from "../src/config/prisma";

async function clearAllData() {
  const models = [
    "cachedUserSuggestions",
    "suggestionDailyLimit",
    "userSuggestionPreference",
    "suggestionView",
    "adSimilarityScore",
    "adEnhancement",
    "transaction",
    "wallet",
    "pricing",
    "testSession",
    "question",
    "testType",
    "testCategory",
    "toolUsageLog",
    "ticketReply",
    "ticket",
    "report",
    "reportReason",
    "resume",
    "recentView",
    "adView",
    "adMark",
    "chat",
    "conversation",
    "digitalAd",
    "sellerAd",
    "jobSeekerAd",
    "employerAd",
    "userProfile",
    "session",
    "otp",
    "emailOTP",
    "user",
  ];
  for (const model of models) {
    // @ts-ignore
    await prisma[model].deleteMany({});
    console.log(`✅ ${model} cleared`);
  }
}

clearAllData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
