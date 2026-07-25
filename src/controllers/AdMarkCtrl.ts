import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AdType } from "@prisma/client";
// ============================================================
// تابع کمکی برای تبدیل پارامترهای Route به string
// (پشتیبانی از ParsedQs و آرایه‌ها)
// ============================================================
const toStr = (value: any): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) {
    const first = value[0];
    return typeof first === "string" ? first : "";
  }
  if (value && typeof value === "object" && value.toString) {
    return value.toString();
  }
  return "";
};

// ============================================================
// تابع کمکی برای تبدیل string به AdType (با اعتبارسنجی)
// ============================================================
const toAdType = (value: string): AdType | null => {
  const validTypes: AdType[] = [
    "EmployerAd",
    "JobSeekerAd",
    "SellerAd",
    "DigitalAd",
  ];
  if (validTypes.includes(value as AdType)) {
    return value as AdType;
  }
  return null;
};

// ============================================================
// تابع کمکی برای دریافت نام مدل آگهی بر اساس نوع
// ============================================================
const getAdModelName = (adType: AdType): string | null => {
  switch (adType) {
    case "EmployerAd":
      return "employerAd";
    case "JobSeekerAd":
      return "jobSeekerAd";
    case "SellerAd":
      return "sellerAd";
    case "DigitalAd":
      return "digitalAd";
    default:
      return null;
  }
};

// ============================================================
// 1️⃣ اضافه یا حذف مارک (با احراز هویت و اعتبارسنجی)
// ============================================================
export const toggleMark = async (req: Request, res: Response) => {
  const adId = toStr(req.params.adId);
  const adTypeStr = toStr(req.body.adType);
  const userId = (req as any).user?.id;

  try {
    // اعتبارسنجی پارامترها
    if (!userId || !adTypeStr) {
      return res.status(400).json({ error: "پارامترهای لازم ارسال نشده" });
    }

    const adType = toAdType(adTypeStr);
    if (!adType) {
      return res.status(400).json({ error: "نوع آگهی معتبر نیست" });
    }

    // بررسی وجود مدل مناسب
    const modelName = getAdModelName(adType);
    if (!modelName) {
      return res.status(400).json({ error: "نوع آگهی پشتیبانی نمی‌شود" });
    }

    // بررسی وجود آگهی در دیتابیس
    let adExists = false;
    try {
      // @ts-ignore - Prisma dynamic model access
      const found = await prisma[modelName].findUnique({
        where: { id: adId },
      });
      if (found) adExists = true;
    } catch (err) {
      return res.status(400).json({ error: "شناسه آگهی نامعتبر است" });
    }

    if (!adExists) {
      return res.status(404).json({ error: "آگهی مورد نظر یافت نشد" });
    }

    // بررسی نشان قبلی
    const existing = await prisma.adMark.findFirst({
      where: {
        userId,
        adId,
        adType: adType as AdType, // تبدیل به enum
      },
    });

    if (existing) {
      // حذف نشان
      await prisma.adMark.delete({
        where: { id: existing.id },
      });
      return res.json({ marked: false });
    }

    // ایجاد نشان جدید
    const newMark = await prisma.adMark.create({
      data: {
        userId,
        adId,
        adType: adType as AdType,
      },
    });

    res.json({ marked: true, markId: newMark.id });
  } catch (err) {
    console.error("❌ خطا در toggleMark:", err);
    res.status(500).json({ error: "خطا در سرور" });
  }
};

// ============================================================
// 2️⃣ دریافت نشان‌شده‌های کاربر بر اساس نوع آگهی
// ============================================================
export const getMarkedAds = async (req: Request, res: Response) => {
  const adTypeStr = toStr(req.params.adType);
  const userId = (req as any).user?.id;

  try {
    if (!userId) {
      return res.status(401).json({ error: "احراز هویت نشده" });
    }

    const adType = toAdType(adTypeStr);
    if (!adType) {
      return res.status(400).json({ error: "نوع آگهی معتبر نیست" });
    }

    // دریافت نشان‌ها از دیتابیس
    const marks = await prisma.adMark.findMany({
      where: {
        userId,
        adType: adType as AdType,
      },
    });

    // استخراج adIdها
    const adIds = marks.map((m) => m.adId).filter((id) => id && id.length > 0);

    let ads: any[] = [];
    const modelName = getAdModelName(adType);
    if (!modelName) {
      return res.status(400).json({ error: "نوع آگهی پشتیبانی نمی‌شود" });
    }

    // اگر آگهی‌ای وجود داشت، آنها را از دیتابیس دریافت کن
    if (adIds.length > 0) {
      try {
        // @ts-ignore
        ads = await prisma[modelName].findMany({
          where: {
            id: { in: adIds },
          },
        });
      } catch (err) {
        ads = [];
      }
    }

    // ساخت پاسخ نهایی
    const response = marks.map((mark) => {
      const ad = ads.find((a: any) => String(a.id) === String(mark.adId));
      return {
        markId: mark.id,
        adType: mark.adType,
        ad: ad || null,
      };
    });

    res.json({ success: true, marks: response });
  } catch (err) {
    console.error("❌ خطا در getMarkedAds:", err);
    res.status(500).json({ error: "خطا در گرفتن نشان شده‌ها" });
  }
};

