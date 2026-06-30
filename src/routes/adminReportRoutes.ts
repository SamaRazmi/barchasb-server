import { Router } from "express";
import {
  getAllReports,
  getReportById,
  updateReportStatus,
  deleteReport,
  deleteAdByReport,
  blockChatByReport,
} from "../controllers/admin/adminReportController";
import { authAdmin } from "../middleware/authAdmin";

const router = Router();

// اعمال middleware احراز هویت برای تمام مسیرهای این روتر
router.use(authAdmin);

/**
 * @swagger
 * tags:
 *   name: Admin Reports
 *   description: مدیریت گزارش‌ها توسط ادمین (فقط ادمین‌ها)
 */

/**
 * @swagger
 * /api/admin/reports:
 *   get:
 *     summary: دریافت لیست گزارش‌ها با فیلتر و صفحه‌بندی
 *     description: |
 *       این API برای دریافت لیست تمام گزارش‌ها با قابلیت فیلتر بر اساس وضعیت و نوع گزارش و صفحه‌بندی استفاده می‌شود.
 *       فقط ادمین‌ها (ADMIN و SUPER_ADMIN) دسترسی دارند.
 *     tags: [Admin Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, reviewed, rejected]
 *         description: فیلتر بر اساس وضعیت گزارش (در انتظار، بررسی شده، رد شده)
 *         required: false
 *       - in: query
 *         name: reportType
 *         schema:
 *           type: string
 *           enum: [employerAd, jobSeekerAd, sellerAd, DigitalAd, chat]
 *         description: فیلتر بر اساس نوع گزارش (آگهی کارفرما، جوینده کار، فروشنده، دیجیتال، چت)
 *         required: false
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: شماره صفحه برای صفحه‌بندی
 *         required: false
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: تعداد آیتم‌ها در هر صفحه (حداکثر ۱۰۰)
 *         required: false
 *     responses:
 *       200:
 *         description: لیست گزارش‌ها به همراه اطلاعات صفحه‌بندی
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
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
 *       401:
 *         description: احراز هویت نشده (توکن ارائه نشده یا نامعتبر)
 *       403:
 *         description: دسترسی غیرمجاز (فقط ادمین‌ها)
 *       500:
 *         description: خطای داخلی سرور
 */
router.get("/reports", getAllReports);

/**
 * @swagger
 * /api/admin/reports/{id}:
 *   get:
 *     summary: دریافت جزئیات کامل یک گزارش
 *     description: |
 *       این API برای دریافت اطلاعات کامل یک گزارش به همراه جزئیات هدف (آگهی یا چت) و اطلاعات کاربر گزارش‌دهنده استفاده می‌شود.
 *       - برای آگهی‌ها: تمام اطلاعات آگهی به همراه اطلاعات صاحب آگهی برگردانده می‌شود.
 *       - برای چت: اطلاعات چت، طرفین چت و تمام پیام‌های مکالمه به ترتیب زمان برگردانده می‌شود.
 *     tags: [Admin Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه گزارش
 *     responses:
 *       200:
 *         description: جزئیات کامل گزارش
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report:
 *                   $ref: '#/components/schemas/Report'
 *                 target:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/EmployerAd'
 *                     - $ref: '#/components/schemas/JobSeekerAd'
 *                     - $ref: '#/components/schemas/SellerAd'
 *                     - $ref: '#/components/schemas/DigitalAd'
 *                     - $ref: '#/components/schemas/ChatWithConversation'
 *       400:
 *         description: شناسه گزارش معتبر نیست
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 *       404:
 *         description: گزارش یافت نشد
 *       500:
 *         description: خطای داخلی سرور
 */
router.get("/reports/:id", getReportById);

/**
 * @swagger
 * /api/admin/reports/{id}/status:
 *   put:
 *     summary: تغییر وضعیت گزارش
 *     description: |
 *       این API برای تغییر وضعیت یک گزارش استفاده می‌شود.
 *       وضعیت‌های مجاز: pending (در انتظار)، reviewed (بررسی شده)، rejected (رد شده)
 *     tags: [Admin Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه گزارش
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, reviewed, rejected]
 *                 description: وضعیت جدید گزارش
 *     responses:
 *       200:
 *         description: وضعیت گزارش با موفقیت به‌روز شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: وضعیت گزارش به‌روز شد
 *                 report:
 *                   $ref: '#/components/schemas/Report'
 *       400:
 *         description: درخواست نامعتبر (وضعیت نامعتبر یا缺失)
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 *       404:
 *         description: گزارش یافت نشد
 *       500:
 *         description: خطای داخلی سرور
 */
