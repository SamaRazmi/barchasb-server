import { Router } from "express";
import StatsController from "../controllers/StatsController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: مدیریت آمار بازدیدها
 */

/**
 * @swagger
 * /api/track-view:
 *   post:
 *     summary: ثبت بازدید آگهی
 *     tags: [Stats]
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
 *         description: بازدید ثبت شد
 *       400:
 *         description: اطلاعات ناقص
 *       401:
 *         description: احراز هویت نشده
 */
router.post("/track-view", StatsController.trackAdView);

/**
 * @swagger
 * /api/user-views:
 *   get:
 *     summary: دریافت آمار بازدیدهای کاربر
 *     tags: [Stats]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: period
 *         in: query
 *         schema:
 *           type: string
 *           enum: [weekly, monthly]
 *         default: weekly
 *       - name: adType
 *         in: query
 *         schema:
 *           type: string
 *           enum: [EmployerAd, JobSeekerAd, SellerAd, DigitalAd, all]
 *         default: all
 *     responses:
 *       200:
 *         description: آمار بازدیدها
 */
router.get("/user-views", StatsController.getUserViewStats);

/**
 * @swagger
 * /api/ad-views/{adId}:
 *   get:
 *     summary: دریافت آمار بازدید یک آگهی خاص
 *     tags: [Stats]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: adId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: adType
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           enum: [EmployerAd, JobSeekerAd, SellerAd, DigitalAd]
 *       - name: period
 *         in: query
 *         schema:
 *           type: string
 *           enum: [weekly, monthly]
 *         default: weekly
 *     responses:
 *       200:
 *         description: آمار بازدیدهای آگهی
 *       403:
 *         description: شما مالک این آگهی نیستید
 */
router.get("/ad-views/:adId", StatsController.getAdViewStats);

/**
 * @swagger
 * /api/ad-view-summary/{adId}:
 *   get:
 *     summary: دریافت خلاصه آمار بازدید یک آگهی
 *     tags: [Stats]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: adId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: adType
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           enum: [EmployerAd, JobSeekerAd, SellerAd, DigitalAd]
 *     responses:
 *       200:
 *         description: خلاصه آمار بازدیدها
 *       403:
 *         description: شما مالک این آگهی نیستید
 */
router.get("/ad-view-summary/:adId", StatsController.getAdViewSummaryStats);

export default router;
