import prisma from "../config/prisma";
import { AdType, AdStatus } from "@prisma/client";

interface GetAllFilters {
  page: number;
  limit: number;
  adType?: string[];
  category?: string;
  province?: string;
  city?: string;
  search?: string;
  minBudget?: string;
  maxBudget?: string;
}

interface GetUserFilters {
  userId: string;
  includeOthers: boolean;
  page: number;
  limit: number;
}

interface GetUserStatsParams {
  userId: string;
}

// ============================================
// 1. دریافت همه آگهی‌های عمومی (تایید شده و معتبر)
// ============================================
export const getAllAds = async (filters: GetAllFilters) => {
  const { page, limit, adType, category, province, city, search } = filters;
  const skip = (page - 1) * limit;

  // شرط پایه: Approved و غیرمنقضی
  const baseWhere = {
    adStatus: AdStatus.approved,
    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
  };

  const queries: Promise<any[]>[] = [];

  // DigitalAd
  if (!adType || adType.includes(AdType.DigitalAd)) {
    queries.push(
      prisma.digitalAd
        .findMany({
          where: {
            ...baseWhere,
            ...(category && { categories: { has: category } }),
            ...(province && { province }),
            ...(city && { city }),
            ...(search && {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }),
          },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        })
        .then((items) =>
          items.map((item) => ({ ...item, __adType: AdType.DigitalAd })),
        ),
    );
  }

  // EmployerAd
  if (!adType || adType.includes(AdType.EmployerAd)) {
    queries.push(
      prisma.employerAd
        .findMany({
          where: {
            ...baseWhere,
            ...(category && { categories: { has: category } }),
            ...(province && { state: province }),
            ...(city && { city }),
            ...(search && {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { name: { contains: search, mode: "insensitive" } },
                { companyName: { contains: search, mode: "insensitive" } },
              ],
            }),
          },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        })
        .then((items) =>
          items.map((item) => ({ ...item, __adType: AdType.EmployerAd })),
        ),
    );
  }

  // JobSeekerAd
  if (!adType || adType.includes(AdType.JobSeekerAd)) {
    queries.push(
      prisma.jobSeekerAd
        .findMany({
          where: {
            ...baseWhere,
            ...(category && { category }),
            ...(province && { state: province }),
            ...(city && { city }),
            ...(search && {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { aboutMe: { contains: search, mode: "insensitive" } },
                { skills: { has: search } },
              ],
            }),
          },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        })
        .then((items) =>
          items.map((item) => ({ ...item, __adType: AdType.JobSeekerAd })),
        ),
    );
  }

  // SellerAd
  if (!adType || adType.includes(AdType.SellerAd)) {
    queries.push(
      prisma.sellerAd
        .findMany({
          where: {
            ...baseWhere,
            ...(category && { category }),
            ...(province && { state: province }),
            ...(city && { city }),
            ...(search && {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }),
          },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        })
        .then((items) =>
          items.map((item) => ({ ...item, __adType: AdType.SellerAd })),
        ),
    );
  }

  const results = await Promise.all(queries);
  const allAds = results
    .flat()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const paginated = allAds.slice(0, limit);
  const total = await getTotalCount(filters);

  return {
    data: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

// ============================================
// 2. دریافت آگهی‌های کاربر + (اختیاری) آگهی‌های عمومی دیگران
// ============================================
export const getUserAds = async (params: GetUserFilters) => {
  const { userId, includeOthers, page, limit } = params;
  const skip = (page - 1) * limit;

  const baseWhere = {
    adStatus: AdStatus.approved,
    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
  };

  // کوئری‌های آگهی‌های کاربر
  const userQueries = [
    prisma.digitalAd
      .findMany({
        where: { ...baseWhere, owner: userId },
        orderBy: { createdAt: "desc" },
      })
      .then((items) =>
        items.map((item) => ({ ...item, __adType: AdType.DigitalAd })),
      ),
    prisma.employerAd
      .findMany({
        where: { ...baseWhere, owner: userId },
        orderBy: { createdAt: "desc" },
      })
      .then((items) =>
        items.map((item) => ({ ...item, __adType: AdType.EmployerAd })),
      ),
    prisma.jobSeekerAd
      .findMany({
        where: { ...baseWhere, owner: userId },
        orderBy: { createdAt: "desc" },
      })
      .then((items) =>
        items.map((item) => ({ ...item, __adType: AdType.JobSeekerAd })),
      ),
    prisma.sellerAd
      .findMany({
        where: { ...baseWhere, owner: userId },
        orderBy: { createdAt: "desc" },
      })
      .then((items) =>
        items.map((item) => ({ ...item, __adType: AdType.SellerAd })),
      ),
  ];

  const userResults = await Promise.all(userQueries);
  const userAds = userResults
    .flat()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  let publicAds: any[] = [];
  if (includeOthers) {
    const publicQueries = [
      prisma.digitalAd
        .findMany({
          where: { ...baseWhere, owner: { not: userId } },
          orderBy: { createdAt: "desc" },
        })
        .then((items) =>
          items.map((item) => ({ ...item, __adType: AdType.DigitalAd })),
        ),
      prisma.employerAd
        .findMany({
          where: { ...baseWhere, owner: { not: userId } },
          orderBy: { createdAt: "desc" },
        })
        .then((items) =>
          items.map((item) => ({ ...item, __adType: AdType.EmployerAd })),
        ),
      prisma.jobSeekerAd
        .findMany({
          where: { ...baseWhere, owner: { not: userId } },
          orderBy: { createdAt: "desc" },
        })
        .then((items) =>
          items.map((item) => ({ ...item, __adType: AdType.JobSeekerAd })),
        ),
      prisma.sellerAd
        .findMany({
          where: { ...baseWhere, owner: { not: userId } },
          orderBy: { createdAt: "desc" },
        })
        .then((items) =>
          items.map((item) => ({ ...item, __adType: AdType.SellerAd })),
        ),
    ];
    const publicResults = await Promise.all(publicQueries);
    publicAds = publicResults
      .flat()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  // صفحه‌بندی دستی
  const paginatedUser = userAds.slice(skip, skip + limit);
  const paginatedPublic = publicAds.slice(skip, skip + limit);

  return {
    userAds: {
      data: paginatedUser,
      total: userAds.length,
      page,
      limit,
    },
    ...(includeOthers && {
      publicAds: {
        data: paginatedPublic,
        total: publicAds.length,
        page,
        limit,
      },
    }),
  };
};

// ============================================
// 3. دریافت آمار آگهی‌های کاربر (تعداد کل و تعداد Approved)
// ============================================
export const getUserAdsStats = async (params: GetUserStatsParams) => {
  const { userId } = params;

  // شرط برای همه آگهی‌های کاربر (بدون فیلتر وضعیت)
  const allWhere = { owner: userId };

  // شرط فقط برای آگهی‌های تایید شده (approved)
  const approvedWhere = {
    ...allWhere,
    adStatus: AdStatus.approved,
  };

  // (اختیاری) اگر بخواهید تعداد فعال (approved + منقضی نشده) هم محاسبه کنید، می‌توانید این شرط را اضافه کنید:
  // const activeWhere = {
  //   ...approvedWhere,
  //   OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
  // };

  // کوئری‌های موازی برای شمارش
  const [
    totalDigital,
    totalEmployer,
    totalJobSeeker,
    totalSeller,
    approvedDigital,
    approvedEmployer,
    approvedJobSeeker,
    approvedSeller,
  ] = await Promise.all([
    prisma.digitalAd.count({ where: allWhere }),
    prisma.employerAd.count({ where: allWhere }),
    prisma.jobSeekerAd.count({ where: allWhere }),
    prisma.sellerAd.count({ where: allWhere }),
    prisma.digitalAd.count({ where: approvedWhere }),
    prisma.employerAd.count({ where: approvedWhere }),
    prisma.jobSeekerAd.count({ where: approvedWhere }),
    prisma.sellerAd.count({ where: approvedWhere }),
  ]);

  const totalAll = totalDigital + totalEmployer + totalJobSeeker + totalSeller;
  const totalApproved =
    approvedDigital + approvedEmployer + approvedJobSeeker + approvedSeller;

  return {
    totalAll, // تعداد کل آگهی‌های کاربر (همه وضعیت‌ها)
    totalApproved, // تعداد آگهی‌های تایید شده (approved) بدون در نظر گرفتن انقضا
    // در صورت نیاز می‌توانید totalActive را هم اضافه کنید
    breakdown: {
      digital: {
        all: totalDigital,
        approved: approvedDigital,
      },
      employer: {
        all: totalEmployer,
        approved: approvedEmployer,
      },
      jobSeeker: {
        all: totalJobSeeker,
        approved: approvedJobSeeker,
      },
      seller: {
        all: totalSeller,
        approved: approvedSeller,
      },
    },
  };
};

// ============================================
// تابع کمکی برای شمارش کل (برای getAllAds)
// ============================================
async function getTotalCount(filters: GetAllFilters): Promise<number> {
  const { adType, category, province, city, search } = filters;

  const baseWhere = {
    adStatus: AdStatus.approved,
    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
  };

  let total = 0;

  if (!adType || adType.includes(AdType.DigitalAd)) {
    total += await prisma.digitalAd.count({
      where: {
        ...baseWhere,
        ...(category && { categories: { has: category } }),
        ...(province && { province }),
        ...(city && { city }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
    });
  }

  if (!adType || adType.includes(AdType.EmployerAd)) {
    total += await prisma.employerAd.count({
      where: {
        ...baseWhere,
        ...(category && { categories: { has: category } }),
        ...(province && { state: province }),
        ...(city && { city }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { name: { contains: search, mode: "insensitive" } },
            { companyName: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
    });
  }

  if (!adType || adType.includes(AdType.JobSeekerAd)) {
    total += await prisma.jobSeekerAd.count({
      where: {
        ...baseWhere,
        ...(category && { category }),
        ...(province && { state: province }),
        ...(city && { city }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { aboutMe: { contains: search, mode: "insensitive" } },
            { skills: { has: search } },
          ],
        }),
      },
    });
  }

  if (!adType || adType.includes(AdType.SellerAd)) {
    total += await prisma.sellerAd.count({
      where: {
        ...baseWhere,
        ...(category && { category }),
        ...(province && { state: province }),
        ...(city && { city }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
    });
  }

  return total;
}
