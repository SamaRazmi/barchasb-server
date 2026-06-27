import prisma from "../src/config/prisma";
import adCategoriesData from "../src/data/adCategoriesData";

export async function seedAdCategories() {
  console.log("🌱 شروع seed دسته‌بندی آگهی‌ها...");

  // ساخت Map از id عددی به name
  const idToName = new Map(adCategoriesData.map((cat) => [cat.id, cat.name]));

  // Map برای نگاشت name به UUID (برای دسته‌های اصلی)
  const nameToId = new Map<string, string>();

  // ===== مرحله ۱: ایجاد یا به‌روزرسانی دسته‌های اصلی =====
  for (const cat of adCategoriesData) {
    if (cat.parent === null) {
      // بررسی وجود دسته با این name
      let existing = await prisma.adCategory.findFirst({
        where: { name: cat.name },
      });

      let upserted;
      if (existing) {
        // به‌روزرسانی (در صورت نیاز)
        upserted = await prisma.adCategory.update({
          where: { id: existing.id },
          data: { name: cat.name, parent: null },
        });
      } else {
        // ایجاد جدید
        upserted = await prisma.adCategory.create({
          data: { name: cat.name, parent: null },
        });
      }

      nameToId.set(cat.name, upserted.id);
      console.log(`✅ دسته اصلی: ${cat.name} (ID: ${upserted.id})`);
    }
  }

  // ===== مرحله ۲: ایجاد یا به‌روزرسانی دسته‌های فرعی =====
  for (const cat of adCategoriesData) {
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

      // بررسی وجود دسته با این name
      let existing = await prisma.adCategory.findFirst({
        where: { name: cat.name },
      });

      if (existing) {
        // به‌روزرسانی
        await prisma.adCategory.update({
          where: { id: existing.id },
          data: { name: cat.name, parent: parentId },
        });
      } else {
        // ایجاد جدید
        await prisma.adCategory.create({
          data: { name: cat.name, parent: parentId },
        });
      }

      console.log(`✅ زیردسته: ${cat.name} (پدر: ${parentName})`);
    }
  }

  console.log("🎉 Seed دسته‌بندی آگهی‌ها با موفقیت انجام شد!");
}

if (require.main === module) {
  seedAdCategories()
    .catch((e) => {
      console.error("خطا در Seed دسته‌بندی آگهی‌ها:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default seedAdCategories;
