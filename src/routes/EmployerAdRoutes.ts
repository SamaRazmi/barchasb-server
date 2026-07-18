import { Router } from "express";
import { imagesUpload } from "../middleware/upload";
import EmployerAdCtrl from "../controllers/EmployerAdCtrl";
import { authenticateToken } from "../middleware/authMidleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: EmployerAds
 *   description: مدیریت آگهی‌های کارفرما
 */

/* ===================== CREATE ===================== */
/**
 * @swagger
 * /api/ads/employer:
 *   post:
 *     summary: ایجاد آگهی کارفرما
 *     tags: [EmployerAds]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - title
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: تصاویر آگهی (حداکثر ۹ عدد)
 *               name:
 *                 type: string
 *                 description: نام شرکت یا نام آگهی‌دهنده (اجباری)
 *               title:
 *                 type: string
 *                 description: عنوان آگهی (اجباری)
 *               categories:
 *                 type: string
 *                 description: JSON آرایه از دسته‌بندی‌ها (مثلاً [{"name":"فناوری","subCategories":["برنامه‌نویسی"]}])
 *               state:
 *                 type: string
 *                 description: استان
 *               city:
 *                 type: string
 *                 description: شهر
 *               cooperationType:
 *                 type: string
 *                 description: نوع همکاری
 *               gender:
 *                 type: string
 *                 description: جنسیت
 *               militaryStatus:
 *                 type: string
 *                 description: وضعیت نظام وظیفه
 *               experience:
 *                 type: string
 *                 description: سابقه کار
 *               paymentMethod:
 *                 type: string
 *                 description: روش پرداخت حقوق
 *               isRemote:
 *                 type: boolean
 *                 description: دورکاری
 *               thursdayUntilNoon:
 *                 type: boolean
 *                 description: پنج‌شنبه‌ها تا ظهر
 *               startTime:
 *                 type: string
 *                 description: ساعت شروع کار
 *               endTime:
 *                 type: string
 *                 description: ساعت پایان کار
 *               minSalary:
 *                 type: string
 *                 description: حداقل حقوق
 *               maxSalary:
 *                 type: string
 *                 description: حداکثر حقوق
 *               companyName:
 *                 type: string
 *                 description: نام شرکت
 *               companyType:
 *                 type: string
 *                 description: نوع شرکت
 *               benefits:
 *                 type: string
 *                 description: مزایا
 *               insurance:
 *                 type: string
 *                 description: بیمه
 *               education:
 *                 type: string
 *                 description: تحصیلات
 *               companyDescription:
 *                 type: string
 *                 description: توضیحات شرکت
 *               jobDetails:
 *                 type: string
 *                 description: JSON آرایه از جزئیات شغلی (مثلاً [{"title":"برنامه‌نویس","description":"مسئولیت‌ها"}])
 *               person:
 *                 type: string
 *                 enum: [self, other]
 *                 description: خودم / دیگری
 *               isVerified:
 *                 type: boolean
 *                 description: تأیید شده
 *               enableChat:
 *                 type: boolean
 *                 description: فعال‌سازی چت
 *               enablePhone:
 *                 type: boolean
 *                 description: نمایش تلفن
 *               adPaymentMethod:
 *                 type: string
 *                 enum: [Subscription, Wallet, Bank_card]
 *                 description: روش پرداخت آگهی
 *               adStatus:
 *                 type: string
 *                 enum: [pending, approved, rejected, expired]
 *                 description: وضعیت آگهی
 *     responses:
 *       201:
 *         description: آگهی ایجاد شد
 *       400:
 *         description: خطای اعتبارسنجی (مثلاً name缺失)
 *       401:
 *         description: عدم احراز هویت
 */
router.post(
  "/ads/employer",
  authenticateToken,
  imagesUpload.array("images", 9),
  EmployerAdCtrl.createEmployerAd,
);

