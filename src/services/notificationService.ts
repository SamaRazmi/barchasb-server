import prisma from "../config/prisma";
import { toJalaliDate } from "../utils/dateFormatter";
import { AdType, NotificationType } from "@prisma/client";

/**
 * نوع داده‌ای مورد نیاز برای ایجاد نوتیفیکیشن
 * حداقل فیلدهای مورد نیاز از یک آگهی
 */
type AdRecord = {
  id: string; // شناسه آگهی
  title: string; // عنوان آگهی
  owner: string; // شناسه کاربر مالک آگهی
};

/**
 * ایجاد نوتیفیکیشن برای تأیید آگهی
 *
 * @param ad - اطلاعات آگهی (شامل id, title, owner)
 * @param adType - نوع آگهی (از enum AdType)
 * @param approvedBy - (اختیاری) شناسه ادمین تأییدکننده
 * @returns Promise با داده‌های نوتیفیکیشن ایجاد شده
 *
 * @example
 * const ad = await prisma.digitalAd.findUnique({ where: { id: adId } });
 * await createAdApprovedNotification(ad, "DigitalAd", adminId);
 */
export async function createAdApprovedNotification(
  ad: AdRecord,
  adType: AdType,
  approvedBy?: string,
) {
  // تولید تاریخ شمسی فعلی
  const persianDate = toJalaliDate(new Date());

  // نگاشت نوع آگهی به نام فارسی
  const adTypeName =
    {
      DigitalAd: "دیجیتال",
      EmployerAd: "کارفرما",
      JobSeekerAd: "جستجوی کار",
      SellerAd: "فروش",
    }[adType] || "";

  // ساخت عنوان و پیام
  const title = `✅ تأیید آگهی ${adTypeName}`;
  const message = `آگهی شما با عنوان "${ad.title}" در تاریخ ${persianDate} تأیید شد.`;

  // ذخیره در دیتابیس
  return prisma.inAppNotification.create({
    data: {
      userId: ad.owner,
      title,
      message,
      type: NotificationType.AD_APPROVED, // از enum استفاده شده
      referenceId: ad.id,
      referenceType: adType,
    },
  });
}

/**
 * ایجاد نوتیفیکیشن برای رد آگهی
 *
 * @param ad - اطلاعات آگهی
 * @param adType - نوع آگهی
 * @param rejectionReason - (اختیاری) علت رد آگهی
 * @returns Promise با داده‌های نوتیفیکیشن ایجاد شده
 *
 * @example
 * const ad = await prisma.digitalAd.findUnique({ where: { id: adId } });
 * await createAdRejectedNotification(ad, "DigitalAd", "محتوای نامناسب");
 */
export async function createAdRejectedNotification(
  ad: AdRecord,
  adType: AdType,
  rejectionReason?: string,
) {
  const persianDate = toJalaliDate(new Date());

  const adTypeName =
    {
      DigitalAd: "دیجیتال",
      EmployerAd: "کارفرما",
      JobSeekerAd: "جستجوی کار",
      SellerAd: "فروش",
    }[adType] || "";

  const title = `❌ رد آگهی ${adTypeName}`;
  const reasonText = rejectionReason ? `\nعلت: ${rejectionReason}` : "";
  const message = `آگهی شما با عنوان "${ad.title}" در تاریخ ${persianDate} رد شد.${reasonText}`;

  return prisma.inAppNotification.create({
    data: {
      userId: ad.owner,
      title,
      message,
      type: NotificationType.AD_REJECTED,
      referenceId: ad.id,
      referenceType: adType,
    },
  });
}
