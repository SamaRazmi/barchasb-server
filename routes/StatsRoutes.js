const express = require("express");
const router = express.Router();
const StatsController = require("../controllers/StatsController");

// مسیر ثبت بازدید آگهی (موجود)
router.post("/track-view", StatsController.trackAdView);

// مسیر دریافت آمار همه آگهی‌های کاربر (موجود)
router.get("/user-views", StatsController.getUserViewStats);

// مسیر دریافت آمار یک آگهی خاص (همان قبل)
router.get("/ad-views/:adId", StatsController.getAdViewStats);

// ✅ مسیر جدید: دریافت خلاصه آمار بازدید یک آگهی (مناسب برای VisitStatsModal)
router.get("/ad-view-summary/:adId", StatsController.getAdViewSummaryStats);

module.exports = router;
