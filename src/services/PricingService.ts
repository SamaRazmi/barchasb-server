import prisma from "../config/prisma";

export const PRICING_KEYS = {
  BASE_AD_PRICE: "base_ad_price", 
  SPECIAL_PRICE: "special_price", 
  LADDER_PRICE: "ladder_price",       
  RENEWAL_PRICE: "renewal_price", 
} as const;

export type PricingKey = typeof PRICING_KEYS[keyof typeof PRICING_KEYS];


export const getPricingValue = async (key: PricingKey): Promise<number> => {
  const pricing = await prisma.pricing.findUnique({
    where: { key },
  });

  if (!pricing) {
    throw new Error(`قیمت با کلید "${key}" یافت نشد`);
  }

  return pricing.value;
};

export const getAllPricing = async () => {
  return prisma.pricing.findMany({
    orderBy: { key: "asc" },
  });
};

export const updatePricing = async (key: string, value: number) => {
  if (value < 0) {
    throw new Error("مقدار قیمت نمی‌تواند منفی باشد");
  }

  const existing = await prisma.pricing.findUnique({
    where: { key },
  });

  if (!existing) {
    throw new Error(`قیمت با کلید "${key}" یافت نشد`);
  }

  return prisma.pricing.update({
    where: { key },
    data: { value },
  });
};

export const upsertPricingBulk = async (
  items: { key: string; value: number; description?: string }[]
) => {
  const results = [];
  for (const item of items) {
    const result = await prisma.pricing.upsert({
      where: { key: item.key },
      update: { value: item.value, description: item.description },
      create: {
        key: item.key,
        value: item.value,
        description: item.description || "",
      },
    });
    results.push(result);
  }
  return results;
};