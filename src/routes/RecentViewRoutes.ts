import { Router } from "express";
import RecentViewCtrl from "../controllers/RecentViewCtrl";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: RecentViews
 *   description: مدیریت بازدیدهای اخیر
 */

/**
 * @swagger
 * /api/ads/{adType}/{ownerId}/{adId}/view:
 *   post:
 *     summary: ثبت یا آپدیت بازدید اخیر
 *     tags: [RecentViews]
 *     parameters:
 *       - name: adType
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [EmployerAd, JobSeekerAd, SellerAd, DigitalAd]
 *       - name: ownerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: adId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: بازدید ذخیره شد
 *       400:
 *         description: پارامترها ناقص هستند
 */
router.post("/ads/:adType/:ownerId/:adId/view", RecentViewCtrl.addRecentView);

/**
 * @swagger
 * /api/users/{ownerId}/recent-views/{adType}:
 *   get:
 *     summary: دریافت بازدیدهای اخیر یک کاربر بر اساس نوع آگهی
 *     tags: [RecentViews]
 *     parameters:
 *       - name: ownerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: adType
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [EmployerAd, JobSeekerAd, SellerAd, DigitalAd]
 *     responses:
 *       200:
 *         description: لیست بازدیدها
 */
router.get(
  "/users/:ownerId/recent-views/:adType",
  RecentViewCtrl.getRecentViews,
);

/**
 * @swagger
 * /api/recent-views/{ownerId}/all:
 *   get:
 *     summary: دریافت همه بازدیدهای اخیر یک کاربر (بدون فیلتر نوع)
 *     tags: [RecentViews]
 *     parameters:
 *       - name: ownerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: لیست بازدیدها
 */
router.get("/recent-views/:ownerId/all", RecentViewCtrl.getAllRecentViews);

/**
 * @swagger
 * /api/users/{ownerId}/recent-views:
 *   get:
 *     summary: دریافت بازدیدهای اخیر با فیلترهای پیشرفته
 *     tags: [RecentViews]
 *     parameters:
 *       - name: ownerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: adType
 *         in: query
 *         schema:
 *           type: string
 *           enum: [EmployerAd, JobSeekerAd, SellerAd, DigitalAd, all]
 *         default: all
 *       - name: time
 *         in: query
 *         schema:
 *           type: string
 *           enum: [today, week, month, all]
 *         default: all
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *         default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *         default: 20
 *     responses:
 *       200:
 *         description: لیست بازدیدها
 */
router.get(
  "/users/:ownerId/recent-views",
  RecentViewCtrl.getRecentViewsAdvanced,
);

export default router;
