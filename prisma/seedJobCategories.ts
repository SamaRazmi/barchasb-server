// prisma/seedJobCategories.ts
import prisma from "../src/config/prisma";
import jobCategoriesData from "../src/data/jobCategoriesData.js";

async function seedJobCategories() {
  console.log("🌱 شروع seed دسته‌بندی مشاغل...");

  // === حذف تمام دسته‌های قبلی ===
  await prisma.jobCategory.deleteMany({});
  console.log("🧹 تمام دسته‌های قبلی حذف شدند.");

  // مرحله ۱: ایجاد Map از id عددی به name برای یافتن نام پدر
  const idToName = new Map(jobCategoriesData.map((cat) => [cat.id, cat.name]));

  // مرحله ۲: ایجاد Map از name به UUID برای دسته‌های اصلی (برای یافتن parentId)
  const nameToId = new Map<string, string>();

  // ===== مرحله ۳: ایجاد دسته‌های اصلی (parent === null) =====
  for (const cat of jobCategoriesData) {
    if (cat.parent === null) {
      const created = await prisma.jobCategory.create({
        data: {
          name: cat.name,
          parent: null,
        },
      });
      nameToId.set(cat.name, created.id);
      console.log(`✅ دسته اصلی: ${cat.name} (ID: ${created.id})`);
    }
  }

  // ===== مرحله ۴: ایجاد دسته‌های فرعی =====
  for (const cat of jobCategoriesData) {
    if (cat.parent !== null) {
      const parentName = idToName.get(cat.parent);
      if (!parentName) {
        console.warn(
          `⚠️ پدری برای دسته "${cat.name}" یافت نشد (parent id: ${cat.parent})`,
        );
        continue;
      }

      const parentId = nameToId.get(parentName);
      if (!parentId) {
        console.warn(
          `⚠️ UUID پدر برای دسته "${cat.name}" یافت نشد (parent name: ${parentName})`,
        );
        continue;
      }

      await prisma.jobCategory.create({
        data: {
          name: cat.name,
          parent: parentId,
        },
      });
      console.log(`✅ زیردسته: ${cat.name} (پدر: ${parentName})`);
    }
  }

  // ===== آمار نهایی =====
  const totalCount = await prisma.jobCategory.count();
  console.log(`📊 تعداد کل دسته‌بندی‌های درج شده: ${totalCount}`);

  console.log("🎉 Seed دسته‌بندی مشاغل با موفقیت انجام شد!");
}

seedJobCategories()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ خطا در Seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

export default seedJobCategories;
