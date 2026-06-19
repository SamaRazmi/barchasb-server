// src/routes/reportRoutes.ts
import { Router } from "express";
import reportController from "../controllers/reportController";
import { authenticateUser } from "../middleware/authMidleware";

const router = Router();

// تابع کمکی برای تنظیم req.body
const setReportData = (reportType: string) => (req: any, res: any, next: any) => {
  req.body.targetId = req.params.targetId;
  req.body.reportType = reportType;
  next();
};

/**
 * @swagger
 * tags:
 *   name: Report
 *   description: مدیریت گزارش‌ها
 */

/**
 * @swagger
 * /api/employer/report/{targetId}:
 *   post:
 *     summary: ثبت گزارش برای آگهی کارفرما
 *     tags: [Report]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *               - description
 *             properties:
 *               reason:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: گزارش ثبت شد
 *       401:
 *         description: احراز هویت نشده
 *       400:
 *         description: اطلاعات ناقص
 */
router.post(
  "/employer/report/:targetId",
  authenticateUser,
  setReportData("employerAd"),
  reportController.createReport,
);

/**
 * @swagger
 * /api/job-seeker/report/{targetId}:
 *   post:
 *     summary: ثبت گزارش برای آگهی جوینده کار
 *     tags: [Report]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *               - description
 *             properties:
 *               reason:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: گزارش ثبت شد
 *       401:
 *         description: احراز هویت نشده
 *       400:
 *         description: اطلاعات ناقص
 */
router.post(
  "/job-seeker/report/:targetId",
  authenticateUser,
  setReportData("jobSeekerAd"),
  reportController.createReport,
);

/**
 * @swagger
 * /api/seller/report/{targetId}:
 *   post:
 *     summary: ثبت گزارش برای آگهی فروشنده
 *     tags: [Report]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *               - description
 *             properties:
 *               reason:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: گزارش ثبت شد
 *       401:
 *         description: احراز هویت نشده
 *       400:
 *         description: اطلاعات ناقص
 */
router.post(
  "/seller/report/:targetId",
  authenticateUser,
  setReportData("sellerAd"),
  reportController.createReport,
);

/**
 * @swagger
 * /api/digital/report/{targetId}:
 *   post:
 *     summary: ثبت گزارش برای آگهی دیجیتال
 *     tags: [Report]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *               - description
 *             properties:
 *               reason:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: گزارش ثبت شد
 *       401:
 *         description: احراز هویت نشده
 *       400:
 *         description: اطلاعات ناقص
 */
router.post(
  "/digital/report/:targetId",
  authenticateUser,
  setReportData("DigitalAd"),
  reportController.createReport,
);

/**
 * @swagger
 * /api/chat/report/{targetId}:
 *   post:
 *     summary: ثبت گزارش برای چت
 *     tags: [Report]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *               - description
 *             properties:
 *               reason:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: گزارش ثبت شد
 *       401:
 *         description: احراز هویت نشده
 *       400:
 *         description: اطلاعات ناقص
 */
router.post(
  "/chat/report/:targetId",
  authenticateUser,
  setReportData("chat"),
  reportController.createReport,
);

export default router;