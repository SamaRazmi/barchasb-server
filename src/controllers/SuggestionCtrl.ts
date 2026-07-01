import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AdType } from "@prisma/client";

// ============================================================
// توابع کمکی
// ============================================================
const toStr = (value: any): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return String(value[0]);
  if (value && typeof value === "object") return String(value);
  return "";
};

function getAllAdTypes(): AdType[] {
  return [
    AdType.EmployerAd,
    AdType.JobSeekerAd,
    AdType.SellerAd,
    AdType.DigitalAd,
  ];
}

const ensureUserExists = async (userId: string, userData: any) => {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (existing) return;
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
// 1. دریافت لیست پیشنهادات ویژه (نسخه نهایی)
// ============================================================
export const getSuggestions = async (req: Request, res: Response) => {
  console.log("\n🚀 getSuggestions START");
  try {
    // ---- ۱. احراز هویت ----
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "احراز هویت نشده" });
    }
    await ensureUserExists(userId, (req as any).user);

    // ---- ۲. دریافت پارامترها ----
    const search = toStr(req.query.search);
    const count = parseInt(toStr(req.query.count)) || 10;
    const adTypesParam = toStr(req.query.adTypes);
    console.log("📥 پارامترها:", { search, count, adTypesParam });

    // ---- ۳. پردازش adTypes ----
    let requestedAdTypes: AdType[] = [];
    if (adTypesParam) {
      const types = adTypesParam.split(",").map((t) => t.trim() as AdType);
      requestedAdTypes = types.filter((t) => getAllAdTypes().includes(t));
    }
    console.log("🔍 نوع‌های درخواستی:", requestedAdTypes);

    // ---- ۴. دریافت اطلاعات کاربر ----
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

    // ---- ۵. بررسی سقف استفاده ----
    const totalViews = await prisma.suggestionView.count({ where: { userId } });
    const totalAllowed = user.suggestionPreference?.totalAllowed ?? 100;
    if (totalViews >= totalAllowed) {
      return res.status(403).json({
        error: "شما به سقف استفاده از پیشنهادات رسیده‌اید.",
        used: totalViews,
        remaining: 0,
      });
    }

    // ---- ۶. استخراج اطلاعات از آگهی‌های کاربر ----
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
      const allAds = [
        ...userAds.employer.map((a) => ({ ...a, adType: AdType.EmployerAd })),
        ...userAds.jobSeeker.map((a) => ({ ...a, adType: AdType.JobSeekerAd })),
        ...userAds.seller.map((a) => ({ ...a, adType: AdType.SellerAd })),
        ...userAds.digital.map((a) => ({ ...a, adType: AdType.DigitalAd })),
      ];
      const adTypesSet = new Set(allAds.map((a) => a.adType));
      targetAdTypes = Array.from(adTypesSet);
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
      targetAdTypes = getAllAdTypes();
    }

    // اعمال فیلتر نوع‌های درخواستی
    if (requestedAdTypes.length > 0) {
      targetAdTypes = targetAdTypes.filter((t) => requestedAdTypes.includes(t));
    }
    console.log("🎯 نوع‌های نهایی:", targetAdTypes);

    // ---- ۷. تولید پیشنهادات ----
    const suggestions: any[] = [];
    const remaining = Math.min(count, totalAllowed - totalViews);
    const perType = Math.ceil(remaining / targetAdTypes.length);

    // تابع شرط جستجوی پیشرفته (فقط فیلدهای معتبر)
    const buildSearchCondition = (adType: AdType, term: string) => {
      if (!term) return {};
      const or: any[] = [];
      switch (adType) {
        case AdType.EmployerAd:
          or.push(
            { title: { contains: term, mode: "insensitive" } },
            { name: { contains: term, mode: "insensitive" } },
            { companyName: { contains: term, mode: "insensitive" } },
          );
          break;
        case AdType.JobSeekerAd:
          or.push(
            { name: { contains: term, mode: "insensitive" } },
            { aboutMe: { contains: term, mode: "insensitive" } },
            { category: { contains: term, mode: "insensitive" } },
          );
          break;
        case AdType.SellerAd:
          or.push(
            { title: { contains: term, mode: "insensitive" } },
            { description: { contains: term, mode: "insensitive" } },
            { category: { contains: term, mode: "insensitive" } },
          );
          break;
        case AdType.DigitalAd:
          or.push(
            { title: { contains: term, mode: "insensitive" } },
            { description: { contains: term, mode: "insensitive" } },
          );
          break;
      }
      return or.length ? { OR: or } : {};
    };

    for (const adType of targetAdTypes) {
      // base where
      const where: any = {
        adStatus: "approved",
        expiresAt: { gt: new Date() },
      };

      // جستجو
      const searchCond = buildSearchCondition(adType, search);
      if (searchCond.OR) {
        where.OR = searchCond.OR;
      }

      // فیلتر مکانی (به جز DigitalAd)
      if (adType !== AdType.DigitalAd) {
        const locationOr = [
          { city: preferredCity },
          { state: preferredProvince },
        ];
        if (where.OR) {
          where.AND = [{ OR: locationOr }];
        } else {
          where.OR = locationOr;
        }
      }

      // فیلتر دسته‌بندی (برای SellerAd)
      if (
        hasAnyAd &&
        adType === AdType.SellerAd &&
        preferredCategories.length > 0
      ) {
        where.category = { in: preferredCategories };
      }

      const takeCount = perType * 4;
      let items: any[] = [];

      switch (adType) {
        case AdType.EmployerAd:
          items = await prisma.employerAd.findMany({
            where,
            take: takeCount,
            orderBy: { createdAt: "desc" },
            include: {
              ownerRelation: { select: { province: true, city: true } },
            },
          });
          break;
        case AdType.JobSeekerAd:
          items = await prisma.jobSeekerAd.findMany({
            where,
            take: takeCount,
            orderBy: { createdAt: "desc" },
            include: {
              ownerRelation: { select: { province: true, city: true } },
            },
          });
          break;
        case AdType.SellerAd:
          items = await prisma.sellerAd.findMany({
            where,
            take: takeCount,
            orderBy: { createdAt: "desc" },
            include: {
              ownerRelation: { select: { province: true, city: true } },
            },
          });
          break;
        case AdType.DigitalAd:
          items = await prisma.digitalAd.findMany({
            where,
            take: takeCount,
            orderBy: { createdAt: "desc" },
            include: {
              ownerRelation: { select: { province: true, city: true } },
            },
          });
          break;
      }

      // فیلتر owner (به‌صورت دستی)
      items = items.filter((item) => item.owner !== userId);

      // جستجوی مهارت‌ها (برای JobSeekerAd و DigitalAd)
      if (search) {
        if (adType === AdType.JobSeekerAd) {
          items = items.filter((ad) =>
            ad.skills?.some((s: string) => s.includes(search)),
          );
        }
        if (adType === AdType.DigitalAd) {
          items = items.filter((ad) => {
            const skills = (ad.requiredSkills as any[]) || [];
            return skills.some((s: any) => s.name?.includes(search));
          });
        }
      }

      // فیلتر شباهت (مهارت‌های ترجیحی)
      if (hasAnyAd && preferredSkills.length > 0) {
        if (adType === AdType.JobSeekerAd) {
          items = items.filter((ad) =>
            ad.skills?.some((s: string) => preferredSkills.includes(s)),
          );
        }
        if (adType === AdType.DigitalAd) {
          items = items.filter((ad) => {
            const skills = (ad.requiredSkills as any[]) || [];
            return skills.some((s: any) => preferredSkills.includes(s.name));
          });
        }
      }

      // فیلتر دسته‌بندی (برای EmployerAd)
      if (
        hasAnyAd &&
        adType === AdType.EmployerAd &&
        preferredCategories.length > 0
      ) {
        items = items.filter((ad) => {
          const cats = (ad.categories as any[]) || [];
          return cats.some((c: any) => preferredCategories.includes(c.name));
        });
      }

      // امتیازدهی
      const scored = items.map((ad) => {
        let score = 0;
        if (adType !== AdType.DigitalAd) {
          if (ad.city === preferredCity) score += 10;
          else if (ad.state === preferredProvince) score += 5;
        }
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

    // مرتب‌سازی نهایی و برش
    suggestions.sort((a, b) => (b.score || 0) - (a.score || 0));
    const finalSuggestions = suggestions.slice(0, remaining);

    // ---- ۸. ثبت نمایش‌ها (با حلقه و مدیریت خطا) ----
    let addedCount = 0;
    for (const s of finalSuggestions) {
      try {
        await prisma.suggestionView.create({
          data: {
            userId,
            adId: s.id,
            adType: s.adType,
          },
        });
        addedCount++;
      } catch (e) {
        // اگر تکراری باشد، نادیده می‌گیریم
        console.log(`⏭️ آگهی ${s.id} قبلاً ثبت شده بود`);
      }
    }
    console.log(`✅ ${addedCount} آگهی جدید ثبت شد`);

    // ---- ۹. دریافت دوباره آمار واقعی (برای دقت) ----
    const newTotalViews = await prisma.suggestionView.count({
      where: { userId },
    });
    const newRemaining = totalAllowed - newTotalViews;

    // ---- ۱۰. نرمالایز کردن خروجی مطابق با SuggestionItem ----
    const normalized = finalSuggestions.map((item) => ({
      id: item.id,
      title: item.title || item.name || "بدون عنوان",
      name: item.name,
      adType: item.adType,
      rating:
        typeof item.rating === "object" ? item.rating?.average : item.rating,
      skills: item.skills || item.requiredSkills?.map((s: any) => s.name) || [],
      image: item.images?.[0]?.url,
      createdAt: item.createdAt,
    }));

    console.log(`✅ ${normalized.length} پیشنهاد برگردانده شد`);
    return res.json({
      suggestions: normalized,
      used: newTotalViews,
      remaining: Math.max(0, newRemaining),
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
