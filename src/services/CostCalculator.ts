import prisma from "../config/prisma";
import { PRICING_KEYS, getPricingValue } from "./PricingService";
import { AdType, PaymentMethod } from "@prisma/client";
import { isUserVip } from "./VipService";

const PAID_AD_TYPES: AdType[] = [AdType.EmployerAd, AdType.DigitalAd];
const FREE_AD_TYPES: AdType[] = [AdType.JobSeekerAd, AdType.SellerAd];

export function isAdTypePaid(adType: AdType): boolean {
  return PAID_AD_TYPES.includes(adType);
}

interface CalculateCostInput {
  adType: AdType;
  isNewAd: boolean; 
  isSpecial: boolean;
  isLadder: boolean;
  isRenewal: boolean;
  paymentMethod: PaymentMethod; 
  userId: string;
}

interface CalculateCostOutput {
  baseCost: number;
  specialCost: number;
  ladderCost: number;
  renewalCost: number;
  totalCost: number;
  canAfford: boolean;
  paymentMethod: PaymentMethod;
  message?: string;
}

export async function calculateCost(
  input: CalculateCostInput
): Promise<CalculateCostOutput> {
  const {
    adType,
    isNewAd,
    isSpecial,
    isLadder,
    isRenewal,
    paymentMethod,
    userId,
  } = input;

  const isVip = await isUserVip(userId);
  if (isVip) {
    return {
      baseCost: 0,
      specialCost: 0,
      ladderCost: 0,
      renewalCost: 0,
      totalCost: 0,
      canAfford: true,
      paymentMethod,
      message: "برای کاربران vip هزینه‌ها رایگان است.",
    };
  }

  // get price from db
  const [basePrice, specialPrice, ladderPrice, renewalPrice] = await Promise.all([
    getPricingValue(PRICING_KEYS.BASE_AD_PRICE),
    getPricingValue(PRICING_KEYS.SPECIAL_PRICE),
    getPricingValue(PRICING_KEYS.LADDER_PRICE),
    getPricingValue(PRICING_KEYS.RENEWAL_PRICE),
  ]);

  // calculate cost
  let baseCost = 0;
  const specialCost = isSpecial ? specialPrice : 0;
  const ladderCost = isLadder ? ladderPrice : 0;
  const renewalCost = isRenewal ? renewalPrice : 0;

  // is paid Ads
  if (isNewAd && isAdTypePaid(adType)) {
    baseCost = basePrice;
  }

  const totalCost = baseCost + specialCost + ladderCost + renewalCost;

  // can afford?
  let canAfford = true;
  let message: string | undefined = undefined;

  if (paymentMethod === PaymentMethod.Wallet) {
    // get user wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      select: { balance: true, heldBalance: true },
    });

    if (!wallet) {
      throw new Error("کیف پول کاربر یافت نشد");
    }

    const availableBalance = wallet.balance - wallet.heldBalance;

    if (availableBalance < totalCost) {
      canAfford = false;
      message = `موجودی کیف پول کافی نیست. موجودی: ${availableBalance} تومان، هزینه کل: ${totalCost} تومان`;
    }
  }

  // final result
  return {
    baseCost,
    specialCost,
    ladderCost,
    renewalCost,
    totalCost,
    canAfford,
    paymentMethod,
    message,
  };
}