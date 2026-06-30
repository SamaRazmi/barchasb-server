// src/controllers/SuggestionCtrl.ts
import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AdType } from "@prisma/client";

// ============================================================
// توابع کمکی
// ============================================================

// تبدیل params به string
const toStr = (value: any): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return String(value[0]);
  if (value && typeof value === "object") return String(value);
  return "";
};

// دریافت همه نوع‌های آگهی
function getAllAdTypes(): AdType[] {
  return [
    AdType.EmployerAd,
    AdType.JobSeekerAd,
    AdType.SellerAd,
    AdType.DigitalAd,
  ];
}

// اطمینان از وجود کاربر در دیتابیس (برای جلوگیری از خطای کلید خارجی)
const ensureUserExists = async (userId: string, userData: any) => {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (existing) return;

  // اگر nationalCode وجود نداشت، از userId استفاده کن
  const nationalCode = userData?.nationalCode || `USER_${userId}`;

  await prisma.user.create({
    data: {
      id: userId,
      name: userData?.name || "کاربر",
      lastName: userData?.lastName || "",
      phone: userData?.phone || "",
      password: userData?.password || "default_password_123",
      nationalCode,
      birthDate: userData?.birthDate || "2000-01-01",
      gender: userData?.gender || "male",
      province: userData?.province || "تهران",
      city: userData?.city || "تهران",
      joinedAt: new Date().toISOString(),
      acceptTerms: true,
      role: "USER",
    },
  });
};

