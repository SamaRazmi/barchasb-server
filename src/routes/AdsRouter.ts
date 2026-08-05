import { Router } from "express";
import AdsCtrl from "../controllers/AdsCtrl";
import { authenticateUser } from "../middleware/authMidleware";

const router = Router();

/**
 * @swagger
 * /api/ads/all:
 *   get:
 *     summary: دریافت همه آگهی‌های تأیید شده و معتبر (عمومی)
 *     tags: [Ads]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: adType
 *         schema: { type: string }
 *         description: نوع آگهی (مثلاً DigitalAd,EmployerAd)
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: province
 *         schema: { type: string }
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: موفق }
 *       400: { description: خطا }
 */
router.get("/ads/all", AdsCtrl.getAll);

/**
 * @swagger
 * /api/ads/user:
 *   get:
 *     summary: دریافت آگهی‌های تأیید شده کاربر جاری + (اختیاری) آگهی‌های عمومی دیگران
 *     tags: [Ads]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: includeOthers
 *         schema: { type: boolean, default: false }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: موفق }
 *       401: { description: احراز هویت نشده }
 *       400: { description: خطا }
 */
router.get("/ads/user", authenticateUser, AdsCtrl.getUserAds);

/**
 * @swagger
 * /api/ads/user/stats:
 *   get:
 *     summary: دریافت آمار تعداد کل و فعال آگهی‌های کاربر جاری (به تفکیک نوع)
 *     tags: [Ads]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalAll:
 *                       type: number
 *                     totalActive:
 *                       type: number
 *                     breakdown:
 *                       type: object
 *                       properties:
 *                         digital:
 *                           type: object
 *                           properties:
 *                             all: { type: number }
 *                             active: { type: number }
 *                         employer:
 *                           type: object
 *                           properties:
 *                             all: { type: number }
 *                             active: { type: number }
 *                         jobSeeker:
 *                           type: object
 *                           properties:
 *                             all: { type: number }
 *                             active: { type: number }
 *                         seller:
 *                           type: object
 *                           properties:
 *                             all: { type: number }
 *                             active: { type: number }
 *       401: { description: احراز هویت نشده }
 *       400: { description: خطا }
 */
router.get("/ads/user/stats", authenticateUser, AdsCtrl.getUserStats);

export default router;
