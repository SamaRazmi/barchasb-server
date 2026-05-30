const express = require("express");
const router = express.Router();
const JobCategoryCtrl = require("../controllers/JobCategoryCtrl");

/**
 * @swagger
 * tags:
 *   name: JobCategories
 *   description: مدیریت دسته‌های شغلی (مشترک بین کارفرما و کارجو) - شامل دسته‌های اصلی و مهارت‌ها
 */

/**
 * @swagger
 * /api/job-categories/main:
 *   get:
 *     summary: دریافت لیست دسته‌های اصلی شغلی
 *     tags: [JobCategories]
 *     description: این دسته‌ها برای هر دو نوع کاربر (کارفرما و جوینده کار) یکسان است. هر دسته اصلی شامل مجموعه‌ای از مهارت‌ها (زیردسته‌ها) می‌باشد.
 *     responses:
 *       200:
 *         description: موفق - لیست دسته‌های اصلی برگردانده شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6a09a01592cb42558565abb0"
 *                       name:
 *                         type: string
 *                         example: "فناوری اطلاعات و برنامه‌نویسی"
 *             example:
 *               status: "success"
 *               categories:
 *                 - _id: "6a09a01592cb42558565abb0"
 *                   name: "فناوری اطلاعات و برنامه‌نویسی"
 *                 - _id: "6a09a01592cb42558565abb3"
 *                   name: "طراحی و هنر"
 *       500:
 *         description: خطای سرور
 */

/**
 * @swagger
 * /api/job-categories/sub:
 *   get:
 *     summary: دریافت زیردسته‌های یک دسته اصلی (مهارت‌های مرتبط)
 *     tags: [JobCategories]
 *     description: |
 *       با استفاده از این مسیر می‌توان مهارت‌های مربوط به یک دسته شغلی خاص را دریافت کرد.
 *       این مهارت‌ها همان زیردسته‌ها هستند و برای پر کردن فیلد "مهارت‌ها" در فرم‌های استخدام و رزومه به کار می‌روند.
 *     parameters:
 *       - in: query
 *         name: parentId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دسته اصلی (که از مسیر /main دریافت شده است)
 *         example: "6a09a01592cb42558565abb0"
 *     responses:
 *       200:
 *         description: موفق - لیست مهارت‌ها (زیردسته‌ها) برگردانده شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6a09a01592cb42558565abb1"
 *                       name:
 *                         type: string
 *                         example: "توسعه وب (فرانت‌اند، بک‌اند، فول‌استک)"
 *             example:
 *               status: "success"
 *               categories:
 *                 - _id: "6a09a01592cb42558565abb1"
 *                   name: "توسعه وب (فرانت‌اند، بک‌اند، فول‌استک)"
 *                 - _id: "6a09a01592cb42558565abb2"
 *                   name: "توسعه اپلیکیشن موبایل"
 *       400:
 *         description: parentId ارائه نشده است
 *       500:
 *         description: خطای سرور
 */

/**
 * @swagger
 * /api/job-categories/search-sub:
 *   get:
 *     summary: جستجوی مهارت‌ها (زیردسته‌ها) بر اساس کلمه کلیدی
 *     tags: [JobCategories]
 *     description: |
 *       این مسیر فقط در میان زیردسته‌ها (مهارت‌ها) جستجو می‌کند و دسته‌های اصلی را شامل نمی‌شود.
 *       مناسب برای جستجوی زنده (live search) هنگام ورود مهارت توسط کاربر.
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: کلمه یا عبارت جستجو (ممکن است شامل فاصله باشد)
 *         example: "طراحی"
 *     responses:
 *       200:
 *         description: موفق - نتایج جستجو برگردانده شد (ممکن است خالی باشد)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *             example:
 *               status: "success"
 *               categories:
 *                 - _id: "6a09a01592cb42558565abb8"
 *                   name: "طراحی گرافیک (لوگو، بروشور، بنر)"
 *                 - _id: "6a09a01592cb42558565abb9"
 *                   name: "طراحی UI/UX"
 *       400:
 *         description: کلمه کلیدی ارائه نشده است
 *       500:
 *         description: خطای سرور
 */

/**
 * @swagger
 * /api/job-categories/sub/all:
 *   get:
 *     summary: دریافت تمام مهارت‌ها (زیردسته‌ها) بدون نیاز به parentId
 *     tags: [JobCategories]
 *     description: این مسیر همه زیردسته‌های موجود در دیتابیس را برمی‌گرداند (همه مهارت‌ها، بدون در نظر گرفتن دسته والدشان).
 *     responses:
 *       200:
 *         description: موفق - لیست تمام مهارت‌ها برگردانده شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       parent:
 *                         type: string
 *                         description: شناسه دسته والد (اختیاری)
 *             example:
 *               status: "success"
 *               categories:
 *                 - _id: "6a09a01592cb42558565abb1"
 *                   name: "توسعه وب (فرانت‌اند، بک‌اند، فول‌استک)"
 *                   parent: "6a09a01592cb42558565abb0"
 *                 - _id: "6a09a01592cb42558565abb2"
 *                   name: "توسعه اپلیکیشن موبایل"
 *                   parent: "6a09a01592cb42558565abb0"
 *       500:
 *         description: خطای سرور
 */

/**
 * @swagger
 * /api/job-categories/main/{mainId}/jobs:
 *   get:
 *     summary: دریافت آگهی‌های شغلی بر اساس دسته اصلی (فیلتر یکپارچه)
 *     tags: [JobCategories]
 *     description: |
 *       این مسیر تمام آگهی‌هایی را برمی‌گرداند که زیردسته (مهارت) آنها به دسته اصلی مشخص شده تعلق دارد.
 *       به این ترتیب نیازی نیست فرانت‌اند ابتدا زیردسته‌ها را و سپس آگهی‌ها را دریافت کند.
 *     parameters:
 *       - in: path
 *         name: mainId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دسته اصلی (که از /main دریافت می‌شود)
 *         example: "6a09a01592cb42558565abb0"
 *     responses:
 *       200:
 *         description: موفق - لیست آگهی‌ها برگردانده شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       subCategory:
 *                         type: object
 *       400:
 *         description: mainId ارائه نشده یا نامعتبر
 *       500:
 *         description: خطای سرور
 */

// مسیرها
router.get("/job-categories/main", JobCategoryCtrl.getMainCategories);
router.get("/job-categories/sub/all", JobCategoryCtrl.getAllSubCategories);
router.get("/job-categories/sub", JobCategoryCtrl.getSubCategories);
router.get("/job-categories/search-sub", JobCategoryCtrl.searchSubCategories);
router.get(
  "/job-categories/main/:mainId/jobs",
  JobCategoryCtrl.getJobsByMainCategory,
); // جدید

module.exports = router;
