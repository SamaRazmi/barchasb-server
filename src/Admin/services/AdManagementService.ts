import prisma from '../../config/prisma'
import { AdStatus, AdType, PaymentMethod, TransactionStatus } from '@prisma/client'
import * as WalletService from '../../services/WalletService'
import { toJalali } from '../../utils/dateFormatter'

// helper
async function getAdEnhancement(adId: string, adType: AdType) {
  const enhancement = await prisma.adEnhancement.findFirst({
    where: { adId, adType },
    include: {
      ladders: {
        orderBy: { scheduledAt: "asc" },
      },
    },
  });

  if (!enhancement) {
    return {
      isSpecial: false,
      specialStartDate: null,
      specialEndDate: null,
      isLadder: false,
      ladders: [],
    };
  }

  const now = new Date();
  const isSpecialActive =
    enhancement.isSpecial &&
    enhancement.specialStartDate &&
    enhancement.specialEndDate &&
    enhancement.specialStartDate <= now &&
    enhancement.specialEndDate > now;

  return {
    isSpecial: isSpecialActive,
    specialStartDate: enhancement.specialStartDate,
    specialEndDate: enhancement.specialEndDate,
    isLadder: enhancement.ladders && enhancement.ladders.length > 0,
    ladders: enhancement.ladders || [],
  };
}

interface GetAdsListInput {
  status?: AdStatus | 'pending'
  type?: AdType
  page?: number
  limit?: number
}

