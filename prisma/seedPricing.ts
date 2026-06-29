import prisma from "../src/config/prisma";

export async function seedPricing() {
  console.log("شروع seed قیمت‌ها...");

  const pricingData = [
    {
      key: "base_ad_price",
      value: 100000,
      description: "هزینه پایه درج آگهی",
    },
    {
      key: "special_price",
      value: 25000,
      description: "هزینه ویژه کردن آگهی",
    },
    {
      key: "ladder_price",
      value: 45000,
      description: "هزینه پله کردن آگهی",
    },
    {
      key: "renewal_price",
      value: 45000,
      description: "هزینه تمدید آگهی",
    },
  ];

  for (const item of pricingData) {
    await prisma.pricing.upsert({
      where: { key: item.key },
      update: {
        value: item.value,
        description: item.description,
      },
      create: {
        key: item.key,
        value: item.value,
        description: item.description,
      },
    });
  }

  console.log("قیمت‌ها با موفقیت سید شدند!");
  console.log("Seed قیمت‌ها با موفقیت انجام شد!");
}

if (require.main === module) {
  seedPricing()
    .catch((e) => {
      console.error("خطا در Seed قیمت‌ها:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default seedPricing;