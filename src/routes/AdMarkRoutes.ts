import express from "express";

// import controllers (همانند require قبلی به صورت namespace)
import * as AdMarkCtrl from "../controllers/AdMarkCtrl";
// middleware (اگر قرار است استفاده شود، ولی در مسیرها اعمال نشده)
// import { authenticateToken } from "../middleware/authMidleware";

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: مارک اضافه/حذف شد
 *                 marked:
 *                   type: boolean
 *       400:
 *         description: خطا در داده‌ها
 *       500:
 *         description: خطای سرور
 */
router.post("/ads/:adId/mark", AdMarkCtrl.toggleMark);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 marked:
 *                   type: boolean
 *       400:
 *         description: پارامترهای لازم ارسال نشده
 *       500:
 *         description: خطای سرور
 */
router.get("/ads/:id/is-marked", AdMarkCtrl.isAdMarked);

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
 *         description: نوع آگهی (مثلاً 'job' یا 'service')
 *     responses:
 *       200:
 *         description: لیست آگهی‌های نشان‌شده
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ads:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: خطای سرور
 */
router.get("/users/:userId/marked-ads/:adType", AdMarkCtrl.getMarkedAds);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ads:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: خطای سرور
 */
router.get("/marks/:userId/all", AdMarkCtrl.getAllMarkedAds);

export default router;