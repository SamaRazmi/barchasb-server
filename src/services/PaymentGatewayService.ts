import prisma from "../config/prisma";
import { PaymentMethod, PaymentStatus, AdType, TransactionStatus, TransactionType } from "@prisma/client";
import {getAdById, updateAdStatus, createAdEnhancement,} from "./PurchaseService";
interface CreatePaymentInput {
  userId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  description?: string;
  referenceId: string;
  referenceType: "AD" | "ENHANCEMENT" |"WALLET_DEPOSIT";
  metadata?: any;
}

interface CreatePaymentOutput {
  paymentId: string;
  authority: string;
  paymentUrl: string;
}

export async function createPayment(input: CreatePaymentInput): Promise<CreatePaymentOutput> {
  const { userId, amount, paymentMethod, description, referenceId, referenceType, metadata } = input;

  const payment = await prisma.payment.create({
    data: {
      userId,
      amount,
      paymentMethod,
      status: PaymentStatus.PENDING,
      description: description || `پرداخت به مبلغ ${amount} تومان`,
      referenceId,
      referenceType,
      metadata,
    },
  });

  const { authority, paymentUrl } = await requestGateway({
    amount,
    description: payment.description || "",
    callbackUrl: `${process.env.APP_URL || "http://localhost:5000"}/api/payments/verify`,
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { authority },
  });

  return {
    paymentId: payment.id,
    authority,
    paymentUrl,
  };
}

interface VerifyPaymentInput {
  authority: string;
  status: string;
}

interface VerifyPaymentOutput {
  success: boolean;
  refId?: string;
  message: string;
  paymentId?: string;
}

export async function verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentOutput> {
  const { authority, status } = input;

  const payment = await prisma.payment.findFirst({
    where: { authority },
  });

  if (!payment) {
    return { success: false, message: "پرداخت یافت نشد" };
  }

  if (payment.status === PaymentStatus.PAID) {
    return {
      success: true,
      refId: payment.refId || undefined,
      message: "پرداخت قبلاً تایید شده است",
      paymentId: payment.id,
    };
  }

  if (status === "NOK") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.CANCELED },
    });
    return { success: false, message: "پرداخت توسط کاربر لغو شد", paymentId: payment.id };
  }

  const verifyResult = await verifyWithGateway({
    authority,
    amount: payment.amount,
  });

  if (!verifyResult.success) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.FAILED },
    });
    return {
      success: false,
      message: verifyResult.message, 
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.PAID,
        refId: verifyResult.refId,
      },
    });

    if (payment.referenceId && payment.referenceType) {
      await handleSuccessfulPayment(tx, payment);
    }
  });

  return {
    success: true,
    refId: verifyResult.refId,
    message: "پرداخت با موفقیت تایید شد",
    paymentId: payment.id,
  };
}

async function requestGateway(params: { amount: number; description: string; callbackUrl: string }) {
  const authority = `A${Date.now()}${Math.floor(Math.random() * 10000)}`;
  const paymentUrl = `${process.env.APP_URL || "http://localhost:5000"}/api/payments/pay-mock?authority=${authority}&amount=${params.amount}`;
  return { authority, paymentUrl };
}

async function verifyWithGateway(params: { authority: string; amount: number }): Promise<{ success: boolean; refId: string; message: string }> {
  return {
    success: true,
    refId: `REF${Date.now()}${Math.floor(Math.random() * 10000)}`,
    message: "تاییدیه بانک دریافت شد",
  };
}

async function handleSuccessfulPayment(tx: any, payment: any): Promise<void> {
  const { referenceId, referenceType, metadata } = payment;
  const meta = metadata as any;

  if (referenceType === "WALLET_DEPOSIT") {
    const wallet = await tx.wallet.findUnique({
      where: { userId: referenceId },
    });
    if (!wallet) {
      throw new Error("کیف پول یافت نشد");
    }

    await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          increment: payment.amount,
        },
      },
    });

    await tx.transaction.create({
      data: {
        walletId: wallet.id,
        amount: payment.amount,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.COMPLETED,
        description: payment.description || "شارژ کیف پول از طریق درگاه بانکی",
        referenceId: payment.id,
        paymentMethod: PaymentMethod.Bank_card,
        metadata: {
          paymentId: payment.id,
          refId: payment.refId,
          authority: payment.authority,
        },
      },
    });

    return; 
  }
  if (referenceType === "AD") {
    const { adType, adId, isSpecial, isLadder, ladderOption } = meta; // ← ladderOption به جای ladderSchedule

    // بررسی اینکه آگهی هنوز pending_payment است
    const ad = await getAdById(adId, adType);
    if (!ad) {
      throw new Error("آگهی یافت نشد");
    }

    if (ad.adStatus !== "pending_payment") {
      throw new Error(`وضعیت آگهی باید pending_payment باشد (وضعیت فعلی: ${ad.adStatus})`);
    }

    // create AdEnhancement and AdLadder 
    await createAdEnhancement(tx, adId, adType, isSpecial, isLadder, ladderOption);

    await updateAdStatus(tx, adId, adType, "pending");

    const wallet = await tx.wallet.findUnique({
      where: { userId: payment.userId },
    });
    if (wallet) {
      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          amount: payment.amount,
          type: TransactionType.WITHDRAWAL,
          status: TransactionStatus.COMPLETED,
          description: `هزینه آگهی ${adType} - ${adId} (پرداخت از درگاه)`,
          referenceId: adId,
          paymentMethod: PaymentMethod.Bank_card,
          metadata: {
            paymentId: payment.id,
            refId: payment.refId,
          },
        },
      });
    }
  } 
  else if (referenceType === "ENHANCEMENT") {
    const { enhancementType, adId, adType, ladderSchedule, ladderOption } = meta;

    const ad = await getAdById(adId, adType);
    if (!ad) {
      throw new Error("آگهی یافت نشد");
    }
    if (ad.adStatus !== "approved") {
      throw new Error(`امکان خرید افزونه فقط برای آگهی‌های تایید شده وجود دارد. وضعیت فعلی: ${ad.adStatus}`);
    }
    if (enhancementType === "SPECIAL") {
      const existing = await tx.adEnhancement.findFirst({ where: { adId, adType } });
      if (existing) {
        await tx.adEnhancement.update({
          where: { id: existing.id },
          data: {
            isSpecial: true,
            specialStartDate: new Date(),
            specialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      } else {
        await tx.adEnhancement.create({
          data: {
            adId,
            adType,
            isSpecial: true,
            specialStartDate: new Date(),
            specialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
    } 
    else if (enhancementType === "LADDER") {
      let finalScheduledAt: Date;

      // ====== گزینه "now" یا گزینه‌های زمانی ======
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
    }
    else if (enhancementType === "RENEWAL") {
      const modelMap: Record<string, string> = {
        [AdType.EmployerAd]: "employerAd",
        [AdType.DigitalAd]: "digitalAd",
        [AdType.JobSeekerAd]: "jobSeekerAd",
        [AdType.SellerAd]: "sellerAd",
      };
      const targetModel = modelMap[adType];
      if (targetModel) {
        const currentAd = await tx[targetModel].findUnique({ where: { id: adId } });
        if (currentAd) {
          const currentExpire = currentAd.expiresAt || new Date();
          const newExpireAt = new Date(currentExpire);
          newExpireAt.setDate(newExpireAt.getDate() + 30);
          await tx[targetModel].update({
            where: { id: adId },
            data: { expiresAt: newExpireAt },
          });
        }
      }
    }
  }
}