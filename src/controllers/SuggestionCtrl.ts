import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AdType, UserRole } from "@prisma/client";

// تابع کمکی برای تبدیل params به string (سازگار با انواع مختلف)
const toStr = (value: any): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return String(value[0]);
  if (value && typeof value === "object") return String(value);
  return "";
};

// ============================================================
// 1. دریافت لیست پیشنهادات ویژه (با فیلتر جستجو و تعداد)
// ============================================================
export const getSuggestions = async (req: Request, res: Response) => {
  console.log("\n🚀 getSuggestions START");
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "احراز هویت نشده" });
    }

    const search = toStr(req.query.search);
    const count = parseInt(toStr(req.query.count)) || 10;

    // 1. دریافت اطلاعات کاربر و تنظیمات
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userProfiles: true,
        suggestionPreference: true,
        employerAds: { take: 1 },
        jobSeekerAds: { take: 1 },
        sellerAds: { take: 1 },
        digitalAds: { take: 1 },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "کاربر یافت نشد" });
    }

    // 2. بررسی سقف استفاده
    const totalViews = await prisma.suggestionView.count({
      where: { userId },
    });
    const totalAllowed = user.suggestionPreference?.totalAllowed ?? 100;
    if (totalViews >= totalAllowed) {
      return res.status(403).json({
        error: "شما به سقف استفاده از پیشنهادات رسیده‌اید.",
        used: totalViews,
        remaining: 0,
      });
    }

    // 3. تعیین نوع آگهی‌های هدف
    let targetAdTypes: AdType[] = [];
    if (user.suggestionPreference?.preferredAdTypes?.length) {
      targetAdTypes = user.suggestionPreference.preferredAdTypes;
    } else {
      switch (user.role) {
        case UserRole.EMPLOYER:
          targetAdTypes = [
            AdType.EmployerAd,
            AdType.JobSeekerAd,
            AdType.DigitalAd,
          ];
          break;
        case UserRole.JOB_SEEKER:
          targetAdTypes = [
            AdType.JobSeekerAd,
            AdType.EmployerAd,
            AdType.DigitalAd,
          ];
          break;
        case UserRole.SELLER:
          targetAdTypes = [AdType.SellerAd, AdType.DigitalAd];
          break;
        default:
          targetAdTypes = [
            AdType.DigitalAd,
            AdType.SellerAd,
            AdType.EmployerAd,
            AdType.JobSeekerAd,
          ];
      }
    }

    // 4. دریافت آگهی‌ها
    const suggestions: any[] = [];
    const remaining = Math.min(count, totalAllowed - totalViews);
    const perType = Math.ceil(remaining / targetAdTypes.length);

    const searchFilter = (field: string) =>
      search ? { [field]: { contains: search, mode: "insensitive" } } : {};

    for (const adType of targetAdTypes) {
      let items: any[] = [];
      switch (adType) {
        case AdType.EmployerAd:
          items = await prisma.employerAd.findMany({
            where: {
              ...searchFilter("title"),
              adStatus: "approved",
              owner: { not: userId },
              expiresAt: { gt: new Date() },
            },
            take: perType,
            orderBy: { createdAt: "desc" },
            include: {
              ownerRelation: { select: { province: true, city: true } },
            },
          });
          suggestions.push(...items.map((ad) => ({ ...ad, adType })));
          break;
        case AdType.JobSeekerAd:
          items = await prisma.jobSeekerAd.findMany({
            where: {
              ...searchFilter("name"),
              adStatus: "approved",
              owner: { not: userId },
              expiresAt: { gt: new Date() },
            },
            take: perType,
            orderBy: { createdAt: "desc" },
            include: {
              ownerRelation: { select: { province: true, city: true } },
            },
          });
          suggestions.push(...items.map((ad) => ({ ...ad, adType })));
          break;
        case AdType.SellerAd:
          items = await prisma.sellerAd.findMany({
            where: {
              ...searchFilter("title"),
              adStatus: "approved",
              owner: { not: userId },
              expiresAt: { gt: new Date() },
            },
            take: perType,
            orderBy: { createdAt: "desc" },
            include: {
              ownerRelation: { select: { province: true, city: true } },
            },
          });
          suggestions.push(...items.map((ad) => ({ ...ad, adType })));
          break;
        case AdType.DigitalAd:
          items = await prisma.digitalAd.findMany({
            where: {
              ...searchFilter("title"),
              adStatus: "approved",
              owner: { not: userId },
              expiresAt: { gt: new Date() },
            },
            take: perType,
            orderBy: { createdAt: "desc" },
            include: {
              ownerRelation: { select: { province: true, city: true } },
            },
          });
          suggestions.push(...items.map((ad) => ({ ...ad, adType })));
          break;
      }
    }

    // 5. مرتب‌سازی و محدود کردن
    suggestions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const finalSuggestions = suggestions.slice(0, remaining);

    // 6. ثبت نمایش‌ها
    await prisma.suggestionView.createMany({
      data: finalSuggestions.map((s) => ({
        userId,
        adId: s.id,
        adType: s.adType,
      })),
      skipDuplicates: true,
    });

    console.log(`✅ ${finalSuggestions.length} suggestion(s) returned`);
    return res.json({
      suggestions: finalSuggestions,
      used: totalViews + finalSuggestions.length,
      remaining: totalAllowed - (totalViews + finalSuggestions.length),
    });
  } catch (err: any) {
    console.error("❌ ERROR getSuggestions:", err);
    return res.status(500).json({ error: "خطای سرور، لطفا دوباره تلاش کنید." });
  }
};

