import prisma from "../config/prisma";
import { AdType, PaymentMethod } from "@prisma/client";
import * as CostCalculator from "./CostCalculator";
import * as WalletService from "./WalletService";
import * as PaymentGatewayService from "./PaymentGatewayService";


interface ProcessAdPaymentInput {
  adId: string;
  adType: AdType;
  userId: string;
  isSpecial: boolean;
  isLadder: boolean;
  ladderOption?: "24h" | "72h" | "7d";
  paymentMethod: PaymentMethod;
}

interface PurchaseEnhancementInput {
  adId: string;
  adType: AdType;
  enhancementType: "SPECIAL" | "LADDER" | "RENEWAL";
  ladderSchedule?: Date;
  ladderOption?: "now" | "24h" | "72h" | "7d";
  userId: string;
  paymentMethod: PaymentMethod;
}

interface PurchaseOutput {
  success: boolean;
  message: string;
  transactionId?: string;
  adId?: string;
  paymentUrl?: string;
}

export async function processAdPayment(
  input: ProcessAdPaymentInput
): Promise<PurchaseOutput> {
  const {
    adId,
    adType,
    userId,
    isSpecial,
    isLadder,
    ladderOption,
    paymentMethod,
  } = input;

  // Find the ad with pending_payment status
  const ad = await getAdById(adId, adType);
  if (!ad) {
    return { success: false, message: "آگهی یافت نشد" };
  }

  if (ad.adStatus !== "pending_payment") {
    return {
      success: false,
      message: `وضعیت آگهی باید pending_payment باشد (وضعیت فعلی: ${ad.adStatus})`,
    };
  }

  // Cost calculation
  const costResult = await CostCalculator.calculateCost({
    adType,
    isNewAd: true,
    isSpecial,
    isLadder,
    isRenewal: false,
    paymentMethod,
    userId,
  });

  if (costResult.totalCost === 0) {
    await prisma.$transaction(async (tx) => {
      await createAdEnhancement(tx, adId, adType, isSpecial, isLadder, ladderOption);
      await updateAdStatus(tx, adId, adType, "pending");
    });

    return {
      success: true,
      message: "آگهی با موفقیت ثبت شد و برای تایید به ادمین ارسال شد",
      adId,
    };
  }

  if (!costResult.canAfford && paymentMethod === PaymentMethod.Wallet) {
    return {
      success: false,
      message: costResult.message || "موجودی کیف پول کافی نیست",
    };
  }

  // Transaction execution
  const result = await prisma.$transaction(async (tx) => {
    let transactionId: string | undefined;
    let paymentUrl: string | undefined;

    // If it is a wallet
    if (paymentMethod === PaymentMethod.Wallet && costResult.totalCost > 0) {
      // Freeze money
      const holdResult = await WalletService.holdBalance(
        userId,
        costResult.totalCost,
        `خرید آگهی ${adType} - ${adId}`,
        adId,
        { adType, adId, isSpecial, isLadder, ladderOption }
      );
      transactionId = holdResult.transaction.id;

      // Create AdEnhancement and AdLadder
      await createAdEnhancement(tx, adId, adType, isSpecial, isLadder, ladderOption);

      // Change the ad status to pending (for admin approval)
      await updateAdStatus(tx, adId, adType, "pending");
    } 
    // If there is a portal
    else if (paymentMethod === PaymentMethod.Bank_card && costResult.totalCost > 0) {
      const paymentResult = await PaymentGatewayService.createPayment({
        userId: userId,
        amount: costResult.totalCost,
        paymentMethod: PaymentMethod.Bank_card,
        description: `پرداخت برای آگهی ${adType} - ${adId}`,
        referenceId: adId,
        referenceType: "AD",
        metadata: {
          adType,
          adId,
          isSpecial,
          isLadder,
          ladderOption,
          _pendingAction: "createEnhancementAndActivate",
        },
      });
      transactionId = paymentResult.paymentId;
      paymentUrl = paymentResult.paymentUrl;
    }

    return { transactionId, paymentUrl };
  });

  return {
    success: true,
    message:
      paymentMethod === PaymentMethod.Bank_card
        ? "لطفاً برای تکمیل پرداخت به درگاه هدایت شوید"
        : "پرداخت با موفقیت انجام شد و آگهی برای تایید به ادمین ارسال شد",
    transactionId: result.transactionId,
    paymentUrl: result.paymentUrl,
    adId,
  };
}

