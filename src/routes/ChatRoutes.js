const express = require("express");
const router = express.Router();
const ChatCtrl = require("../controllers/ChatCtrl");
const { authenticateToken } = require("../middleware/authMidleware");

// ارسال پیام
router.post("/chat/send", authenticateToken, ChatCtrl.sendMessage);

// تاریخچه پیام‌های یک آگهی مشخص
router.get(
  "/chat/history/:adType/:adId/:userId1/:userId2",
  authenticateToken,
  ChatCtrl.getMessages,
);

// وضعیت آنلاین کاربر
router.get("/chat/status/:userId", authenticateToken, ChatCtrl.getUserStatus);

// گرفتن لیست مکالمات یک کاربر
router.get(
  "/chat/conversations/:userId",
  authenticateToken,
  ChatCtrl.getConversations,
);

// وضعیت تایپ کردن
router.post("/chat/typing", authenticateToken, ChatCtrl.typingStatus);

// ========== جدید ==========
router.get(
  "/chat/unread-count/:userId",
  authenticateToken,
  ChatCtrl.getUnreadCounts,
);
router.get(
  "/chat/unread-details/:userId",
  authenticateToken,
  ChatCtrl.getUnreadDetails,
);
router.post("/chat/mark-read", authenticateToken, ChatCtrl.markMessagesAsRead);

module.exports = router;
