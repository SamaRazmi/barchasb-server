// src/routes/AdCategoryRoutes.ts
import { Router } from "express";
import AdCategoryCtrl from "../controllers/AdCategoryCtrl";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: AdCategory
 *   description: مدیریت دسته‌بندی‌های آگهی
 */

/**
 * @swagger
 * /api/ad-categories/main:
 *   get:
 *     summary: دریافت همه دسته‌های اصلی (سر دسته‌ها)
 *     tags: [AdCategory]
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
router.get("/ad-categories/main", AdCategoryCtrl.getMainCategories);

/**
 * @swagger
 * /api/ad-categories/{id}/subcategories:
 *   get:
 *     summary: دریافت زیر دسته‌ها برای یک دسته اصلی
 *     tags: [AdCategory]
 *     parameters:
 *       - in: path
 *         name: id
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
 *                 category:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     subCategories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *       404:
 *         description: دسته اصلی یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.get("/ad-categories/:id/subcategories", AdCategoryCtrl.getSubCategories);

export default router;
