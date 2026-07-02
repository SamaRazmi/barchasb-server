import { Router } from "express";
import PurchaseCtrl from "../controllers/PurchaseCtrl";
import { authenticateUser } from "../middleware/authMidleware";

const router = Router();

/**
 * @swagger
 * /api/purchase/process-ad:
 *   post:
 *     summary: پرداخت برای آگهی ساخته‌شده
 *     tags: [Purchase]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adId
 *               - adType
 *               - paymentMethod
 *             properties:
 *               adId:
 *                 type: string
 *               adType:
 *                 type: string
 *                 enum: [EmployerAd, DigitalAd, JobSeekerAd, SellerAd]
 *               isSpecial:
 *                 type: boolean
 *                 default: false
 *               isLadder:
 *                 type: boolean
 *                 default: false
  *               ladderOption:
 *                 type: string
 *                 enum: [24h, 72h, 7d]
 *               paymentMethod:
 *                 type: string
 *                 enum: [Wallet, Bank_card]
 *     responses:
 *       200:
 *         description: موفق
 */
router.post("/purchase/process-ad", authenticateUser, PurchaseCtrl.processAdPayment);

/**
 * @swagger
 * /api/purchase/enhancement:
 *   post:
 *     summary: خرید افزونه به‌صورت جداگانه
 *     tags: [Purchase]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adId
 *               - adType
 *               - enhancementType
 *               - paymentMethod
 *             properties:
 *               adId:
 *                 type: string
 *               adType:
 *                 type: string
 *                 enum: [EmployerAd, DigitalAd, JobSeekerAd, SellerAd]
 *               enhancementType:
 *                 type: string
 *                 enum: [SPECIAL, LADDER, RENEWAL]
 *               ladderSchedule:
 *                 type: string
 *                 format: date-time
 *                 description: 
 *               ladderOption:          
 *                 type: string
 *                 enum: [now, 24h, 72h, 7d]
 *                 description:
 *               paymentMethod:
 *                 type: string
 *                 enum: [Wallet, Bank_card]
 *     responses:
 *       200:
 *         description: موفق
 */
router.post("/purchase/enhancement", authenticateUser, PurchaseCtrl.purchaseEnhancement);

export default router;