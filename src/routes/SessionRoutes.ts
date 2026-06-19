import { Router } from "express";
import SessionCtrl from "../controllers/SessionCtrl";
import { authenticateToken } from "../middleware/authMidleware";

const router = Router();

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: دریافت لیست جلسات فعال کاربر
 *     tags: [Sessions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: لیست جلسات
 *       401:
 *         description: احراز هویت نشده
 */
router.get("/sessions", authenticateToken, SessionCtrl.getUserSessions);

/**
 * @swagger
 * /api/sessions/{id}/read:
 *   patch:
 *     summary: علامت‌گذاری جلسه به عنوان خوانده شده
 *     tags: [Sessions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: جلسه علامت‌گذاری شد
 *       404:
 *         description: جلسه یافت نشد
 */
router.patch(
  "/sessions/:id/read",
  authenticateToken,
  SessionCtrl.markSessionAsRead,
);

/**
 * @swagger
 * /api/sessions/{id}:
 *   delete:
 *     summary: حذف یک جلسه (غیرفعال کردن)
 *     tags: [Sessions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: جلسه حذف شد
 *       404:
 *         description: جلسه یافت نشد
 */
router.delete("/sessions/:id", authenticateToken, SessionCtrl.deleteSession);

/**
 * @swagger
 * /api/sessions/logout-all:
 *   post:
 *     summary: خروج از همه جلسات
 *     tags: [Sessions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: همه جلسات بسته شدند
 */
router.post(
  "/sessions/logout-all",
  authenticateToken,
  SessionCtrl.logoutAllSessions,
);

export default router;
