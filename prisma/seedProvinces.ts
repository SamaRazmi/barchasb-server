import fs from "fs";
import path from "path";
import prisma from "../src/config/prisma";

// خواندن فایل‌های JSON (با استفاده از fs)
const ostanPath = path.join(__dirname, "../src/data/ostan.json");
const shahrPath = path.join(__dirname, "../src/data/shahr.json");

const provincesData = JSON.parse(fs.readFileSync(ostanPath, "utf8"));
const citiesData = JSON.parse(fs.readFileSync(shahrPath, "utf8"));

export async function seedProvinces() {
  console.log("🌱 شروع seed استان‌ها و شهرها...");

  // حذف تمام استان‌های قبلی (برای جلوگیری از تکراری)
  await prisma.province.deleteMany({});
  console.log("🗑️ استان‌های قبلی حذف شدند");

  // ایجاد Map از id استان به نام استان
  const provinceMap = new Map(provincesData.map((p: any) => [p.id, p.name]));

  // ساخت داده‌های نهایی
  const finalData = provincesData.map((prov: any) => {
    const cities = citiesData
      .filter((city: any) => city.ostan === prov.id)
      .map((city: any) => city.name);
    return {
      name: prov.name,
      cities: cities,
    };
  });

  // درج دسته‌جمعی (با createMany)
  const result = await prisma.province.createMany({
    data: finalData,
    skipDuplicates: true, // در صورت وجود داده تکراری (با توجه به name)
  });

  console.log(`✅ ${result.count} استان با شهرهای مربوطه درج شدند!`);

  console.log("🎉 Seed استان‌ها و شهرها با موفقیت انجام شد!");
}

if (require.main === module) {
  seedProvinces()
    .catch((e) => {
      console.error(" خطا در Seed استان‌ها:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default seedProvinces;
