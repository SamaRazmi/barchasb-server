const express = require("express");
const router = express.Router();
const ChatCtrl = require("../controllers/ChatCtrl");

// ارسال پیام
router.post("/chat/send", ChatCtrl.sendMessage);

// تاریخچه پیام‌های یک آگهی مشخص
router.get(
  "/chat/history/:adType/:adId/:userId1/:userId2",
  ChatCtrl.getMessages,
);

// وضعیت آنلاین کاربر
router.get("/chat/status/:userId", ChatCtrl.getUserStatus);

// گرفتن لیست مکالمات یک کاربر
router.get("/chat/conversations/:userId", ChatCtrl.getConversations);

// وضعیت تایپ کردن
router.post("/chat/typing", ChatCtrl.typingStatus);

// ========== جدید ==========
// گرفتن تعداد پیام‌های خوانده نشده برای هر adType (کارجو، کارفرما، آگهی)
router.get("/chat/unread-count/:userId", ChatCtrl.getUnreadCounts);

// گرفتن تعداد پیام‌های خوانده نشده برای هر مکالمه (جزئی)
router.get("/chat/unread-details/:userId", ChatCtrl.getUnreadDetails);

// علامت زدن پیام‌های یک مکالمه به عنوان خوانده شده
router.post("/chat/mark-read", ChatCtrl.markMessagesAsRead);
// ==========================

module.exports = router;
