import express from "express";

// import controllers
import * as AdMarkCtrl from "../controllers/AdMarkCtrl";
// فعال‌سازی middleware احراز هویت
import { authenticateToken } from "../middleware/authMidleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AdMarks
 *   description: مدیریت نشان‌گذاری آگهی‌ها
 */

// ------------------- مدیریت مارک آگهی -------------------

/**
 * @swagger
 * /api/ads/{adId}/mark:
 *   post:
 *     summary: اضافه یا حذف مارک روی آگهی (toggle)
 *     tags: [AdMarks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه آگهی
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: شناسه کاربر
 *     responses:
 *       200:
 *         description: عملیات با موفقیت انجام شد
 *       400:
 *         description: خطا در داده‌ها
 *       401:
 *         description: احراز هویت نشده
 *       500:
 *         description: خطای سرور
 */
router.post("/ads/:adId/mark", authenticateToken, AdMarkCtrl.toggleMark);

/**
 * @swagger
 * /api/ads/{id}/is-marked:
 *   get:
 *     summary: بررسی اینکه آگهی برای کاربر مشخص مارک شده است یا نه
 *     tags: [AdMarks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه آگهی
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *     responses:
 *       200:
 *         description: نتیجه بررسی
 *       401:
 *         description: احراز هویت نشده
 *       500:
 *         description: خطای سرور
 */
router.get("/ads/:id/is-marked", authenticateToken, AdMarkCtrl.isAdMarked);

/**
 * @swagger
 * /api/users/{userId}/marked-ads/{adType}:
 *   get:
 *     summary: دریافت همه آگهی‌های نشان‌شده یک کاربر بر اساس نوع آگهی
 *     tags: [AdMarks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *       - in: path
 *         name: adType
 *         required: true
 *         schema:
 *           type: string
 *         description: نوع آگهی
 *     responses:
 *       200:
 *         description: لیست آگهی‌های نشان‌شده
 *       401:
 *         description: احراز هویت نشده
 *       500:
 *         description: خطای سرور
 */
router.get(
  "/users/:userId/marked-ads/:adType",
  authenticateToken,
  AdMarkCtrl.getMarkedAds,
);

/**
 * @swagger
 * /api/marks/{userId}/all:
 *   get:
 *     summary: دریافت همه نشان‌شده‌ها (تمام آگهی‌های نشان‌شده یک کاربر)
 *     tags: [AdMarks]
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
 *         description: لیست کامل آگهی‌های نشان‌شده
 *       401:
 *         description: احراز هویت نشده
 *       500:
 *         description: خطای سرور
 */
router.get("/marks/:userId/all", authenticateToken, AdMarkCtrl.getAllMarkedAds);

// ======================== BATCH ENDPOINT WITH AUTH ========================
/**
 * @swagger
 * /api/ads/batch-is-marked:
 *   post:
 *     summary: بررسی گروهی نشان‌گذاری آگهی‌ها برای کاربر جاری
 *     tags: [AdMarks]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     adId:
 *                       type: string
 *                     adType:
 *                       type: string
 *     responses:
 *       200:
 *         description: نتیجه بررسی برای هر آیتم
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       adId:
 *                         type: string
 *                       marked:
 *                         type: boolean
 *       400:
 *         description: پارامترهای لازم ارسال نشده
 *       401:
 *         description: احراز هویت نشده
 *       500:
 *         description: خطای سرور
 */
router.post(
  "/ads/batch-is-marked",
  authenticateToken,
  AdMarkCtrl.batchIsMarked,
);

export default router;
