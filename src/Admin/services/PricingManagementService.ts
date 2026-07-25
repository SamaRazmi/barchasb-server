import prisma from "../../config/prisma";
import * as PricingService from '../../services/PricingService'


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

export const getAllPricing = async () => {
  return PricingService.getAllPricing()
}