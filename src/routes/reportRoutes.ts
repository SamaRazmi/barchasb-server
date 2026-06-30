import { Router } from "express";
import reportReasonCtrl from "../controllers/reportReasonCtrl";
import { authorizeAdmin } from "../middleware/authAdmin";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ReportReason
 *   description: مدیریت دلایل گزارش (فقط ادمین)
 */

/**
 * @swagger
 * /api/report-reasons:
 *   get:
 *     summary: دریافت لیست دلایل گزارش
 *     tags: [ReportReason]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [general, employerAd, jobSeekerAd, sellerAd, DigitalAd, chat_employerAd, chat_jobSeekerAd, chat_sellerAd, chat_DigitalAd]
 *         description: نوع دلیل گزارش
 *     responses:
 *       200:
 *         description: لیست دلایل
 *       500:
 *         description: خطای سرور
 */
router.get("/report-reasons", reportReasonCtrl.getReportReasons);

/**
 * @swagger
 * /api/admin/report-reasons:
 *   post:
 *     summary: ایجاد دلیل گزارش جدید (فقط ادمین)
 *     tags: [ReportReason]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - key
 *               - label
 *               - description
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [general, employerAd, jobSeekerAd, sellerAd, DigitalAd, chat_employerAd, chat_jobSeekerAd, chat_sellerAd, chat_DigitalAd]
 *               key:
 *                 type: string
 *               label:
 *                 type: string
 *               description:
 *                 type: string
 *               order:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: دلیل ایجاد شد
 *       400:
 *         description: اطلاعات ناقص
 *       409:
 *         description: دلیل تکراری
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 */
router.post(
  "/admin/report-reasons",
  authorizeAdmin(),
  reportReasonCtrl.createReportReason,
);

/**
 * @swagger
 * /api/admin/report-reasons/{id}:
 *   put:
 *     summary: بروزرسانی دلیل گزارش (فقط ادمین)
 *     tags: [ReportReason]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               key:
 *                 type: string
 *               label:
 *                 type: string
 *               description:
 *                 type: string
 *               order:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: بروزرسانی شد
 *       404:
 *         description: دلیل یافت نشد
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 */
router.put(
  "/admin/report-reasons/:id",
  authorizeAdmin(),
  reportReasonCtrl.updateReportReason,
);

/**
 * @swagger
 * /api/admin/report-reasons/{id}:
 *   delete:
 *     summary: حذف دلیل گزارش (فقط ادمین)
 *     tags: [ReportReason]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: دلیل حذف شد
 *       404:
 *         description: دلیل یافت نشد
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 */
router.delete(
  "/admin/report-reasons/:id",
  authorizeAdmin(),
  reportReasonCtrl.deleteReportReason,
);

export default router;
