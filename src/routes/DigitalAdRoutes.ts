import express from "express";
import { imagesUpload } from "../middleware/upload";
import DigitalAdCtrl from "../controllers/DigitalAdCtrl";
import { authenticateToken } from "../middleware/authMidleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: DigitalAds
 *   description: مدیریت آگهی‌های دیجیتال
 */

/* =======================
   CREATE
======================= */
/**
 * @swagger
 * /api/ads/digital:
 *   post:
 *     summary: ایجاد آگهی دیجیتال
 *     tags: [DigitalAds]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               digitalTotalDesc:
 *                 type: string
 *               projectNames:
 *                 type: string
 *                 description: JSON آرایه از نام پروژه‌ها
 *               projectDescriptions:
 *                 type: string
 *                 description: JSON آرایه از توضیحات پروژه‌ها
 *               minBudget:
 *                 type: string
 *               maxBudget:
 *                 type: string
 *               requiredSkills:
 *                 type: string
 *                 description: "JSON آرایه از مهارت‌ها (مثال: [{'name': 'برنامه‌نویسی'}])"
 *               person:
 *                 type: string
 *                 enum: [self, other]
 *               remote:
 *                 type: boolean
 *               thursdayHalf:
 *                 type: boolean
 *               paymentMethod:
 *                 type: string
 *                 enum: [Subscription, Wallet, Bank_card]
 *               requestType:
 *                 type: string
 *                 enum: [requester, provider]
 *               durationUnit:
 *                 type: string
 *                 enum: [minute, hour, day, month, year]
 *               durationAmount:
 *                 type: string
 *               province:
 *                 type: string
 *               city:
 *                 type: string
 *               phoneOther:
 *                 type: string
 *     responses:
 *       201:
 *         description: آگهی با موفقیت ایجاد شد
 *       400:
 *         description: خطای اعتبارسنجی
 *       401:
 *         description: توکن معتبر نیست
 *       500:
 *         description: خطای سرور
 */
router.post(
  "/ads/digital",
  authenticateToken,
  imagesUpload.array("images", 9),
  DigitalAdCtrl.createDigitalAd,
);

/* =======================
   GET ALL (با فیلترهای پیشرفته)
======================= */
/**
 * @swagger
 * /api/ads/digital:
 *   get:
 *     summary: دریافت همه آگهی‌های دیجیتال (عمومی) با فیلترهای پیشرفته
 *     tags: [DigitalAds]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: جستجو در عنوان، توضیحات و توضیحات کلی
 *       - in: query
 *         name: timeFilter
 *         schema:
 *           type: string
 *           enum: [today, thisWeek, thisMonth, thisYear]
 *         description: بازه زمانی انتشار
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: استان (تک یا چند مقدار با کاما)
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: شهر (تک یا چند مقدار با کاما)
 *       - in: query
 *         name: requestType
 *         schema:
 *           type: string
 *           enum: [requester, provider]
 *         description: نوع درخواست (درخواست‌دهنده / ارائه‌دهنده)
 *       - in: query
 *         name: minBudget
 *         schema:
 *           type: string
 *         description: حداقل بودجه (به صورت رشته، برای مقایسه عددی نیاز به بهبود دارد)
 *       - in: query
 *         name: maxBudget
 *         schema:
 *           type: string
 *         description: حداکثر بودجه
 *       - in: query
 *         name: durationUnit
 *         schema:
 *           type: string
 *           enum: [minute, hour, day, month, year]
 *         description: واحد زمان (زمان ارائه)
 *       - in: query
 *         name: durationAmount
 *         schema:
 *           type: string
 *         description: مقدار زمان (مثلاً 30)
 *       - in: query
 *         name: remote
 *         schema:
 *           type: boolean
 *         description: دورکاری (true/false)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 9
 *     responses:
 *       200:
 *         description: موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       owner:
 *                         type: object
 *                         properties:
 *                           fullName:
 *                             type: string
 *                           phoneNumber:
 *                             type: string
 *                           province:
 *                             type: string
 *                           city:
 *                             type: string
 *                       enhancements:
 *                         type: object
 *                         properties:
 *                           isSpecial:
 *                             type: boolean
 *                           specialStartDate:
 *                             type: string
 *                             format: date-time
 *                           specialEndDate:
 *                             type: string
 *                             format: date-time
 *                           isLadder:
 *                             type: boolean
 *                           ladders:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                 scheduledAt:
 *                                   type: string
 *                                   format: date-time
 *                                 isExecuted:
 *                                   type: boolean
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: خطای سرور
 */
router.get("/ads/digital", DigitalAdCtrl.getAllDigitalAds);

/**
 * @swagger
 * /api/ads/digital/{id}:
 *   get:
 *     summary: دریافت یک آگهی دیجیتال (عمومی)
 *     tags: [DigitalAds]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: موفق
 *       404:
 *         description: آگهی یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.get("/ads/digital/:id", DigitalAdCtrl.getDigitalAdById);

export default router;