export async function purchaseEnhancement(input: PurchaseEnhancementInput): Promise<PurchaseOutput> {
  const { adId, adType, enhancementType, ladderSchedule, ladderOption, userId, paymentMethod } = input;
  
  const ad = await getAdById(adId, adType);
  if (!ad) return { success: false, message: "آگهی یافت نشد" };

  if (ad.adStatus !== "approved") {
    return {
      success: false,
      message: `امکان خرید افزونه فقط برای آگهی‌های تایید شده وجود دارد. وضعیت فعلی: ${ad.adStatus}`
    };
  }
  let isSpecial = enhancementType === "SPECIAL";
  let isLadder = enhancementType === "LADDER";
  let isRenewal = enhancementType === "RENEWAL";

  const costResult = await CostCalculator.calculateCost({
    adType,
    isNewAd: false,
    isSpecial,
    isLadder,
    isRenewal,
    paymentMethod,
    userId,
  });

  if (costResult.totalCost === 0) {
    await prisma.$transaction(async (tx) => {
      if (enhancementType === "SPECIAL") {
        const existing = await tx.adEnhancement.findFirst({ where: { adId, adType } });
        if (existing) {
          await tx.adEnhancement.update({
            where: { id: existing.id },
            data: { isSpecial: true, specialStartDate: new Date(), specialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
          });
        } else {
          await tx.adEnhancement.create({
            data: { adId, adType, isSpecial: true, specialStartDate: new Date(), specialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
          });
        }
      } else if (enhancementType === "LADDER") {
        let finalScheduledAt: Date;
        if (ladderOption === "now") {
          finalScheduledAt = new Date();
        } else if (ladderOption === "24h") {
          finalScheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        } else if (ladderOption === "72h") {
          finalScheduledAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
        } else if (ladderOption === "7d") {
          finalScheduledAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        } else if (ladderSchedule) {
          finalScheduledAt = new Date(ladderSchedule);
        } else {
          throw new Error("زمان پله مشخص نشده است");
        }

        let enhancement = await tx.adEnhancement.findFirst({ where: { adId, adType } });
        if (!enhancement) {
          enhancement = await tx.adEnhancement.create({ data: { adId, adType, isSpecial: false } });
        }
        await tx.adLadder.create({
          data: {
            adEnhancementId: enhancement.id,
            scheduledAt: finalScheduledAt,
            isExecuted: false,
            option: ladderOption || null,
          },
        });
      } else if (enhancementType === "RENEWAL") {
        const currentExpire = ad.expiresAt || new Date();
        const newExpireAt = new Date(currentExpire);
        newExpireAt.setDate(newExpireAt.getDate() + 30);
        const modelMap: Record<AdType, keyof Omit<typeof tx, `$${string}`>> = {
          [AdType.EmployerAd]: "employerAd",
          [AdType.DigitalAd]: "digitalAd",
          [AdType.JobSeekerAd]: "jobSeekerAd",
          [AdType.SellerAd]: "sellerAd",
        };
        const targetModel = modelMap[adType];
        await (tx[targetModel] as any).update({ where: { id: adId }, data: { expiresAt: newExpireAt } });
      }
    });

    return {
      success: true,
      message: "افزونه با موفقیت اعمال شد",
      adId,
    };
  }

  if (!costResult.canAfford && paymentMethod === PaymentMethod.Wallet) {
    return { success: false, message: costResult.message || "موجودی کیف پول کافی نیست" };
  }

  const result = await prisma.$transaction(async (tx) => {
    let transactionId: string | undefined;
    let paymentUrl: string | undefined;

    if (paymentMethod === PaymentMethod.Wallet && costResult.totalCost > 0) {
      const holdResult = await WalletService.holdBalance(
        userId,
        costResult.totalCost,
        `خرید افزونه ${enhancementType} برای آگهی ${adId}`,
        adId,
        { enhancementType, adId, adType }
      );
      transactionId = holdResult.transaction.id;
      await WalletService.releaseHold(holdResult.transaction.id);

      if (enhancementType === "SPECIAL") {
        const existing = await tx.adEnhancement.findFirst({ where: { adId, adType } });
        if (existing) {
          await tx.adEnhancement.update({
            where: { id: existing.id },
            data: { isSpecial: true, specialStartDate: new Date(), specialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
          });
        } else {
          await tx.adEnhancement.create({
            data: { adId, adType, isSpecial: true, specialStartDate: new Date(), specialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
          });
        }
      } else if (enhancementType === "LADDER") {
        let finalScheduledAt: Date;

        if (ladderOption === "now") {
          finalScheduledAt = new Date();
        } 
        else if (ladderOption === "24h") {
          finalScheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        } else if (ladderOption === "72h") {
          finalScheduledAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
        } else if (ladderOption === "7d") {
          finalScheduledAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        } 
        else if (ladderSchedule) {
          finalScheduledAt = new Date(ladderSchedule);
        } 
        else {
          throw new Error("زمان پله مشخص نشده است");
        }

        let enhancement = await tx.adEnhancement.findFirst({ where: { adId, adType } });
        if (!enhancement) {
          enhancement = await tx.adEnhancement.create({ data: { adId, adType, isSpecial: false } });
        }
        await tx.adLadder.create({
          data: {
            adEnhancementId: enhancement.id,
            scheduledAt: finalScheduledAt,
            isExecuted: false,
            option: ladderOption || null, 
          },
        });
      } else if (enhancementType === "RENEWAL") {
        const currentExpire = ad.expiresAt || new Date();
        const newExpireAt = new Date(currentExpire);
        newExpireAt.setDate(newExpireAt.getDate() + 30);
        
        const modelMap: Record<AdType, keyof Omit<typeof tx, `$${string}`>> = {
          [AdType.EmployerAd]: "employerAd",
          [AdType.DigitalAd]: "digitalAd",
          [AdType.JobSeekerAd]: "jobSeekerAd",
          [AdType.SellerAd]: "sellerAd",
        };
        const targetModel = modelMap[adType];
        await (tx[targetModel] as any).update({ where: { id: adId }, data: { expiresAt: newExpireAt } });
      }
    } 
    
    else if (paymentMethod === PaymentMethod.Bank_card && costResult.totalCost > 0) {
      const paymentResult = await PaymentGatewayService.createPayment({
        userId: userId,
        amount: costResult.totalCost,
        paymentMethod: PaymentMethod.Bank_card,
        description: `خرید مستقیم افزونه ${enhancementType} برای آگهی ${adId}`,
        referenceId: adId,
        referenceType: "ENHANCEMENT",
        metadata: { enhancementType, 
          adId, 
          adType, 
          ladderSchedule: ladderSchedule ? ladderSchedule.toISOString() : undefined,
          ladderOption,
        },
      });
      transactionId = paymentResult.paymentId;
      paymentUrl = paymentResult.paymentUrl;
    }

    return { transactionId, paymentUrl };
  });

  return {
    success: true,
    message: paymentMethod === PaymentMethod.Bank_card
      ? "لطفاً برای تکمیل پرداخت به درگاه هدایت شوید"
      : "افزونه با موفقیت اعمال شد",
    adId: adId,
    transactionId: result.transactionId,
    paymentUrl: result.paymentUrl,
  };
}

export async function getAdById(adId: string, adType: AdType): Promise<any> {
  switch (adType) {
    case AdType.EmployerAd: return prisma.employerAd.findUnique({ where: { id: adId } });
    case AdType.DigitalAd: return prisma.digitalAd.findUnique({ where: { id: adId } });
    case AdType.JobSeekerAd: return prisma.jobSeekerAd.findUnique({ where: { id: adId } });
    case AdType.SellerAd: return prisma.sellerAd.findUnique({ where: { id: adId } });
    default: throw new Error("نوع آگهی نامعتبر");
  }
}

// helper
// ================================================================
export async function createAdEnhancement(
  tx: any,
  adId: string,
  adType: AdType,
  isSpecial: boolean,
  isLadder: boolean,
  ladderOption?: "24h" | "72h" | "7d"
): Promise<void> {
  if (isSpecial || isLadder) {
    const enhancementData: any = {
      adId,
      adType,
      isSpecial,
      specialStartDate: null,  // بعد از تایید ادمین مقداردهی می‌شود
      specialEndDate: null,   // بعد از تایید ادمین مقداردهی می‌شود
    };

    if (isLadder && ladderOption) {
      enhancementData.ladders = {
        create: {
          option: ladderOption,
          scheduledAt: null, // بعداً در زمان تایید ادمین محاسبه می‌شود
          isExecuted: false,
        },
      };
    }

    await tx.adEnhancement.create({
      data: enhancementData,
    });
  }
}


export async function updateAdStatus(
  tx: any,
  adId: string,
  adType: AdType,
  status: "pending" | "approved" | "rejected" | "expired"
): Promise<void> {
  const modelMap: Record<string, string> = {
    [AdType.EmployerAd]: "employerAd",
    [AdType.DigitalAd]: "digitalAd",
    [AdType.JobSeekerAd]: "jobSeekerAd",
    [AdType.SellerAd]: "sellerAd",
  };
  const targetModel = modelMap[adType];
  if (targetModel) {
    await tx[targetModel].update({
      where: { id: adId },
      data: { adStatus: status },
    });
  }
}