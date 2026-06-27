import { Router } from "express";
import PricingCtrl from "../controllers/PricingCtrl";
import { authenticateAdmin } from "../middleware/authMidleware";
import { authenticateToken } from "../middleware/authMidleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Pricing
 *   description: مدیریت قیمت‌ها
 */

/**
 * @swagger
 * /api/pricing:
 *   get:
 *     summary: دریافت همه قیمت‌ها
 *     tags: [Pricing]
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
 *                     properties:
 *                       id:
 *                         type: string
 *                       key:
 *                         type: string
 *                         example: base_ad_price
 *                       value:
 *                         type: number
 *                         example: 100000
 *                       description:
 *                         type: string
 *       500:
 *         description: خطای سرور
 */
router.get("/pricing", authenticateToken, PricingCtrl.getAll);

/**
 * @swagger
 * /api/pricing/{key}:
 *   get:
 *     summary: دریافت یک قیمت با کلید
 *     tags: [Pricing]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: کلید قیمت (base_ad_price, special_price, ladder_price, renewal_price)
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
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                     value:
 *                       type: number
 *       404:
 *         description: قیمت یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.get("/pricing/:key", authenticateToken, PricingCtrl.getByKey);

/**
 * @swagger
 * /api/admin/pricing/{key}:
 *   put:
 *     summary: به‌روزرسانی یک قیمت
 *     tags: [Pricing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
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
 *               - value
 *             properties:
 *               value:
 *                 type: number
 *                 example: 120000
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     key:
 *                       type: string
 *                     value:
 *                       type: number
 *                     description:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       400:
 *         description: مقدار نامعتبر
 *       403:
 *         description: دسترسی غیرمجاز (فقط ادمین)
 *       404:
 *         description: قیمت یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.put("/admin/pricing/:key", authenticateAdmin, PricingCtrl.update);

export default router;