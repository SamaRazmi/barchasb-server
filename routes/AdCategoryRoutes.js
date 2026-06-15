const express = require("express");
const router = express();

// کنترلر
const AdCategoryCtrl = require("../controllers/AdCategoryCtrl").default;

// مسیر دریافت همه دسته‌های اصلی
router.get("/ad-categories/main", AdCategoryCtrl.getMainCategories);

// مسیر دریافت زیر دسته‌ها برای یک دسته اصلی
router.get("/ad-categories/:id/subcategories", AdCategoryCtrl.getSubCategories);

module.exports = router;
