import prisma from "../src/config/prisma";

async function main() {
  console.log("🌱 ====== STARTING ALL SEEDS ======\n");

  try {
    // ۱. استان‌ها و شهرها
    console.log("[1/5] Seeding provinces and cities...");
    const { seedProvinces } = await import("./seedProvinces");
    await seedProvinces();
    console.log("[1/5] Provinces and cities seeded!\n");

    // ۲. دسته‌بندی آگهی‌ها
    console.log("[2/5] Seeding ad categories...");
    const { seedAdCategories } = await import("./seedAdCategories");
    await seedAdCategories();
    console.log("[2/5] Ad categories seeded!\n");

    // ۳. دسته‌بندی شغلی
    console.log("[3/5] Seeding job categories...");
    const { seedJobCategories } = await import("./seedJobCategories");
    await seedJobCategories();
    console.log("[3/5] Job categories seeded!\n");

    // ۴. دلایل گزارش
    console.log("[4/5] Seeding report reasons...");
    const { seedReportReasons } = await import("./seedReportReasons");
    await seedReportReasons();
    console.log("[4/5] Report reasons seeded!\n");

    // ۵. قیمت‌ها
    console.log("[5/5] Seeding pricing...");
    const { seedPricing } = await import("./seedPricing");
    await seedPricing();
    console.log("[5/5] Pricing seeded!\n");

    console.log("🌱 ====== ALL SEEDS COMPLETED SUCCESSFULLY! ======");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();