// ============================================================
// 2. دریافت تنظیمات پیشنهادات کاربر
// ============================================================
export const getSuggestionPreference = async (req: Request, res: Response) => {
  console.log("\n🚀 getSuggestionPreference START");
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "احراز هویت نشده" });
    }

    let preference = await prisma.userSuggestionPreference.findUnique({
      where: { userId },
    });

    if (!preference) {
      // ایجاد پیش‌فرض در صورت نبودن
      preference = await prisma.userSuggestionPreference.create({
        data: { userId },
      });
    }

    console.log("✅ Preference fetched/created");
    return res.json(preference);
  } catch (err: any) {
    console.error("❌ ERROR getSuggestionPreference:", err);
    return res.status(500).json({ error: "خطای سرور، لطفا دوباره تلاش کنید." });
  }
};

// ============================================================
// 3. به‌روزرسانی تنظیمات پیشنهادات کاربر
// ============================================================
export const updateSuggestionPreference = async (
  req: Request,
  res: Response,
) => {
  console.log("\n🚀 updateSuggestionPreference START");
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "احراز هویت نشده" });
    }

    const {
      totalAllowed,
      resetPeriod,
      preferredAdTypes,
      preferredCategories,
      filterWeights,
      isActive,
    } = req.body;

    const updated = await prisma.userSuggestionPreference.update({
      where: { userId },
      data: {
        totalAllowed,
        resetPeriod,
        preferredAdTypes: preferredAdTypes as AdType[],
        preferredCategories,
        filterWeights,
        isActive,
      },
    });

    console.log("✅ Preference updated");
    return res.json(updated);
  } catch (err: any) {
    console.error("❌ ERROR updateSuggestionPreference:", err);
    return res.status(500).json({ error: "خطای سرور، لطفا دوباره تلاش کنید." });
  }
};

// ============================================================
// 4. دریافت آمار استفاده از پیشنهادات
// ============================================================
export const getSuggestionStats = async (req: Request, res: Response) => {
  console.log("\n🚀 getSuggestionStats START");
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "احراز هویت نشده" });
    }

    const [totalViews, preference] = await Promise.all([
      prisma.suggestionView.count({ where: { userId } }),
      prisma.userSuggestionPreference.findUnique({ where: { userId } }),
    ]);

    const totalAllowed = preference?.totalAllowed ?? 100;

    console.log(
      `✅ Stats: used=${totalViews}, remaining=${totalAllowed - totalViews}`,
    );
    return res.json({
      used: totalViews,
      remaining: Math.max(0, totalAllowed - totalViews),
      total: totalAllowed,
    });
  } catch (err: any) {
    console.error("❌ ERROR getSuggestionStats:", err);
    return res.status(500).json({ error: "خطای سرور، لطفا دوباره تلاش کنید." });
  }
};

// ============================================================
// 5. جستجوی هوشمند (Autocomplete)
// ============================================================
export const autocompleteSuggestions = async (req: Request, res: Response) => {
  console.log("\n🚀 autocompleteSuggestions START");
  try {
    const query = toStr(req.query.query);
    const limit = parseInt(toStr(req.query.limit)) || 10;

    if (query.length < 2) {
      return res.json([]);
    }

    const results = await prisma.$queryRaw`
      (SELECT id, title, 'EmployerAd' as "adType" FROM "EmployerAd" WHERE title ILIKE ${`%${query}%`} AND "adStatus" = 'approved' AND "expiresAt" > NOW() LIMIT ${limit})
      UNION
      (SELECT id, name as title, 'JobSeekerAd' as "adType" FROM "JobSeekerAd" WHERE name ILIKE ${`%${query}%`} AND "adStatus" = 'approved' AND "expiresAt" > NOW() LIMIT ${limit})
      UNION
      (SELECT id, title, 'SellerAd' as "adType" FROM "SellerAd" WHERE title ILIKE ${`%${query}%`} AND "adStatus" = 'approved' AND "expiresAt" > NOW() LIMIT ${limit})
      UNION
      (SELECT id, title, 'DigitalAd' as "adType" FROM "DigitalAd" WHERE title ILIKE ${`%${query}%`} AND "adStatus" = 'approved' AND "expiresAt" > NOW() LIMIT ${limit})
      LIMIT ${limit}
    `;

    console.log(`✅ ${(results as any[]).length} autocomplete results`);
    return res.json(results);
  } catch (err: any) {
    console.error("❌ ERROR autocompleteSuggestions:", err);
    return res.status(500).json({ error: "خطای سرور، لطفا دوباره تلاش کنید." });
  }
};

// ============================================================
// 6. (اختیاری) ثبت دستی یک نمایش
// ============================================================
export const addSuggestionView = async (req: Request, res: Response) => {
  console.log("\n🚀 addSuggestionView START");
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "احراز هویت نشده" });
    }

    const { adId, adType } = req.body;
    if (!adId || !adType) {
      return res.status(400).json({ error: "adId و adType الزامی هستند" });
    }

    await prisma.suggestionView.create({
      data: {
        userId,
        adId,
        adType: adType as AdType,
      },
    });

    console.log("✅ View recorded manually");
    return res.status(201).json({ message: "نمایش با موفقیت ثبت شد" });
  } catch (err: any) {
    console.error("❌ ERROR addSuggestionView:", err);
    return res.status(500).json({ error: "خطای سرور، لطفا دوباره تلاش کنید." });
  }
};

// ============================================================
// export default آبجکت تمام توابع (مطابق با نمونه‌های موجود)
// ============================================================
const SuggestionCtrl = {
  getSuggestions,
  getSuggestionPreference,
  updateSuggestionPreference,
  getSuggestionStats,
  autocompleteSuggestions,
  addSuggestionView,
};

export default SuggestionCtrl;
