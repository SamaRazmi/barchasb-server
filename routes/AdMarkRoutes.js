const express = require("express");
const router = express.Router();

const AdMarkCtrl = require("../controllers/AdMarkCtrl");
const {authenticateToken} = require("../middleware/authMidleware"); // در صورت نیاز

// ------------------- مدیریت مارک آگهی -------------------

// ➕ اضافه یا حذف مارک روی آگهی
router.post("/ads/:adId/mark", AdMarkCtrl.toggleMark);

// 📌 بررسی اینکه آگهی مارک شده یا نه
router.get("/ads/:id/is-marked", AdMarkCtrl.isAdMarked);

// 📥 گرفتن همه آگهی‌های نشان شده یک کاربر بر اساس نوع آگهی
router.get("/users/:userId/marked-ads/:adType", AdMarkCtrl.getMarkedAds);

// 📥 گرفتن همه نشان شده‌ها (تمام آگهی‌ها)
router.get("/marks/:userId/all", AdMarkCtrl.getAllMarkedAds);

module.exports = router;
