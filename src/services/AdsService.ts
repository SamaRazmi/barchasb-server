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

  // صفحه‌بندی دستی (می‌توان از همان ابتدا limit اعمال کرد ولی برای سادگی)
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

// ----- تابع جدید برای دریافت آمار آگهی‌های کاربر -----
export const getUserAdsStats = async (params: GetUserStatsParams) => {
  const { userId } = params;

  // شرط پایه برای آگهی‌های فعال (approved و غیرمنقضی)
  const activeWhere = {
    adStatus: AdStatus.approved,
    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    owner: userId,
  };

  // شرط برای همه آگهی‌های کاربر (بدون در نظر گرفتن وضعیت)
  const allWhere = { owner: userId };

  // کوئری‌های موازی برای شمارش
  const [
    totalDigital,
    totalEmployer,
    totalJobSeeker,
    totalSeller,
    activeDigital,
    activeEmployer,
    activeJobSeeker,
    activeSeller,
  ] = await Promise.all([
    prisma.digitalAd.count({ where: allWhere }),
    prisma.employerAd.count({ where: allWhere }),
    prisma.jobSeekerAd.count({ where: allWhere }),
    prisma.sellerAd.count({ where: allWhere }),
    prisma.digitalAd.count({ where: activeWhere }),
    prisma.employerAd.count({ where: activeWhere }),
    prisma.jobSeekerAd.count({ where: activeWhere }),
    prisma.sellerAd.count({ where: activeWhere }),
  ]);

  const totalAll = totalDigital + totalEmployer + totalJobSeeker + totalSeller;
  const totalActive =
    activeDigital + activeEmployer + activeJobSeeker + activeSeller;

  return {
    totalAll,
    totalActive,
    breakdown: {
      digital: { all: totalDigital, active: activeDigital },
      employer: { all: totalEmployer, active: activeEmployer },
      jobSeeker: { all: totalJobSeeker, active: activeJobSeeker },
      seller: { all: totalSeller, active: activeSeller },
    },
  };
};
// ------------------------------------------------

// تابع کمکی برای شمارش کل (برای getAllAds)
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
