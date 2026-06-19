import { Router } from "express";
import AdCategoryAttributesCtrl from "../controllers/AdCategoryAttributesCtrl";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: AdCategoryAttributes
 *   description: مدیریت ویژگی‌های دسته‌بندی آگهی‌ها (داده‌های استاتیک)
 */

/**
 * @swagger
 * /api/ad-category-attributes:
 *   get:
 *     summary: دریافت همه ویژگی‌های دسته‌بندی‌ها
 *     tags: [AdCategoryAttributes]
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
 *                   name:
 *                     type: string
 *                   parent:
 *                     type: string
 *                   fields:
 *                     type: array
 *                     items:
 *                       type: object
 *       500:
 *         description: خطای سرور
 */
router.get(
  "/ad-category-attributes",
  AdCategoryAttributesCtrl.getAllCategoryAttributes,
);

/**
 * @swagger
 * /api/ad-category-attributes/{categoryName}:
 *   get:
 *     summary: دریافت ویژگی‌های یک دسته‌بندی خاص بر اساس نام
 *     tags: [AdCategoryAttributes]
 *     parameters:
 *       - in: path
 *         name: categoryName
 *         required: true
 *         schema:
 *           type: string
 *         description: نام دسته‌بندی (به فارسی)
 *     responses:
 *       200:
 *         description: موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categoryName:
 *                   type: string
 *                 parent:
 *                   type: string
 *                 fields:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: دسته‌بندی یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.get(
  "/ad-category-attributes/:categoryName",
  AdCategoryAttributesCtrl.getAttributesByCategory,
);

export default router;
