import prisma from "../../config/prisma";
import { toJalaliShort, toJalali, toJalaliDate } from "../../utils/dateFormatter";
import { Prisma } from "@prisma/client";

type AdModel = typeof prisma.digitalAd |
  typeof prisma.employerAd |
  typeof prisma.jobSeekerAd |
  typeof prisma.sellerAd;

interface AdModelWithCommonMethods {
  findMany: (args: {
    where?: any;
    select?: any;
    skip?: number;
    take?: number;
    orderBy?: any;
  }) => Prisma.PrismaPromise<any[]>;
  count: (args: { where?: any }) => Prisma.PrismaPromise<number>;
}

const adModels: AdModelWithCommonMethods[] = [
  prisma.digitalAd as unknown as AdModelWithCommonMethods,
  prisma.employerAd as unknown as AdModelWithCommonMethods,
  prisma.jobSeekerAd as unknown as AdModelWithCommonMethods,
  prisma.sellerAd as unknown as AdModelWithCommonMethods,
];

export async function getUserStats() {
  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const totalUsers = await prisma.user.count();
  const onlineUsers = await prisma.user.count({
    where: { online: true },
  });

  const activeUsers = await getActiveUsersCount(oneMonthAgo);
  const inactiveUsers = totalUsers - activeUsers;

  return {
    totalUsers,
    onlineUsers,
    activeUsers,
    inactiveUsers,
  };
}

interface GetUsersListInput {
  search?: string;
  page?: number;
  limit?: number;
}

