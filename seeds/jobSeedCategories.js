const { connectDB } = require("../db"); // اتصال به دیتابیس
const JobCategory = require("../models/JobCategory");
const categoriesJSON = require("../data/jobCategoriesData.js"); // داده‌ها

const seedCategories = async () => {
  await connectDB(); // اتصال به دیتابیس

  // === حذف تمام دسته‌های قبلی ===
  await JobCategory.deleteMany({});
  console.log("🧹 All existing categories removed.");

  // وارد کردن داده‌ها
  for (const cat of categoriesJSON) {
    console.log(`Seeding category: ${cat.name}`); // نمایش لاگ برای هر دسته

    let parentId = null;
    // اگر دسته والد داشته باشد، پیدا کردن والد
    if (cat.parent) {
      const parentItem = categoriesJSON.find((c) => c.id === cat.parent);
      if (parentItem) {
        const parentDoc = await JobCategory.findOne({ name: parentItem.name });
        if (parentDoc) parentId = parentDoc._id;
      }
    }

    // وارد کردن دسته در دیتابیس (دیگر نیازی به بررسی وجود نیست چون قبلاً همه را پاک کردیم)
    await JobCategory.create({
      name: cat.name,
      parent: parentId,
    });
    console.log(`Category ${cat.name} inserted!`);
  }

  console.log("🌱 Job Categories inserted/updated successfully!");
};

module.exports = seedCategories; // صادر کردن تابع برای استفاده در jobRunSeeds
