// src/routes/SuggestionRoutes.ts
import express from "express";
import SuggestionCtrl from "../controllers/SuggestionCtrl";
import { authenticateToken } from "../middleware/authMidleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Suggestions
 *   description: مدیریت پیشنهادات ویژه
 */

/**
 * @swagger
 * /api/suggestions:
 *   get:
 *     summary: دریافت پیشنهادات ویژه
 *     tags: [Suggestions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: عبارت جستجو (اختیاری)
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           default: 10
 *         description: تعداد پیشنهادات درخواستی
 *       - in: query
 *         name: adTypes
 *         schema:
 *           type: string
 *         description: نوع آگهی‌ها - با کاما جدا کنید (EmployerAd, JobSeekerAd, SellerAd, DigitalAd)
 *     responses:
 *       200:
 *         description: موفق - لیست پیشنهادات
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: سقف استفاده رسیده
 */
router.get("/suggestions", authenticateToken, SuggestionCtrl.getSuggestions);

/**
 * @swagger
 * /api/suggestion-preference:
 *   get:
 *     summary: دریافت تنظیمات پیشنهادات کاربر
 *     tags: [Suggestions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: تنظیمات کاربر
 *       401:
 *         description: احراز هویت نشده
 */
router.get(
  "/suggestion-preference",
  authenticateToken,
  SuggestionCtrl.getSuggestionPreference,
);

/**
 * @swagger
 * /api/suggestion-preference:
 *   put:
 *     summary: به‌روزرسانی تنظیمات پیشنهادات کاربر
 *     tags: [Suggestions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalAllowed:
 *                 type: integer
 *               resetPeriod:
 *                 type: string
 *                 enum: [daily, weekly, monthly, never]
 *               preferredAdTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [EmployerAd, JobSeekerAd, SellerAd, DigitalAd]
 *               preferredCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *               filterWeights:
 *                 type: object
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: تنظیمات به‌روزرسانی شد
 *       401:
 *         description: احراز هویت نشده
 */
router.put(
  "/suggestion-preference",
  authenticateToken,
  SuggestionCtrl.updateSuggestionPreference,
);

/**
 * @swagger
 * /api/suggestion-stats:
 *   get:
 *     summary: دریافت آمار استفاده از پیشنهادات
 *     tags: [Suggestions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: آمار استفاده
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 used:
 *                   type: integer
 *                 remaining:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       401:
 *         description: احراز هویت نشده
 */
router.get(
  "/suggestion-stats",
  authenticateToken,
  SuggestionCtrl.getSuggestionStats,
);

/**
 * @swagger
 * /api/suggestions/autocomplete:
 *   get:
 *     summary: جستجوی هوشمند برای پیشنهادات (Autocomplete)
 *     tags: [Suggestions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: عبارت جستجو
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: تعداد نتایج
 *     responses:
 *       200:
 *         description: لیست نتایج
 *       401:
 *         description: احراز هویت نشده
 */
router.get(
  "/suggestions/autocomplete",
  authenticateToken,
  SuggestionCtrl.autocompleteSuggestions,
);

/**
 * @swagger
 * /api/suggestion-view:
 *   post:
 *     summary: ثبت دستی نمایش یک آگهی (در صورت نیاز)
 *     tags: [Suggestions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adId
 *               - adType
 *             properties:
 *               adId:
 *                 type: string
 *               adType:
 *                 type: string
 *                 enum: [EmployerAd, JobSeekerAd, SellerAd, DigitalAd]
 *     responses:
 *       201:
 *         description: ثبت شد
 *       401:
 *         description: احراز هویت نشده
 */
router.post(
  "/suggestion-view",
  authenticateToken,
  SuggestionCtrl.addSuggestionView,
);

export default router;
