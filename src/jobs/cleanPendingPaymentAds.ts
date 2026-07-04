import prisma from "../config/prisma";
import { AdType } from "@prisma/client";
import { deleteMultipleFiles, deleteFile } from "../utils/s3Delete"; 

export async function cleanPendingPaymentAds() {
  console.log("🧹 شروع پاکسازی آگهی‌های pending_payment...");

  const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);

  const adTypes: AdType[] = [
    AdType.EmployerAd,
    AdType.DigitalAd,
    AdType.JobSeekerAd,
    AdType.SellerAd,
  ];

  for (const adType of adTypes) {
    const modelMap: Record<string, any> = {
      [AdType.EmployerAd]: prisma.employerAd,
      [AdType.DigitalAd]: prisma.digitalAd,
      [AdType.JobSeekerAd]: prisma.jobSeekerAd,
      [AdType.SellerAd]: prisma.sellerAd,
    };
    const model = modelMap[adType];

    const expiredAds = await model.findMany({
      where: {
        adStatus: "pending_payment",
        createdAt: {
          lte: twentyMinutesAgo,
        },
      },
      // select: { id: true, images: true, resumeFile: true }, // در صورت نیاز
    });

    for (const ad of expiredAds) {
      try {
        if (ad.images && Array.isArray(ad.images) && ad.images.length > 0) {
          const imageUrls = ad.images.map((img: any) => img.url).filter(Boolean);
          if (imageUrls.length > 0) {
            await deleteMultipleFiles(imageUrls);
            console.log(`🗑️ ${imageUrls.length} عکس برای آگهی ${ad.id} حذف شد`);
          }
        }

        if (adType === AdType.JobSeekerAd && ad.resumeFile) {
          await deleteFile(ad.resumeFile);
          console.log(`🗑️ رزومه آگهی ${ad.id} حذف شد`);
        }

        // ====== حذف فایل نمونه کار (برای JobSeekerAd) ======
        if (adType === AdType.JobSeekerAd && ad.workSampleFile) {
          await deleteFile(ad.workSampleFile);
          console.log(`🗑️ نمونه کار آگهی ${ad.id} حذف شد`);
        }

        // ====== حذف فایل‌های دیگر (در صورت وجود) ======
        // مثلاً برای EmployerAd ممکن است فایل پیوست داشته باشد
        // if (adType === AdType.EmployerAd && ad.attachments) { ... }

        // ====== حذف رکورد آگهی ======
        await model.delete({
          where: { id: ad.id },
        });
        console.log(` آگهی ${ad.id} (${adType}) به دلیل عدم پرداخت حذف شد`);
      } catch (error) {
        console.error(` خطا در حذف آگهی ${ad.id} (${adType}):`, error);
      }
    }
  }

  console.log(" پاکسازی آگهی‌های pending_payment کامل شد");
}