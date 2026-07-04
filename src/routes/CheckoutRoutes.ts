import { Router } from "express";
import CheckoutCtrl from "../controllers/CheckoutCtrl";
import { authenticateUser } from "../middleware/authMidleware";

const router = Router();

/**
 * @swagger
 * /api/checkout/calculate:
 *   post:
 *     summary: محاسبه هزینه نهایی قبل از خرید
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adType
 *               - paymentMethod
 *             properties:
 *               adType:
 *                 type: string
 *                 enum: [EmployerAd, DigitalAd, JobSeekerAd, SellerAd]
 *               isNewAd:
 *                 type: boolean
 *                 default: true
 *               isSpecial:
 *                 type: boolean
 *                 default: false
 *               isLadder:
 *                 type: boolean
 *                 default: false
 *               isRenewal:
 *                 type: boolean
 *                 default: false
 *               paymentMethod:
 *                 type: string
 *                 enum: [Wallet, Bank_card, Subscription]
 *     responses:
 *       200:
 *         description: موفق
 */
router.post("/checkout/calculate", authenticateUser, CheckoutCtrl.calculate);

export default router;