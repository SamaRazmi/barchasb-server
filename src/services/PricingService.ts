import prisma from "../config/prisma";

export const PRICING_KEYS = {
  BASE_AD_PRICE: "base_ad_price",
  SPECIAL_PRICE: "special_price",
  LADDER_PRICE: "ladder_price",
  RENEWAL_PRICE: "renewal_price",
} as const;

export type PricingKey = (typeof PRICING_KEYS)[keyof typeof PRICING_KEYS];

export const getAllPricing = async () => {
  return prisma.pricing.findMany({
    orderBy: { key: "asc" },
  });
};

export const getPricingValue = async (key: PricingKey): Promise<bigint> => {
  const pricing = await prisma.pricing.findUnique({
    where: { key },
  });

  if (!pricing) {
    throw new Error(`قیمت با کلید "${key}" یافت نشد`);
  }

  // تبدیل صریح به bigint برای اطمینان از تطابق نوع
  return BigInt(pricing.value);
};
