import prisma from '../config/prisma'
import { AdType } from '@prisma/client'

export async function executeLadders() {
  console.log('⏰ شروع اجرای پله‌های زمان‌بندی‌شده...')

  const now = new Date()

  const ladders = await prisma.adLadder.findMany({
    where: {
      isExecuted: false,
      scheduledAt: {
        lte: now,
      },
    },
    include: {
      adEnhancement: true,
    },
  })

  if (ladders.length === 0) {
    console.log('✅ هیچ پله‌ای برای اجرا وجود ندارد.')
    return
  }

  console.log(`🔍 ${ladders.length} پله برای اجرا پیدا شد.`)

  let executedCount = 0
  let errorCount = 0

  for (const ladder of ladders) {
    const { adEnhancement, id, scheduledAt } = ladder

    try {
      const modelMap: Record<string, any> = {
        [AdType.DigitalAd]: prisma.digitalAd,
        [AdType.EmployerAd]: prisma.employerAd,
        [AdType.JobSeekerAd]: prisma.jobSeekerAd,
        [AdType.SellerAd]: prisma.sellerAd,
      }

      const model = modelMap[adEnhancement.adType]
      if (!model) {
        throw new Error(`نوع آگهی نامعتبر: ${adEnhancement.adType}`)
      }

      await model.update({
        where: { id: adEnhancement.adId },
        data: {
          createdAt: now,
        },
      })

      await prisma.adLadder.update({
        where: { id },
        data: {
          isExecuted: true,
          executedAt: now,
        },
      })

      executedCount++
      console.log(`✅ پله ${id} برای آگهی ${adEnhancement.adId} (${adEnhancement.adType}) در تاریخ ${scheduledAt} اجرا شد.`)
    } catch (error: any) {
      errorCount++
      console.error(`❌ خطا در اجرای پله ${id}:`, error.message)
    }
  }

  console.log(`✅ اجرای پله‌ها کامل شد. ${executedCount} موفق، ${errorCount} ناموفق.`)
}