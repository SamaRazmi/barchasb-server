// src/routes/inAppNotificationRoutes.ts

import { Router } from "express";
import {
  getInAppNotifications,
  markNotificationAsRead,
} from "../controllers/inAppNotificationCtrl";
import { authenticateToken } from "../middleware/authMidleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: InAppNotifications
 *   description: مدیریت نوتیفیکیشن‌های درون برنامه‌ای (In-App Notifications)
 */

/**
 * @swagger
 * /api/user/notifications/in-app:
 *   get:
 *     summary: دریافت لیست نوتیفیکیشن‌های کاربر جاری
 *     tags: [InAppNotifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: موفق - لیست نوتیفیکیشن‌ها به‌همراه وضعیت خوانده‌شدن
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       title:
 *                         type: string
 *                         example: "✅ تأیید آگهی دیجیتال"
 *                       message:
 *                         type: string
 *                         example: "آگهی شما با عنوان \"طراحی سایت فروشگاهی\" در تاریخ ۱۴۰۴/۰۵/۲۳ تأیید شد."
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-08-13T10:00:00.000Z"
 *                       isRead:
 *                         type: boolean
 *                         example: false
 *       401:
 *         description: احراز هویت نشده - کاربر لاگین نیست
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *                 message:
 *                   type: string
 *                   example: "لطفاً وارد حساب کاربری خود شوید"
 *       500:
 *         description: خطای سرور
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *                 message:
 *                   type: string
 *                   example: "خطا در دریافت پیام‌ها"
 */
router.get(
  "/user/notifications/in-app",
  authenticateToken,
  getInAppNotifications,
);

/**
 * @swagger
 * /api/user/notifications/in-app/{id}/read:
 *   patch:
 *     summary: علامت‌گذاری یک نوتیفیکیشن به عنوان خوانده‌شده
 *     tags: [InAppNotifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه یکتای نوتیفیکیشن
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: موفق - نوتیفیکیشن با موفقیت خوانده شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "نوتیفیکیشن با موفقیت خوانده شد"
 *       400:
 *         description: شناسه نوتیفیکیشن نامعتبر است
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid ID"
 *                 message:
 *                   type: string
 *                   example: "شناسه نوتیفیکیشن معتبر نیست"
 *       401:
 *         description: احراز هویت نشده
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *                 message:
 *                   type: string
 *                   example: "لطفاً وارد حساب کاربری خود شوید"
 *       404:
 *         description: نوتیفیکیشن یافت نشد یا قبلاً خوانده شده است
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not found"
 *                 message:
 *                   type: string
 *                   example: "نوتیفیکیشن مورد نظر یافت نشد یا قبلاً خوانده شده است"
 *       500:
 *         description: خطای سرور
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *                 message:
 *                   type: string
 *                   example: "خطا در به‌روزرسانی نوتیفیکیشن"
 */
router.patch(
  "/user/notifications/in-app/:id/read",
  authenticateToken,
  markNotificationAsRead,
);

export default router;