export async function getAdsList(input: GetAdsListInput) {
  const { status, type, page = 1, limit = 10 } = input
  const skip = (page - 1) * limit

  let statusCondition: any = {}
  if (status === 'pending') {
    statusCondition = { adStatus: { in: ['pending', 'updated'] } }
  } else if (status) {
    statusCondition = { adStatus: status }
  }

  const typeCondition = type ? { adType: type } : {}

  const adTypes: AdType[] = [AdType.DigitalAd, AdType.EmployerAd, AdType.JobSeekerAd, AdType.SellerAd]
  const allAds: any[] = []

  for (const adType of adTypes) {
    const modelMap: Record<string, any> = {
      [AdType.DigitalAd]: prisma.digitalAd,
      [AdType.EmployerAd]: prisma.employerAd,
      [AdType.JobSeekerAd]: prisma.jobSeekerAd,
      [AdType.SellerAd]: prisma.sellerAd,
    }
    const model = modelMap[adType]

    if (type && adType !== type) continue

    const where: any = {
      ...statusCondition,
    }

    const ads = await model.findMany({
      where,
      skip,
      orderBy: { createdAt: 'desc' },
      include: {
        ownerRelation: {
          select: {
            id: true,
            name: true,
            lastName: true,
            phone: true,
          },
        },
      },
    })

    for (const ad of ads) {
      const enhancement = await getAdEnhancement(ad.id, adType)
      const firstImage = ad.images && ad.images.length > 0 ? ad.images[0] : null

      allAds.push({
        id: ad.id,
        type: adType,
        title: ad.title || ad.name || 'بدون عنوان',
        description: ad.description || ad.aboutMe || '',
        firstImage: firstImage?.url || null,
        status: ad.adStatus,
        owner: ad.ownerRelation
          ? {
              fullName: `${ad.ownerRelation.name || ''} ${ad.ownerRelation.lastName || ''}`.trim(),
              phone: ad.ownerRelation.phone,
            }
          : null,
        createdAt: toJalali(ad.createdAt),
        enhancements: {
          isSpecial: enhancement.isSpecial,
          isLadder: enhancement.isLadder,
        },
      })
    }
  }
  allAds.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const paginatedData = allAds.slice(skip, skip + limit)

  let total = 0
  for (const adType of adTypes) {
    if (type && adType !== type) continue
    const modelMap: Record<string, any> = {
      [AdType.DigitalAd]: prisma.digitalAd,
      [AdType.EmployerAd]: prisma.employerAd,
      [AdType.JobSeekerAd]: prisma.jobSeekerAd,
      [AdType.SellerAd]: prisma.sellerAd,
    }
    const model = modelMap[adType]
    const count = await model.count({
      where: { ...statusCondition },
    })
    total += count
  }

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function getAdDetails(adId: string, adType: AdType) {
  const modelMap: Record<string, any> = {
    [AdType.DigitalAd]: prisma.digitalAd,
    [AdType.EmployerAd]: prisma.employerAd,
    [AdType.JobSeekerAd]: prisma.jobSeekerAd,
    [AdType.SellerAd]: prisma.sellerAd,
  }
  const model = modelMap[adType]

  const ad = await model.findUnique({
    where: { id: adId },
    include: {
      ownerRelation: {
        select: {
          id: true,
          name: true,
          lastName: true,
          phone: true,
          province: true,
          city: true,
        },
      },
    },
  })

  if (!ad) {
    throw new Error('آگهی یافت نشد')
  }

  const enhancement = await getAdEnhancement(ad.id, adType)

  const transaction = await prisma.transaction.findFirst({
    where: {
      referenceId: adId,
      status: TransactionStatus.COMPLETED,
    },
    orderBy: { createdAt: 'desc' },
  })

  const wallet = await prisma.wallet.findUnique({
    where: { userId: ad.owner },
    select: { balance: true, heldBalance: true },
  })

  return {
    ad: {
      ...ad,
      createdAt: toJalali(ad.createdAt),
      approvedAt: ad.approvedAt ? toJalali(ad.approvedAt) : null,
      expiresAt: ad.expiresAt ? toJalali(ad.expiresAt) : null,
    },
    owner: ad.ownerRelation
      ? {
          id: ad.ownerRelation.id,
          fullName: `${ad.ownerRelation.name || ''} ${ad.ownerRelation.lastName || ''}`.trim(),
          phone: ad.ownerRelation.phone,
          province: ad.ownerRelation.province,
          city: ad.ownerRelation.city,
        }
      : null,
    enhancements: {
      isSpecial: enhancement.isSpecial,
      specialStartDate: enhancement.specialStartDate,
      specialEndDate: enhancement.specialEndDate,
      isLadder: enhancement.isLadder,
      ladders: enhancement.ladders,
    },
    payment: transaction
      ? {
          amount: transaction.amount,
          method: transaction.paymentMethod,
          status: transaction.status,
          createdAt: toJalali(transaction.createdAt),
        }
      : null,
    wallet: wallet
      ? {
          balance: wallet.balance,
          heldBalance: wallet.heldBalance,
          available: wallet.balance - wallet.heldBalance,
        }
      : null,
  }
}

export async function approveAd(adId: string, adType: AdType, adminId: string) {
  const modelMap: Record<string, any> = {
    [AdType.DigitalAd]: prisma.digitalAd,
    [AdType.EmployerAd]: prisma.employerAd,
    [AdType.JobSeekerAd]: prisma.jobSeekerAd,
    [AdType.SellerAd]: prisma.sellerAd,
  }
  const model = modelMap[adType]

  const ad = await model.findUnique({
    where: { id: adId },
  })

  if (!ad) throw new Error('آگهی یافت نشد')
  if (ad.adStatus !== 'pending') {
    throw new Error('فقط آگهی‌های در انتظار تایید قابل تایید هستند')
  }

  const transaction = await prisma.transaction.findFirst({
    where: {
      referenceId: adId,
      status: TransactionStatus.PENDING,
      type: 'HOLD',
    },
    orderBy: { createdAt: 'desc' },
  })

  if (transaction) {
    await WalletService.releaseHold(transaction.id, { approvedBy: adminId })
  }

  const now = new Date()
  const expiresAt = new Date(now)
  expiresAt.setDate(expiresAt.getDate() + 30)

  const updated = await model.update({
    where: { id: adId },
    data: {
      adStatus: 'approved',
      approvedAt: now,
      expiresAt: expiresAt,
    },
  })

  await applyEnhancements(adId, adType, now)

  return {
    message: 'آگهی با موفقیت تایید شد',
    approvedAt: toJalali(now),
    expiresAt: toJalali(expiresAt),
  }
}

export async function rejectAd(
  adId: string,
  adType: AdType,
  reason: string,
  adminId: string
) {
  const modelMap: Record<string, any> = {
    [AdType.DigitalAd]: prisma.digitalAd,
    [AdType.EmployerAd]: prisma.employerAd,
    [AdType.JobSeekerAd]: prisma.jobSeekerAd,
    [AdType.SellerAd]: prisma.sellerAd,
  }
  const model = modelMap[adType]

  const ad = await model.findUnique({
    where: { id: adId },
  })

  if (!ad) throw new Error('آگهی یافت نشد')

  if (ad.adStatus !== 'pending' && ad.adStatus !== 'approved') {
    throw new Error('فقط آگهی‌های در انتظار تایید یا تایید شده قابل رد هستند')
  }

  if (ad.adStatus === 'pending') {
    const transaction = await prisma.transaction.findFirst({
      where: {
        referenceId: adId,
        status: TransactionStatus.PENDING,
        type: 'HOLD',
      },
      orderBy: { createdAt: 'desc' },
    })

    if (transaction) {
      await WalletService.refundHold(transaction.id, reason, { rejectedBy: adminId })
    }
  }

  const updated = await model.update({
    where: { id: adId },
    data: {
      adStatus: 'rejected',
      rejectionReason: reason,
    },
  })

  return {
    message: 'آگهی با موفقیت رد شد',
    rejectionReason: reason,
  }
}

async function applyEnhancements(adId: string, adType: AdType, approvedAt: Date) {
  const enhancement = await prisma.adEnhancement.findFirst({
    where: { adId, adType },
    include: { ladders: true },
  })

  if (!enhancement) return

  if (enhancement.isSpecial) {
    const specialEndDate = new Date(approvedAt)
    specialEndDate.setDate(specialEndDate.getDate() + 30)

    await prisma.adEnhancement.update({
      where: { id: enhancement.id },
      data: {
        specialStartDate: approvedAt,
        specialEndDate: specialEndDate,
      },
    })
  }

  if (enhancement.ladders && enhancement.ladders.length > 0) {
    for (const ladder of enhancement.ladders) {
      if (ladder.isExecuted) continue

      let scheduledAt: Date | null = null
      if (ladder.option === '24h') {
        scheduledAt = new Date(approvedAt.getTime() + 24 * 60 * 60 * 1000)
      } else if (ladder.option === '72h') {
        scheduledAt = new Date(approvedAt.getTime() + 72 * 60 * 60 * 1000)
      } else if (ladder.option === '7d') {
        scheduledAt = new Date(approvedAt.getTime() + 7 * 24 * 60 * 60 * 1000)
      }

      if (scheduledAt) {
        await prisma.adLadder.update({
          where: { id: ladder.id },
          data: { scheduledAt },
        })
      }
    }
  }
}