const express = require("express");
const router = express.Router();
const NotificationCtrl = require("../controllers/NotificationCtrl");

// گرفتن اعلان‌های کاربر
router.get("/notifications/:userId", NotificationCtrl.getUserNotifications);

// علامت‌گذاری همه اعلان‌ها به عنوان خوانده شده
router.post("/notifications/markAsRead/:userId", NotificationCtrl.markAsRead);

module.exports = router;