export async function getUsersList(input: GetUsersListInput) {
  const { search, page = 1, limit = 10 } = input;
  const skip = (page - 1) * limit;

  let where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { username: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { nationalCode: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        phone: true,
        nationalCode: true,
        province: true,
        city: true,
        online: true,
        lastSeen: true,
        joinedAt: true,
        userProfiles: {
          select: {
            profileImage: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const userIds = users.map((u) => u.id);
  const adCounts = await getUserAdCounts(userIds);

  const formattedUsers = users.map((user) => {
    const profileImage = user.userProfiles[0]?.profileImage || null;
    const platforms = ["MAIN"];

    return {
      id: user.id,
      fullName: `${user.name || ''} ${user.lastName || ''}`.trim(),
      username: user.username,
      phone: user.phone,
      nationalCode: user.nationalCode,
      province: user.province,
      city: user.city,
      online: user.online,
      lastSeen: user.lastSeen ? toJalaliShort(user.lastSeen) : null,
      profileImage,
      platforms,
      adCount: adCounts[user.id] || 0,
      joinedAt: user.joinedAt,
    };
  });

  return {
    data: formattedUsers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getActiveUsersCount(since: Date): Promise<number> {
  const userAdCounts: Record<string, number> = {};

  await Promise.all(
    adModels.map(async (model) => {
      const ads = await model.findMany({
        where: {
          createdAt: { gte: since },
        },
        select: {
          owner: true,
        },
      });

      for (const ad of ads) {
        const ownerId = ad.owner;
        userAdCounts[ownerId] = (userAdCounts[ownerId] || 0) + 1;
      }
    })
  );

  let activeCount = 0;
  for (const count of Object.values(userAdCounts)) {
    if (count > 3) activeCount++;
  }

  return activeCount;
}

async function getUserAdCounts(userIds: string[]): Promise<Record<string, number>> {
  if (userIds.length === 0) return {};

  const result: Record<string, number> = {};

  for (const userId of userIds) {
    result[userId] = 0;
  }

  await Promise.all(
    adModels.map(async (model) => {
      const ads = await model.findMany({
        where: {
          owner: { in: userIds },
        },
        select: {
          owner: true,
        },
      });

      for (const ad of ads) {
        const ownerId = ad.owner;
        if (result[ownerId] !== undefined) {
          result[ownerId] += 1;
        }
      }
    })
  );

  return result;
}

export async function getUserProfileById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userProfiles: true,
    },
  });

  if (!user) {
    return null;
  }

  const profile = user.userProfiles?.[0];

  return {
    id: user.id,
    username: user.username,
    phone: user.phone,
    email: user.email,
    nationalCode: user.nationalCode,
    fullName: `${user.name || ''} ${user.lastName || ''}`.trim(),
    province: user.province,
    city: user.city,
    birthDate: user.birthDate,
    educationLevel: profile?.educationLevel || null,
    address: profile?.address || null,
    aboutMe: profile?.aboutMe || null,
    interests: profile?.interests || [],
    skills: profile?.skills || [],
    resumeFile: profile?.resumeFile || null,
    portfolioFiles: profile?.portfolioFiles || [],
  };
}

export async function getUserAds(userId: string) {
  const [digital, employer, jobSeeker, seller] = await Promise.all([
    prisma.digitalAd.findMany({
      where: { owner: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        province: true,
        city: true,
        person: true,
        adStatus: true,
        requestType: true,
        createdAt: true,
      },
    }),
    prisma.employerAd.findMany({
      where: { owner: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        name: true,
        categories: true,
        state: true,
        city: true,
        person: true,
        adStatus: true,
        cooperationType: true,
        createdAt: true,
      },
    }),
    prisma.jobSeekerAd.findMany({
      where: { owner: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        category: true,
        aboutMe: true,
        state: true,
        city: true,
        person: true,
        adStatus: true,
        createdAt: true,
      },
    }),
    prisma.sellerAd.findMany({
      where: { owner: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        state: true,
        city: true,
        person: true,
        adStatus: true,
        application: true,
        createdAt: true,
      },
    }),
  ]);

  const mapDigital = (ad: any) => ({
    id: ad.id,
    title: ad.title || '',
    category: null,
    description: ad.description || '',
    province: ad.province || ad.city || '',
    status: ad.adStatus,
    application: ad.requestType || '',
    adType: 'DigitalAd',
    person: ad.person,
    adStatus: ad.adStatus,
    _createdAt: ad.createdAt,
    createdAt: ad.createdAt ? toJalali(ad.createdAt) : null, 
  });

  const mapEmployer = (ad: any) => { 
    let category = '';
    if (ad.categories && Array.isArray(ad.categories) && ad.categories.length > 0) {
      const first = ad.categories[0];
      category = first.name || '';
      if (first.subCategories && first.subCategories.length > 0) {
        category += ' - ' + first.subCategories.join(', ');
      }
    }
    return {
      id: ad.id,
      title: ad.title || '',
      category,
      description: ad.name || '', 
      province: ad.state || ad.city || '',
      status: ad.adStatus,
      application: ad.cooperationType || '',
      adType: 'EmployerAd',
      person: ad.person,
      adStatus: ad.adStatus,
      _createdAt: ad.createdAt,
      createdAt: ad.createdAt ? toJalali(ad.createdAt) : null,
    };
  };

  const mapJobSeeker = (ad: any) => ({
    id: ad.id,
    title: ad.name || '',
    category: ad.category || '',
    description: ad.aboutMe || '',
    province: ad.state || ad.city || '',
    status: ad.adStatus,
    application: '', 
    adType: 'JobSeekerAd',
    person: ad.person,
    adStatus: ad.adStatus,
    _createdAt: ad.createdAt,
    createdAt: ad.createdAt ? toJalali(ad.createdAt) : null,
  });

  const mapSeller = (ad: any) => ({
    id: ad.id,
    title: ad.title || '',
    category: ad.category || '',
    description: ad.description || '',
    province: ad.state || ad.city || '',
    status: ad.adStatus,
    application: ad.application || '',
    adType: 'SellerAd',
    person: ad.person,
    adStatus: ad.adStatus,
    _createdAt: ad.createdAt,
    createdAt: ad.createdAt ? toJalali(ad.createdAt) : null,
  });

  const all = [
    ...digital.map(mapDigital),
    ...employer.map(mapEmployer),
    ...jobSeeker.map(mapJobSeeker),
    ...seller.map(mapSeller),
  ];

  all.sort((a, b) => {
    const dateA = a._createdAt ? new Date(a._createdAt).getTime() : 0;
    const dateB = b._createdAt ? new Date(b._createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const result = all.map(({ _createdAt, ...rest }) => rest);

  return result;
}

export async function getUserFinancialInfo(userId: string) {
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!wallet) {
    throw new Error('کیف پول کاربر یافت نشد');
  }

  const transactions = wallet.transactions.map((tx) => {
    let sign = '';
    if (tx.type === 'DEPOSIT' || tx.type === 'REFUND') {
      sign = '+';
    } else if (tx.type === 'WITHDRAWAL' || tx.type === 'HOLD') {
      sign = '-';
    }

    const isSuccessful = tx.status === 'COMPLETED';

    return {
      id: tx.id,
      title: tx.description || 'تراکنش',
      date: toJalaliDate(tx.createdAt), 
      amount: `${sign}${tx.amount.toString()}`,
      type: tx.type, // DEPOSIT, WITHDRAWAL, HOLD, REFUND
      status: tx.status, // PENDING, COMPLETED, FAILED, CANCELED
      isSuccessful,
      paymentMethod: tx.paymentMethod,
      referenceId: tx.referenceId,
    };
  });

  return {
    wallet: {
      balance: wallet.balance.toString(),
      heldBalance: wallet.heldBalance.toString(),
      availableBalance: (wallet.balance - wallet.heldBalance).toString(),
    },
    transactions,
  };
}

export async function getUserSessions(userId: string) {
  const sessions = await prisma.session.findMany({
    where: {
      user: userId,
    },
    orderBy: {
      lastActiveAt: 'desc',
    },
    select: {
      id: true,
      deviceInfo: true,
      createdAt: true,
      lastActiveAt: true,
      isActive: true,
    },
  });

  return sessions.map((session) => {
    const deviceInfo = session.deviceInfo as any;
    
    let deviceName = 'دستگاه ناشناخته';
    if (deviceInfo) {
      const parts = [];
      if (deviceInfo.deviceType) {
        const typeMap: Record<string, string> = {
          mobile: 'موبایل',
          tablet: 'تبلت',
          desktop: 'دسکتاپ',
        };
        parts.push(typeMap[deviceInfo.deviceType] || deviceInfo.deviceType);
      }
      if (deviceInfo.browser) {
        parts.push(deviceInfo.browser);
      }
      if (deviceInfo.os) {
        parts.push(deviceInfo.os);
      }
      if (parts.length > 0) {
        deviceName = parts.join(' - ');
      }
    }

    return {
      id: session.id,
      deviceName,
      ip: deviceInfo?.ip || 'نامشخص',
      browser: deviceInfo?.browser || 'نامشخص',
      os: deviceInfo?.os || 'نامشخص',
      deviceType: deviceInfo?.deviceType || 'نامشخص',
      createdAt: toJalali(session.createdAt),
      lastActiveAt: toJalali(session.lastActiveAt),
      isActive: session.isActive,
    };
  });
}