router.put("/reports/:id/status", updateReportStatus);

/**
 * @swagger
 * /api/admin/reports/{id}:
 *   delete:
 *     summary: حذف گزارش (اختیاری)
 *     description: |
 *       این API برای حذف کامل یک گزارش از دیتابیس استفاده می‌شود.
 *       توجه: این عملیات فقط خود گزارش را حذف می‌کند و تأثیری بر روی هدف (آگهی یا چت) ندارد.
 *     tags: [Admin Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه گزارش
 *     responses:
 *       200:
 *         description: گزارش با موفقیت حذف شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: گزارش با موفقیت حذف شد
 *       400:
 *         description: شناسه گزارش معتبر نیست
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 *       404:
 *         description: گزارش یافت نشد
 *       500:
 *         description: خطای داخلی سرور
 */
router.delete("/reports/:id", deleteReport);

// ===== اکشن‌های مدیریتی =====

/**
 * @swagger
 * /api/admin/reports/{id}/delete-ad:
 *   delete:
 *     summary: حذف آگهی بر اساس گزارش
 *     description: |
 *       این API برای حذف کامل آگهی مربوط به یک گزارش استفاده می‌شود.
 *       - فقط برای انواع آگهی (employerAd, jobSeekerAd, sellerAd, DigitalAd) قابل استفاده است.
 *       - پس از حذف آگهی، وضعیت گزارش به reviewed تغییر می‌کند.
 *       - برای چت‌ها از API بلاک چت استفاده کنید.
 *     tags: [Admin Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه گزارش
 *     responses:
 *       200:
 *         description: آگهی با موفقیت حذف شد و گزارش بررسی شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: آگهی با موفقیت حذف شد و گزارش بررسی شد
 *       400:
 *         description: |
 *           خطاهای احتمالی:
 *           - شناسه گزارش معتبر نیست
 *           - نوع آگهی برای حذف پشتیبانی نمی‌شود (مثلاً اگر نوع chat باشد)
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 *       404:
 *         description: |
 *           خطاهای احتمالی:
 *           - گزارش یافت نشد
 *           - آگهی مورد نظر یافت نشد
 *       500:
 *         description: خطای داخلی سرور
 */
router.delete("/reports/:id/delete-ad", deleteAdByReport);

/**
 * @swagger
 * /api/admin/reports/{id}/block-chat:
 *   put:
 *     summary: بلاک کردن چت بر اساس گزارش
 *     description: |
 *       این API برای بلاک کردن مکالمه چت مربوط به یک گزارش استفاده می‌شود.
 *       - فقط برای نوع chat قابل استفاده است.
 *       - پس از بلاک، طرفین نمی‌توانند پیام جدیدی ارسال کنند.
 *       - وضعیت گزارش به reviewed تغییر می‌کند.
 *       - اطلاعات کامل چت، طرفین و تمام پیام‌های مکالمه برگردانده می‌شود.
 *     tags: [Admin Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه گزارش
 *     responses:
 *       200:
 *         description: مکالمه با موفقیت بلاک شد و گزارش بررسی شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: مکالمه با موفقیت بلاک شد و گزارش بررسی شد
 *                 conversation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     isBlocked:
 *                       type: boolean
 *                       example: true
 *                     participants:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           phone:
 *                             type: string
 *                           email:
 *                             type: string
 *                           role:
 *                             type: string
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           content:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           fromUser:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               phone:
 *                                 type: string
 *                           toUser:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               phone:
 *                                 type: string
 *       400:
 *         description: |
 *           خطاهای احتمالی:
 *           - شناسه گزارش معتبر نیست
 *           - این گزارش مربوط به چت نیست (نوع گزارش chat نیست)
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 *       404:
 *         description: |
 *           خطاهای احتمالی:
 *           - گزارش یافت نشد
 *           - چت یا مکالمه یافت نشد
 *       500:
 *         description: خطای داخلی سرور
 */
router.put("/reports/:id/block-chat", blockChatByReport);

export default router;
