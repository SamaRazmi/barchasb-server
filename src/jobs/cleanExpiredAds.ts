import prisma from "../config/prisma";
import { AdType } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

/**
 * پاکسازی آگهی‌های منقضی شده (expired)
 * این تابع تمام آگهی‌هایی که تاریخ انقضای آنها گذشته یا وضعیت expired دارند را
 * به همراه تمام وابستگی‌هایشان (چت، گزارش، مارک، ویو، نوتیفیکیشن و ...) حذف می‌کند.
 */
export async function cleanExpiredAds() {
  const now = new Date();
  console.log(`🧹 شروع پاکسازی آگهی‌های منقضی شده در ${now.toISOString()}`);

  const adTypes: AdType[] = [
    "EmployerAd",
    "JobSeekerAd",
    "SellerAd",
    "DigitalAd",
  ];

  for (const adType of adTypes) {
    let expiredAds: any[] = [];

    // دریافت آگهی‌های منقضی (expiresAt گذشته یا وضعیت expired)
    switch (adType) {
      case "EmployerAd":
        expiredAds = await prisma.employerAd.findMany({
          where: {
            OR: [{ expiresAt: { lt: now } }, { adStatus: "expired" }],
          },
        });
        break;
      case "JobSeekerAd":
        expiredAds = await prisma.jobSeekerAd.findMany({
          where: {
            OR: [{ expiresAt: { lt: now } }, { adStatus: "expired" }],
          },
        });
        break;
      case "SellerAd":
        expiredAds = await prisma.sellerAd.findMany({
          where: {
            OR: [{ expiresAt: { lt: now } }, { adStatus: "expired" }],
          },
        });
        break;
      case "DigitalAd":
        expiredAds = await prisma.digitalAd.findMany({
          where: {
            OR: [{ expiresAt: { lt: now } }, { adStatus: "expired" }],
          },
        });
        break;
    }

    if (expiredAds.length === 0) continue;

    console.log(
      `🗑️ ${expiredAds.length} آگهی از نوع ${adType} منقضی شده پیدا شد.`,
    );

    // حذف هر آگهی به همراه وابستگی‌ها
    for (const ad of expiredAds) {
      await deleteAdWithDependencies(adType, ad.id, ad);
    }
  }

  console.log("✅ پاکسازی آگهی‌های منقضی شده کامل شد.");
}

/**
 * حذف یک آگهی به همراه تمام وابستگی‌های آن
 */
async function deleteAdWithDependencies(
  adType: AdType,
  adId: string,
  adData?: any,
) {
  try {
    await prisma.$transaction(async (tx) => {
      // ============================================================
      // 1. حذف چت‌های مرتبط با این آگهی
      // ============================================================
      const chats = await tx.chat.findMany({
        where: {
          adId: adId,
          adType: adType,
        },
        select: { conversationId: true },
      });

      await tx.chat.deleteMany({
        where: {
          adId: adId,
          adType: adType,
        },
      });

      const conversationIds = chats.map((c) => c.conversationId);
      if (conversationIds.length > 0) {
        await tx.conversation.deleteMany({
          where: {
            id: { in: conversationIds },
          },
        });
      }

      // ============================================================
      // 2. حذف گزارش‌های مرتبط
      // ============================================================
      const reportTypeMap = {
        EmployerAd: "employerAd",
        JobSeekerAd: "jobSeekerAd",
        SellerAd: "sellerAd",
        DigitalAd: "DigitalAd",
      } as const;
      await tx.report.deleteMany({
        where: {
          targetId: adId,
          reportType: reportTypeMap[adType],
        },
      });

      // ============================================================
      // 3. حذف AdMark (نشان‌ها)
      // ============================================================
      await tx.adMark.deleteMany({
        where: {
          adId: adId,
          adType: adType,
        },
      });

      // ============================================================
      // 4. حذف AdView (بازدیدها)
      // ============================================================
      await tx.adView.deleteMany({
        where: {
          adId: adId,
          adType: adType,
        },
      });

      // ============================================================
      // 5. حذف RecentView (بازدیدهای اخیر)
      // ============================================================
      await tx.recentView.deleteMany({
        where: {
          ad: adId,
          adType: adType,
        },
      });

      // ============================================================
      // 6. حذف SuggestionView (پیشنهادات دیده شده)
      // ============================================================
      await tx.suggestionView.deleteMany({
        where: {
          adId: adId,
          adType: adType,
        },
      });

      // ============================================================
      // 7. حذف Notification های مرتبط با این آگهی
      // ============================================================
      await tx.notification.deleteMany({
        where: {
          adId: adId,
          adType: adType,
        },
      });

      // ============================================================
      // 8. حذف AdSimilarityScore (شباهت‌ها)
      // ============================================================
      await tx.adSimilarityScore.deleteMany({
        where: {
          OR: [
            { adId1: adId, adType1: adType },
            { adId2: adId, adType2: adType },
          ],
        },
      });

      // ============================================================
      // 9. حذف CachedUserSuggestions (کش پیشنهادات)
      //    (راه حل ساده: همه کش‌ها را حذف می‌کنیم، چون تعدادشان محدود است)
      // ============================================================
      await tx.cachedUserSuggestions.deleteMany({
        where: {
          // اینجا نمی‌توان روی Json شرط گذاشت، پس همه را حذف می‌کنیم
          // یا اگر می‌خواهید دقیق‌تر عمل کنید، ابتدا همه را بخوانید و فیلتر کنید
        },
      });

      // ============================================================
      // 10. حذف فایل‌های فیزیکی تصاویر (در صورت ذخیره محلی)
      // ============================================================
      if (adData?.images) {
        const images = adData.images as any[];
        for (const img of images) {
          if (img.url && !img.url.startsWith("http")) {
            const filePath = path.join(__dirname, "../../", img.url);
            try {
              await fs.unlink(filePath);
            } catch (err: any) {
              console.warn(`⚠️ حذف فایل ${filePath} ناموفق:`, err.message);
            }
          }
        }
      }

      // ============================================================
      // 11. حذف خود آگهی از جدول مربوطه
      // ============================================================
      switch (adType) {
        case "EmployerAd":
          await tx.employerAd.delete({ where: { id: adId } });
          break;
        case "JobSeekerAd":
          await tx.jobSeekerAd.delete({ where: { id: adId } });
          break;
        case "SellerAd":
          await tx.sellerAd.delete({ where: { id: adId } });
          break;
        case "DigitalAd":
          await tx.digitalAd.delete({ where: { id: adId } });
          break;
      }

      console.log(`✅ آگهی ${adId} (${adType}) با تمام وابستگی‌ها حذف شد.`);
    });
  } catch (error) {
    console.error(`❌ خطا در حذف آگهی ${adId} (${adType}):`, error);
  }
}
