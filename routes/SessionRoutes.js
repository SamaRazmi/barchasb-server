const router = require("express").Router();

const SessionCtrl = require("../controllers/SessionCtrl");
const { authenticateToken } = require("../middleware/authMidleware");

//
// 📱 لیست دستگاه‌ها (همراه با تعداد نخوانده‌ها)
//
router.get("/sessions", authenticateToken, SessionCtrl.getUserSessions);

//
// ✅ علامت‌گذاری یک جلسه به عنوان خوانده شده
//
router.patch(
  "/sessions/:id/read",
  authenticateToken,
  SessionCtrl.markSessionAsRead,
);

//
// ❌ حذف یک دستگاه
//
router.delete("/sessions/:id", authenticateToken, SessionCtrl.deleteSession);

//
// 🚪 logout همه دستگاه‌ها
//
router.post(
  "/sessions/logout-all",
  authenticateToken,
  SessionCtrl.logoutAllSessions,
);

module.exports = router;