/* ===================== GET ALL (با فیلترهای پیشرفته) ===================== */
/**
 * @swagger
 * /api/ads/employer:
 *   get:
 *     summary: دریافت همه آگهی‌های کارفرما (عمومی) با فیلترهای پیشرفته
 *     tags: [EmployerAds]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: جستجو در عنوان، نام و نام شرکت
 *       - in: query
 *         name: timeFilter
 *         schema:
 *           type: string
 *           enum: [today, thisWeek, thisMonth, thisYear]
 *         description: بازه زمانی انتشار آگهی
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
 *         name: cooperationType
 *         schema:
 *           type: string
 *         description: نوع همکاری (مثلاً تمام‌وقت، پاره‌وقت)
 *       - in: query
 *         name: isRemote
 *         schema:
 *           type: boolean
 *         description: دورکاری (true/false)
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *         description: جنسیت مورد نیاز
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *         description: سابقه کار مورد نیاز
 *       - in: query
 *         name: minSalary
 *         schema:
 *           type: string
 *         description: حداقل حقوق (به صورت عددی، اما به دلیل ذخیره به صورت رشته، فعلاً پشتیبانی نمی‌شود)
 *       - in: query
 *         name: maxSalary
 *         schema:
 *           type: string
 *         description: حداکثر حقوق (به صورت عددی، اما به دلیل ذخیره به صورت رشته، فعلاً پشتیبانی نمی‌شود)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: شماره صفحه
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 9
 *         description: تعداد آیتم در هر صفحه
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
router.get("/ads/employer", EmployerAdCtrl.getAllEmployerAds);

/* ===================== GET BY OWNER ===================== */
/**
 * @swagger
 * /api/ads/employer/owner/{ownerId}:
 *   get:
 *     summary: دریافت آگهی‌های یک کاربر خاص (با پیجینیشن)
 *     tags: [EmployerAds]
 *     parameters:
 *       - name: ownerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: شماره صفحه
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 9
 *         description: تعداد آیتم در هر صفحه
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
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
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
 *       400:
 *         description: شناسه نامعتبر
 */
router.get("/ads/employer/owner/:ownerId", EmployerAdCtrl.getAdsByOwner);

/* ===================== GET SINGLE ===================== */
/**
 * @swagger
 * /api/ads/employer/{id}:
 *   get:
 *     summary: دریافت آگهی با ID
 *     tags: [EmployerAds]
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
 *         description: یافت نشد
 */
router.get("/ads/employer/:id", EmployerAdCtrl.getEmployerAdById);

/* ===================== GET & UPDATE BY OWNER + AD ===================== */
/**
 * @swagger
 * /api/ads/employer/{ownerId}/{adId}:
 *   get:
 *     summary: دریافت یک آگهی مشخص از یک کاربر مشخص
 *     tags: [EmployerAds]
 *     parameters:
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
 *         description: موفق
 *       404:
 *         description: آگهی یافت نشد
 *   put:
 *     summary: ویرایش آگهی کارفرما (فقط مالک)
 *     tags: [EmployerAds]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: ownerId
 *         in: path
 *         required: true
 *       - name: adId
 *         in: path
 *         required: true
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
 *                 description: تصاویر جدید
 *               imagesFromApi:
 *                 type: string
 *                 description: JSON آرایه از تصاویر موجود برای نگهداری
 *               name:
 *                 type: string
 *               title:
 *                 type: string
 *               categories:
 *                 type: string
 *               # ... سایر فیلدها مشابه ایجاد
 *     responses:
 *       200:
 *         description: ویرایش موفق
 *       401:
 *         description: عدم احراز هویت
 *       404:
 *         description: آگهی یافت نشد
 */
router
  .route("/ads/employer/:ownerId/:adId")
  .get(EmployerAdCtrl.getEmployerAdByOwnerAndId)
  .put(
    authenticateToken,
    imagesUpload.array("images", 9),
    EmployerAdCtrl.updateEmployerAd,
  );

/* ===================== DELETE ===================== */
/**
 * @swagger
 * /api/ads/employer/{adId}:
 *   delete:
 *     summary: حذف آگهی کارفرما (فقط مالک)
 *     tags: [EmployerAds]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: adId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: آگهی با موفقیت حذف شد
 *       401:
 *         description: عدم احراز هویت
 *       404:
 *         description: آگهی یافت نشد یا دسترسی ندارید
 *       500:
 *         description: خطای سرور
 */
router.delete(
  "/ads/employer/:adId",
  authenticateToken,
  EmployerAdCtrl.deleteEmployerAd,
);

export default router;
