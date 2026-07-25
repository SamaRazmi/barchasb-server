import { Router } from 'express'
import AdminPricingCtrl from '../controllers/PricingManagementCtrl'
import { authenticateAdmin } from '../../middleware/authMidleware'

const router = Router()

/**
 * @swagger
 * /api/admin/pricing:
 *   get:
 *     tags: [Admin-Pricing]
 *     security:
 *       - BearerAuth: []
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
router.get("", authenticateAdmin, AdminPricingCtrl.getAll);

/**
 * @swagger
 * /api/admin/pricing/{key}:
 *   put:
 *     tags: [Admin-Pricing]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Price Key(base_ad_price, special_price, ladder_price, renewal_price)
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
 *       400:
 *         description: مقدار نامعتبر
 *       403:
 *         description: دسترسی غیرمجاز 
 *       404:
 *         description: قیمت یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.put('/:key', authenticateAdmin, AdminPricingCtrl.update)

export default router