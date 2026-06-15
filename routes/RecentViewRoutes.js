const express = require("express");
const router = express.Router();

const RecentViewCtrl = require("../controllers/RecentViewCtrl");

// ------------------- مدیریت بازدیدهای اخیر -------------------

// ➕ ثبت یا آپدیت بازدید اخیر
// adType مثل EmployerAd / JobSeekerAd / SellerAd
router.post("/ads/:adType/:ownerId/:adId/view", RecentViewCtrl.addRecentView);

// 📥 گرفتن همه بازدیدهای اخیر یک کاربر بر اساس نوع آگهی
router.get(
  "/users/:ownerId/recent-views/:adType",
  RecentViewCtrl.getRecentViews,
);

// 📥 گرفتن همه بازدیدهای اخیر (تمام نوع‌ها)
router.get("/recent-views/:ownerId/all", RecentViewCtrl.getAllRecentViews);
// 📥 پیشرفته: فیلتر نوع + زمان + pagination
router.get(
  "/users/:ownerId/recent-views",
  RecentViewCtrl.getRecentViewsAdvanced,
);

module.exports = router;