// ============================================================
// 3️⃣ دریافت همه‌ی نشان‌شده‌های کاربر (بدون فیلتر نوع)
// ============================================================
export const getAllMarkedAds = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "احراز هویت نشده" });
    }

    // دریافت همه نشان‌های کاربر
    const marks = await prisma.adMark.findMany({
      where: { userId },
    });

    // برای هر نشان، آگهی مربوطه را پیدا کن
    const populatedMarks = await Promise.all(
      marks.map(async (mark) => {
        const adType = mark.adType as AdType;
        const modelName = getAdModelName(adType);
        if (!modelName) return null;

        let ad = null;
        try {
          // @ts-ignore
          ad = await prisma[modelName].findUnique({
            where: { id: mark.adId },
          });
        } catch (err) {
          return null;
        }

        return ad ? { markId: mark.id, adType: mark.adType, ad } : null;
      }),
    );

    // حذف آیتم‌های null از خروجی
    const filteredMarks = populatedMarks.filter((m) => m !== null);

    res.status(200).json({
      success: true,
      marks: filteredMarks,
    });
  } catch (err) {
    console.error("❌ خطا در getAllMarkedAds:", err);
    res.status(500).json({
      success: false,
      message: "خطا در گرفتن نشان شده‌ها",
    });
  }
};

// ============================================================
// 4️⃣ بررسی اینکه یک آگهی نشان شده است یا نه
// ============================================================
export const isAdMarked = async (req: Request, res: Response) => {
  const adId = toStr(req.params.id);
  const adTypeStr = toStr(req.query.adType);
  const userId = (req as any).user?.id;

  try {
    if (!userId || !adTypeStr) {
      return res.json({ marked: false });
    }

    const adType = toAdType(adTypeStr);
    if (!adType) {
      return res.json({ marked: false });
    }

    const found = await prisma.adMark.findFirst({
      where: {
        userId,
        adId,
        adType: adType as AdType,
      },
    });

    return res.json({ marked: !!found });
  } catch (err) {
    console.error("❌ خطا در isAdMarked:", err);
    return res.status(500).json({ marked: false });
  }
};

// ============================================================
// 5️⃣ بررسی گروهی (Batch) نشان‌گذاری چند آگهی
// ============================================================
export const batchIsMarked = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { items } = req.body;

  // اعتبارسنجی ورودی
  if (!userId) {
    return res.status(401).json({ error: "احراز هویت نشده" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "آیتم‌های مورد نظر ارسال نشده‌اند" });
  }

  try {
    // ساخت شرط‌های جستجو برای هر آیتم (با اعتبارسنجی adType)
    const validItems = items
      .map((item: { adId: string; adType: string }) => {
        const adType = toAdType(item.adType);
        if (!adType) return null;
        return {
          userId,
          adId: item.adId,
          adType: adType as AdType,
        };
      })
      .filter((item: any) => item !== null);

    if (validItems.length === 0) {
      return res.status(400).json({ error: "هیچ آیتم معتبری یافت نشد" });
    }

    // جستجوی گروهی با OR
    const marks = await prisma.adMark.findMany({
      where: {
        OR: validItems,
      },
    });

    // ساخت Map برای جستجوی سریع
    const markMap = new Map<string, boolean>();
    marks.forEach((mark) => {
      const key = `${mark.adId}_${mark.adType}`;
      markMap.set(key, true);
    });

    // ساخت پاسخ برای هر آیتم
    const results = items.map((item: { adId: string; adType: string }) => ({
      adId: item.adId,
      marked: markMap.has(`${item.adId}_${item.adType}`),
    }));

    res.json({ results });
  } catch (err) {
    console.error("❌ خطا در batchIsMarked:", err);
    res.status(500).json({ error: "خطا در بررسی گروهی نشان‌گذاری" });
  }
};
