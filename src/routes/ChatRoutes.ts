// src/routes/ChatRoutes.ts
import { Router } from "express";
import * as ChatCtrl from "../controllers/ChatCtrl";
import { authenticateToken } from "../middleware/authMidleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: مدیریت چت و پیام‌رسانی
 */

/**
 * @swagger
 * /api/chat/send:
 *   post:
 *     summary: ارسال پیام جدید
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - from
 *               - to
 *               - adId
 *               - adType
 *               - content
 *             properties:
 *               from:
 *                 type: string
 *                 description: شناسه کاربر فرستنده
 *               to:
 *                 type: string
 *                 description: شناسه کاربر گیرنده
 *               adId:
 *                 type: string
 *                 description: شناسه آگهی مربوطه
 *               adType:
 *                 type: string
 *                 enum: [EmployerAd, JobSeekerAd, SellerAd]
 *                 description: نوع آگهی
 *               content:
 *                 type: string
 *                 description: متن پیام
 *               type:
 *                 type: string
 *                 description: نوع پیام (text, image, ...)
 *     responses:
 *       201:
 *         description: پیام با موفقیت ارسال شد
 *       400:
 *         description: اطلاعات ناقص
 *       401:
 *         description: احراز هویت نشده
 *       500:
 *         description: خطای سرور
 */
router.post("/chat/send", authenticateToken, ChatCtrl.sendMessage);

/**
 * @swagger
 * /api/chat/history/{adType}/{adId}/{userId1}/{userId2}:
 *   get:
 *     summary: دریافت تاریخچه پیام‌های یک آگهی بین دو کاربر
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [EmployerAd, JobSeekerAd, SellerAd]
 *         description: نوع آگهی
 *       - in: path
 *         name: adId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه آگهی
 *       - in: path
 *         name: userId1
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر اول
 *       - in: path
 *         name: userId2
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر دوم
 *     responses:
 *       200:
 *         description: موفق - لیست پیام‌ها
 *       401:
 *         description: احراز هویت نشده
 *       500:
 *         description: خطای سرور
 */
router.get(
  "/chat/history/:adType/:adId/:userId1/:userId2",
  authenticateToken,
  ChatCtrl.getMessages,
);

/**
 * @swagger
 * /api/chat/status/{userId}:
 *   get:
 *     summary: دریافت وضعیت آنلاین کاربر
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *     responses:
 *       200:
 *         description: موفق - وضعیت آنلاین و آخرین بازدید
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 online:
 *                   type: boolean
 *                 lastSeen:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: احراز هویت نشده
 *       500:
 *         description: خطای سرور
 */
router.get("/chat/status/:userId", authenticateToken, ChatCtrl.getUserStatus);

/**
 * @swagger
 * /api/chat/conversations/{userId}:
 *   get:
 *     summary: دریافت لیست مکالمات یک کاربر
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *     responses:
 *       200:
 *         description: موفق - لیست مکالمات
 *       401:
 *         description: احراز هویت نشده
 *       500:
 *         description: خطای سرور
 */
router.get(
  "/chat/conversations/:userId",
  authenticateToken,
  ChatCtrl.getConversations,
);

/**
 * @swagger
 * /api/chat/typing:
 *   post:
 *     summary: ارسال وضعیت تایپ کردن به کاربر مقابل
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromUserId
 *               - toUserId
 *             properties:
 *               fromUserId:
 *                 type: string
 *                 description: شناسه کاربر تایپ‌کننده
 *               toUserId:
 *                 type: string
 *                 description: شناسه کاربر گیرنده
 *               isTyping:
 *                 type: boolean
 *                 description: وضعیت تایپ
 *     responses:
 *       200:
 *         description: موفق
 *       401:
 *         description: احراز هویت نشده
 *       500:
 *         description: خطای سرور
 */
router.post("/chat/typing", authenticateToken, ChatCtrl.typingStatus);

// ======================= جدید (بخش unread) =======================

/**
 * @swagger
 * /api/chat/unread-count/{userId}:
 *   get:
 *     summary: دریافت تعداد پیام‌های خوانده نشده به تفکیک نوع آگهی
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *     responses:
 *       200:
 *         description: موفق - تعداد پیام‌های خوانده نشده
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     karjo:
 *                       type: integer
 *                       description: تعداد پیام‌های نخوانده برای JobSeekerAd
 *                     karfarma:
 *                       type: integer
 *                       description: تعداد پیام‌های نخوانده برای EmployerAd
 *                     agahi:
 *                       type: integer
 *                       description: تعداد پیام‌های نخوانده برای SellerAd
 *       401:
 *         description: احراز هویت نشده
 *       500:
 *         description: خطای سرور
 */
router.get(
  "/chat/unread-count/:userId",
  authenticateToken,
  ChatCtrl.getUnreadCounts,
);

/**
 * @swagger
 * /api/chat/unread-details/{userId}:
 *   get:
 *     summary: دریافت تعداد پیام‌های خوانده نشده برای هر مکالمه
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *     responses:
 *       200:
 *         description: موفق - جزئیات تعداد پیام‌های نخوانده به تفکیک conversation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                   description: کلید = شناسه conversation، مقدار = تعداد پیام‌های نخوانده
 *       401:
 *         description: احراز هویت نشده
 *       500:
 *         description: خطای سرور
 */
router.get(
  "/chat/unread-details/:userId",
  authenticateToken,
  ChatCtrl.getUnreadDetails,
);

/**
 * @swagger
 * /api/chat/mark-read:
 *   post:
 *     summary: علامت زدن تمام پیام‌های یک مکالمه به عنوان خوانده شده
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - conversationId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: شناسه کاربری که پیام‌ها را خوانده است
 *               conversationId:
 *                 type: string
 *                 description: شناسه مکالمه
 *     responses:
 *       200:
 *         description: موفق - پیام‌ها به عنوان خوانده شده علامت زده شدند
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 modifiedCount:
 *                   type: integer
 *       400:
 *         description: اطلاعات ناقص
 *       401:
 *         description: احراز هویت نشده
 *       500:
 *         description: خطای سرور
 */
router.post("/chat/mark-read", authenticateToken, ChatCtrl.markMessagesAsRead);

export default router;
