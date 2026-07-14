import { Router } from "express";
import JobCategoryCtrl from "../controllers/JobCategoryCtrl";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: JobCategories
 *   description: مدیریت دسته‌های شغلی (اصلی و زیردسته‌ها)
 */

/**
 * @swagger
 * /api/job-categories/main:
 *   get:
 *     summary: دریافت همه دسته‌های اصلی (بدون والد)
 *     tags: [JobCategories]
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
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *       500:
 *         description: خطای سرور
 */
router.get("/job-categories/main", JobCategoryCtrl.getMainCategories);

/**
 * @swagger
 * /api/job-categories/sub:
 *   get:
 *     summary: دریافت زیردسته‌های یک دسته خاص
 *     tags: [JobCategories]
 *     parameters:
 *       - in: query
 *         name: parentId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دسته والد
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
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *       400:
 *         description: parentId ارسال نشده است
 *       500:
 *         description: خطای سرور
 */
router.get("/job-categories/sub", JobCategoryCtrl.getSubCategories);

/**
 * @swagger
 * /api/job-categories/search:
 *   get:
 *     summary: جستجو در زیردسته‌ها با کلمه کلیدی
 *     tags: [JobCategories]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: کلمه جستجو
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
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *       400:
 *         description: keyword ارسال نشده است
 *       500:
 *         description: خطای سرور
 */
router.get("/job-categories/search", JobCategoryCtrl.searchSubCategories);

/**
 * @swagger
 * /api/job-categories/sub/all:
 *   get:
 *     summary: دریافت همه زیردسته‌ها (مهارت‌ها) بدون نیاز به parentId
 *     tags: [JobCategories]
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
 *                         nullable: true
 *       500:
 *         description: خطای سرور
 */
router.get("/job-categories/sub/all", JobCategoryCtrl.getAllSubCategories);

/**
 * @swagger
 * /api/job-categories/main/{mainId}/jobs:
 *   get:
 *     summary: دریافت آگهی‌های شغلی بر اساس دسته اصلی (فیلتر سمت سرور)
 *     tags: [JobCategories]
 *     parameters:
 *       - in: path
 *         name: mainId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دسته اصلی
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
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: mainId ارسال نشده است
 *       500:
 *         description: خطای سرور
 */
router.get(
  "/job-categories/main/:mainId/jobs",
  JobCategoryCtrl.getJobsByMainCategory,
);

export default router;