// ============================================================
// 1. دریافت لیست پیشنهادات ویژه (بر اساس آگهی‌های ثبت‌شده کاربر)
// ============================================================
export const getSuggestions = async (req: Request, res: Response) => {
  console.log("\n🚀 getSuggestions START");
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "احراز هویت نشده" });
    }

    // اطمینان از وجود کاربر
    await ensureUserExists(userId, (req as any).user);

    const search = toStr(req.query.search);
    const count = parseInt(toStr(req.query.count)) || 10;

    // 1. دریافت اطلاعات کاربر و آگهی‌های ثبت‌شده توسط او
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userProfiles: true,
        suggestionPreference: true,
        employerAds: true,
        jobSeekerAds: true,
        sellerAds: true,
        digitalAds: true,
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

    // 3. استخراج اطلاعات از آگهی‌های ثبت‌شده کاربر
    const userAds = {
      employer: user.employerAds || [],
      jobSeeker: user.jobSeekerAds || [],
      seller: user.sellerAds || [],
      digital: user.digitalAds || [],
    };

    const hasAnyAd = Object.values(userAds).some((arr) => arr.length > 0);

    let targetAdTypes: AdType[] = [];
    const preferredProvince = user.province;
    const preferredCity = user.city;
    let preferredSkills: string[] = [];
    let preferredCategories: string[] = [];

    if (hasAnyAd) {
      // جمع‌آوری اطلاعات از تمام آگهی‌های کاربر
      const allAds = [
        ...userAds.employer.map((a) => ({ ...a, adType: AdType.EmployerAd })),
        ...userAds.jobSeeker.map((a) => ({ ...a, adType: AdType.JobSeekerAd })),
        ...userAds.seller.map((a) => ({ ...a, adType: AdType.SellerAd })),
        ...userAds.digital.map((a) => ({ ...a, adType: AdType.DigitalAd })),
      ];

      // استخراج نوع‌های آگهی
      const adTypesSet = new Set(allAds.map((a) => a.adType));
      targetAdTypes = Array.from(adTypesSet);

      // استخراج مهارت‌ها و دسته‌بندی‌ها
      const allSkills: string[] = [];
      const allCategories: string[] = [];

      for (const ad of allAds) {
        if (ad.adType === AdType.JobSeekerAd && ad.skills) {
          allSkills.push(...ad.skills);
        }
        if (ad.adType === AdType.DigitalAd && ad.requiredSkills) {
          const skills = ad.requiredSkills as any[];
          allSkills.push(...skills.map((s) => s.name));
        }
        if (ad.adType === AdType.EmployerAd && ad.categories) {
          const cats = ad.categories as any[];
          allCategories.push(...cats.map((c) => c.name));
        }
        if (ad.adType === AdType.SellerAd && ad.category) {
          allCategories.push(ad.category);
        }
        if (ad.adType === AdType.JobSeekerAd && ad.category) {
          allCategories.push(ad.category);
        }
      }

      preferredSkills = [...new Set(allSkills)];
      preferredCategories = [...new Set(allCategories)];

      if (targetAdTypes.length === 0) {
        targetAdTypes = getAllAdTypes();
      }
    } else {
      // کاربر هیچ آگهی‌ای ندارد → همه نوع‌ها با اولویت استان/شهر
      targetAdTypes = getAllAdTypes();
    }

    // 4. دریافت آگهی‌های مشابه با اولویت
    const suggestions: any[] = [];
    const remaining = Math.min(count, totalAllowed - totalViews);
    const perType = Math.ceil(remaining / targetAdTypes.length);

    const searchFilter = (field: string) =>
      search ? { [field]: { contains: search, mode: "insensitive" } } : {};

    for (const adType of targetAdTypes) {
      let items: any[] = [];
      const baseWhere: any = {
        adStatus: "approved",
        owner: { not: userId },
        expiresAt: { gt: new Date() },
      };

      // فیلتر جستجو
      let searchWhere = {};
      switch (adType) {
        case AdType.EmployerAd:
          searchWhere = searchFilter("title");
          break;
        case AdType.JobSeekerAd:
          searchWhere = searchFilter("name");
          break;
        case AdType.SellerAd:
          searchWhere = searchFilter("title");
          break;
        case AdType.DigitalAd:
          searchWhere = searchFilter("title");
          break;
      }

      // فیلتر مکانی: اولویت شهر، سپس استان، سپس بقیه
      const locationFilter = {
        OR: [
          { city: preferredCity },
          { state: preferredProvince },
          { state: { not: null } },
        ],
      };

      // فیلترهای شباهت (مهارت‌ها و دسته‌بندی‌ها)
      let similarityFilter = {};
      if (hasAnyAd) {
        if (adType === AdType.EmployerAd && preferredCategories.length > 0) {
          // برای EmployerAd، categories از نوع Json[] است – فعلاً ساده می‌گیریم
          // در عمل بهتر است با queryRaw یا با فیلتر در حافظه انجام شود
          // برای سادگی، از none استفاده می‌کنیم تا خطا ندهد، اما عملاً فیلتر نمی‌شود
          // می‌توانیم در مرحله بعد امتیازدهی کنیم
          similarityFilter = {};
        } else if (
          adType === AdType.JobSeekerAd &&
          preferredSkills.length > 0
        ) {
          similarityFilter = {
            skills: { hasSome: preferredSkills },
          };
        } else if (
          adType === AdType.SellerAd &&
          preferredCategories.length > 0
        ) {
          similarityFilter = {
            category: { in: preferredCategories },
          };
        } else if (adType === AdType.DigitalAd && preferredSkills.length > 0) {
          // requiredSkills از نوع Json[] است – نمی‌توان مستقیماً hasSome استفاده کرد
          // بهتر است با queryRaw یا فیلتر در حافظه
          similarityFilter = {};
        }
      }

      const where = {
        ...baseWhere,
        ...searchWhere,
        ...locationFilter,
        ...similarityFilter,
      };

      switch (adType) {
        case AdType.EmployerAd:
          items = await prisma.employerAd.findMany({
            where,
            take: perType * 2,
            orderBy: { createdAt: "desc" },
            include: {
              ownerRelation: { select: { province: true, city: true } },
            },
          });
          break;
        case AdType.JobSeekerAd:
          items = await prisma.jobSeekerAd.findMany({
            where,
            take: perType * 2,
            orderBy: { createdAt: "desc" },
            include: {
              ownerRelation: { select: { province: true, city: true } },
            },
          });
          break;
        case AdType.SellerAd:
          items = await prisma.sellerAd.findMany({
            where,
            take: perType * 2,
            orderBy: { createdAt: "desc" },
            include: {
              ownerRelation: { select: { province: true, city: true } },
            },
          });
          break;
        case AdType.DigitalAd:
          items = await prisma.digitalAd.findMany({
            where,
            take: perType * 2,
            orderBy: { createdAt: "desc" },
            include: {
              ownerRelation: { select: { province: true, city: true } },
            },
          });
          break;
      }

      // امتیازدهی
      const scored = items.map((ad) => {
        let score = 0;
        if (ad.city === preferredCity) score += 10;
        else if (ad.state === preferredProvince) score += 5;

        // امتیاز مهارت
        if (
          adType === AdType.JobSeekerAd &&
          ad.skills &&
          preferredSkills.length
        ) {
          const common = ad.skills.filter((s: string) =>
            preferredSkills.includes(s),
          ).length;
          score += common * 3;
        }
        if (
          adType === AdType.DigitalAd &&
          ad.requiredSkills &&
          preferredSkills.length
        ) {
          const skills = ad.requiredSkills as any[];
          const common = skills.filter((s: any) =>
            preferredSkills.includes(s.name),
          ).length;
          score += common * 3;
        }
        // امتیاز دسته‌بندی (برای EmployerAd و SellerAd می‌توان اضافه کرد)
        if (
          adType === AdType.SellerAd &&
          ad.category &&
          preferredCategories.includes(ad.category)
        ) {
          score += 3;
        }
        if (
          adType === AdType.EmployerAd &&
          ad.categories &&
          preferredCategories.length
        ) {
          const cats = ad.categories as any[];
          const common = cats.filter((c: any) =>
            preferredCategories.includes(c.name),
          ).length;
          score += common * 3;
        }
        return { ...ad, score };
      });

      scored.sort((a, b) => b.score - a.score);
      suggestions.push(
        ...scored.slice(0, perType).map((ad) => ({ ...ad, adType })),
      );
    }

    // 5. مرتب‌سازی نهایی بر اساس امتیاز
    suggestions.sort((a, b) => (b.score || 0) - (a.score || 0));
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

    // اطمینان از وجود کاربر
    await ensureUserExists(userId, (req as any).user);

    let preference = await prisma.userSuggestionPreference.findUnique({
      where: { userId },
    });

    if (!preference) {
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

    await ensureUserExists(userId, (req as any).user);

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

    await ensureUserExists(userId, (req as any).user);

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
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "احراز هویت نشده" });
    }

    await ensureUserExists(userId, (req as any).user);

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

    await ensureUserExists(userId, (req as any).user);

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
// export default
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
