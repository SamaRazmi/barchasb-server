import { Router } from "express";
import ArticlesCtrl from "../controllers/ArticlesCtrl";

const router = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: دریافت لیست دسته‌بندی‌های مقالات
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *       500:
 *         description: خطای سرور
 */
router.get("/categories", ArticlesCtrl.getCategories);

/**
 * @swagger
 * /api/public/articles/summary:
 *   get:
 *     summary: دریافت خلاصه مقالات منتشر شده (عمومی)
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   slugArticle:
 *                     type: string
 *                   mainImageUrl:
 *                     type: string
 *                   summary:
 *                     type: string
 *                   categoryId:
 *                     type: string
 *       500:
 *         description: خطای سرور
 */
router.get("/public/articles/summary", ArticlesCtrl.getArticlesSummary);

/**
 * @swagger
 * /api/articles/by-category:
 *   get:
 *     summary: دریافت مقالات کامل بر اساس دسته‌بندی
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دسته‌بندی
 *     responses:
 *       200:
 *         description: موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   slugArticle:
 *                     type: string
 *                   mainImageUrl:
 *                     type: string
 *                   summary:
 *                     type: string
 *                   categoryId:
 *                     type: string
 *                   text:
 *                     type: string
 *                   insideImageUrl:
 *                     type: string
 *                     nullable: true
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   category:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *       400:
 *         description: شناسه دسته ارسال نشده
 *       500:
 *         description: خطای سرور
 */
router.get("/articles/by-category", ArticlesCtrl.getArticlesByCategory);

export default router;