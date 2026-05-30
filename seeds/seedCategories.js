require("dotenv").config();
const mongoose = require("mongoose");
const JobCategory = require("../models/JobCategory"); // استفاده از مدل اصلی
const categoriesData = require("../data/jobCategoriesData");

const seedDB = async () => {
  try {
    const uri = process.env.MONGO_URL;
    if (!uri) {
      console.error("❌ MONGO_URL در فایل .env تعریف نشده");
      process.exit(1);
    }
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB\n");

    // دسترسی مستقیم به دیتابیس برای پاک کردن کلکشن‌های اضافی
    const db = mongoose.connection.db;

    // 1. خالی کردن کلکشن categories (اگر وجود داشته باشد)
    await db.collection("categories").deleteMany({});
    console.log('🗑️  کلکشن "categories" خالی شد.');

    // 2. خالی کردن کلکشن jobcategories (از طریق مدل هم می‌شود)
    await JobCategory.deleteMany({});
    console.log('🗑️  کلکشن "jobcategories" خالی شد.');

    // 3. درج داده‌ها با حفظ ارتباط والد-فرزندی (با ObjectId)
    // ابتدا همه دسته‌ها را بدون والد ذخیره می‌کنیم تا _id تولید شود
    const insertedDocs = [];
    for (const cat of categoriesData) {
      const newCat = new JobCategory({
        name: cat.name,
        parent: null, // موقتاً null
      });
      await newCat.save();
      insertedDocs.push({ ...cat, _id: newCat._id });
    }

    // حالا برای هر دسته، اگر parent داشته باشد، parentId را پیدا و به‌روزرسانی می‌کنیم
    for (let i = 0; i < insertedDocs.length; i++) {
      const originalCat = categoriesData[i];
      if (originalCat.parent) {
        // پیدا کردن والد در insertedDocs بر اساس id اصلی
        const parentDoc = insertedDocs.find(
          (doc) => doc.id === originalCat.parent,
        );
        if (parentDoc) {
          await JobCategory.findByIdAndUpdate(insertedDocs[i]._id, {
            parent: parentDoc._id,
          });
        }
      }
    }

    console.log(
      `✅ ${insertedDocs.length} دسته‌بندی در "jobcategories" ذخیره شد.`,
    );
    console.log("\n🎉 فرآیند سید کامل شد.");
    process.exit(0);
  } catch (err) {
    console.error("❌ خطا در سید کردن:", err);
    process.exit(1);
  }
};

seedDB();
