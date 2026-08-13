import prisma from "../src/config/prisma";

const categoryData = [
  { name: "هوش مصنوعی و یادگیری ماشین", slug: "ai-ml" },
  { name: "برنامه‌نویسی و توسعه نرم‌افزار", slug: "programming" },
  { name: "داده‌پردازی و تحلیل داده", slug: "data-analytics" },
  { name: "امنیت سایبری", slug: "cybersecurity" },
  { name: "شبکه و زیرساخت", slug: "networking" },
  { name: "طراحی UI/UX و تجربه کاربری", slug: "ui-ux" },
  { name: "کارآفرینی و استارتاپ", slug: "entrepreneurship" },
  { name: "مدیریت و رهبری", slug: "management" },
  { name: "بازاریابی دیجیتال", slug: "digital-marketing" },
  { name: "فروش و مذاکره", slug: "sales" },
  { name: "مالی و حسابداری", slug: "finance" },
  { name: "طراحی گرافیک و تصویرسازی", slug: "graphic-design" },
  { name: "تولید محتوا و نویسندگی", slug: "content-writing" },
  { name: "فیلم‌برداری و تدوین", slug: "video-editing" },
  { name: "مهندسی مکانیک و ساخت‌وپرداز", slug: "mechanical-engineering" },
  { name: "عمران و معماری", slug: "civil-architecture" },
  { name: "پزشکی و سلامت", slug: "healthcare" },
  { name: "آموزش و تدریس", slug: "education" },
  { name: "روانشناسی و مشاوره", slug: "psychology" },
  { name: "حقوق و مشاوره حقوقی", slug: "legal" },
  { name: "ترجمه و زبان‌های خارجی", slug: "translation" },
];

export async function seedCategories() {
  console.log("شروع سید دسته‌بندی مقالات...");

  let count = 0;
  for (const item of categoryData) {
    try {
      const result = await prisma.articleCategory.upsert({
        where: { slug: item.slug },
        update: { name: item.name },
        create: { name: item.name, slug: item.slug },
      });
      if (result) count++;
    } catch (error) {
      console.error(`❌ خطا در درج دسته ${item.name}:`, error);
    }
  }

  console.log(`✅ ${count} دسته‌بندی با موفقیت سید شدند!`);
}

seedCategories()
  .catch((e) => {
    console.error("❌ خطا در Seed دسته‌بندی:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default seedCategories;
